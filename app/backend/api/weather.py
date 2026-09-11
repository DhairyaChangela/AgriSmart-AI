from fastapi import APIRouter, HTTPException, Query, status
from app.backend.schemas.weather import WeatherErrorResponse, WeatherResponse
from app.backend.services.weather_service import WeatherService

router = APIRouter(prefix="/weather", tags=["Weather Intelligence"])


@router.get("", response_model=WeatherResponse)
async def get_weather(
    latitude: float = Query(..., ge=-90.0, le=90.0, description="Latitude (-90 to 90)"),
    longitude: float = Query(..., ge=-180.0, le=180.0, description="Longitude (-180 to 180)"),
):
    try:
        return await WeatherService.get_weather_data(latitude, longitude)
    except ConnectionError:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail={"status": "error", "message": "Weather provider unreachable."},
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail={"status": "error", "message": str(e)},
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"status": "error", "message": "Internal error processing weather data."},
        )
