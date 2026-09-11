from typing import List, Optional
from pydantic import BaseModel, Field


class WeatherLocation(BaseModel):
    latitude: float
    longitude: float


class CurrentWeather(BaseModel):
    temperature_c: float
    humidity_percent: int
    precipitation_mm: float
    wind_speed_kmh: float
    weather_code: int
    condition: str


class DailyForecast(BaseModel):
    date: str
    min_temperature_c: float
    max_temperature_c: float
    precipitation_probability_percent: Optional[int] = 0
    precipitation_mm: float
    weather_code: int
    condition: str


class AgriculturalWeatherAdvisory(BaseModel):
    rain_expected_24h: bool = Field(
        description="True if measurable rainfall (>= 1.0mm) is forecast in the next 24 hours"
    )
    rain_expected_48h: bool = Field(
        description="True if measurable rainfall (>= 1.0mm) is forecast across the next 48 hours"
    )
    high_rain_probability: bool = Field(
        description="True if 24h precipitation probability exceeds 60%"
    )
    irrigation_delay_recommended: bool = Field(
        description="Advisory flag indicating whether irrigation can be postponed due to imminent rain"
    )
    advisory_note: str = Field(
        description="Deterministic guidance based on live forecast values"
    )


class WeatherResponse(BaseModel):
    status: str = "success"
    location: WeatherLocation
    current: CurrentWeather
    forecast: List[DailyForecast]
    agricultural_advisory: AgriculturalWeatherAdvisory


class WeatherErrorResponse(BaseModel):
    status: str = "error"
    message: str
