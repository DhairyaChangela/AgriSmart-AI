import logging
from typing import Any, Dict
import httpx
from app.backend.schemas.weather import (
    AgriculturalWeatherAdvisory,
    CurrentWeather,
    DailyForecast,
    WeatherLocation,
    WeatherResponse,
)

logger = logging.getLogger("agrismart.weather")

WMO_CODE_MAP: Dict[int, str] = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm",
}


def parse_wmo_code(code: int) -> str:
    return WMO_CODE_MAP.get(code, "Unknown conditions")


class WeatherService:
    BASE_URL = "https://api.open-meteo.com/v1/forecast"

    @classmethod
    async def get_weather_data(cls, latitude: float, longitude: float) -> WeatherResponse:
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "current": "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m",
            "daily": "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max",
            "timezone": "auto",
            "forecast_days": 7,
        }

        async with httpx.AsyncClient(timeout=6.0) as client:
            try:
                response = await client.get(cls.BASE_URL, params=params)
            except (httpx.ConnectError, httpx.TimeoutException) as exc:
                logger.error(f"Open-Meteo connection error: {exc}")
                raise ConnectionError("Weather provider unreachable or timed out.")
            except httpx.RequestError as exc:
                logger.error(f"Open-Meteo request error: {exc}")
                raise RuntimeError("Failed to transmit request to weather provider.")

        if response.status_code != 200:
            raise ValueError("External weather provider returned an invalid response code.")

        try:
            raw_data = response.json()
            return cls._normalize_response(latitude, longitude, raw_data)
        except (KeyError, IndexError, ValueError) as exc:
            logger.error(f"Malformed Open-Meteo data: {exc}")
            raise ValueError("Weather provider returned incomplete data.")

    @classmethod
    def _normalize_response(
        cls, latitude: float, longitude: float, raw: Dict[str, Any]
    ) -> WeatherResponse:
        current_raw = raw["current"]
        daily_raw = raw["daily"]

        current_code = int(current_raw.get("weather_code", 0))
        current = CurrentWeather(
            temperature_c=float(current_raw.get("temperature_2m", 0.0)),
            humidity_percent=int(current_raw.get("relative_humidity_2m", 0)),
            precipitation_mm=float(current_raw.get("precipitation", 0.0)),
            wind_speed_kmh=float(current_raw.get("wind_speed_10m", 0.0)),
            weather_code=current_code,
            condition=parse_wmo_code(current_code),
        )

        dates = daily_raw.get("time", [])
        min_temps = daily_raw.get("temperature_2m_min", [])
        max_temps = daily_raw.get("temperature_2m_max", [])
        precip_sums = daily_raw.get("precipitation_sum", [])
        precip_probs = daily_raw.get("precipitation_probability_max", [])
        wmo_codes = daily_raw.get("weather_code", [])

        forecast_list = []
        for i in range(len(dates)):
            w_code = int(wmo_codes[i]) if i < len(wmo_codes) else 0
            forecast_list.append(
                DailyForecast(
                    date=dates[i],
                    min_temperature_c=float(min_temps[i]) if i < len(min_temps) else 0.0,
                    max_temperature_c=float(max_temps[i]) if i < len(max_temps) else 0.0,
                    precipitation_probability_percent=(
                        int(precip_probs[i])
                        if i < len(precip_probs) and precip_probs[i] is not None
                        else 0
                    ),
                    precipitation_mm=(
                        float(precip_sums[i])
                        if i < len(precip_sums) and precip_sums[i] is not None
                        else 0.0
                    ),
                    weather_code=w_code,
                    condition=parse_wmo_code(w_code),
                )
            )

        advisory = cls._calculate_agricultural_indicators(current, forecast_list)

        return WeatherResponse(
            status="success",
            location=WeatherLocation(latitude=latitude, longitude=longitude),
            current=current,
            forecast=forecast_list,
            agricultural_advisory=advisory,
        )

    @staticmethod
    def _calculate_agricultural_indicators(
        current: CurrentWeather, forecast: list[DailyForecast]
    ) -> AgriculturalWeatherAdvisory:
        today_forecast = forecast[0] if len(forecast) > 0 else None
        tomorrow_forecast = forecast[1] if len(forecast) > 1 else None

        day1_rain = (today_forecast.precipitation_mm if today_forecast else 0.0) >= 1.0
        day2_rain = (tomorrow_forecast.precipitation_mm if tomorrow_forecast else 0.0) >= 1.0
        rain_24h = day1_rain or current.precipitation_mm >= 1.0
        rain_48h = rain_24h or day2_rain

        day1_prob = (
            today_forecast.precipitation_probability_percent if today_forecast else 0
        )
        high_prob = day1_prob >= 60

        delay_irrigation = rain_24h or high_prob

        notes = []
        if delay_irrigation:
            notes.append(
                f"Significant rainfall expected ({today_forecast.precipitation_mm if today_forecast else 0.0} mm, "
                f"{day1_prob}% probability). Consider postponing surface irrigation."
            )
        else:
            notes.append("No immediate significant rainfall anticipated within 24 hours.")

        if current.humidity_percent >= 80:
            notes.append(
                "Sustained high relative humidity (>80%) detected; monitor crops for fungal vulnerability."
            )

        return AgriculturalWeatherAdvisory(
            rain_expected_24h=rain_24h,
            rain_expected_48h=rain_48h,
            high_rain_probability=high_prob,
            irrigation_delay_recommended=delay_irrigation,
            advisory_note=" ".join(notes),
        )
