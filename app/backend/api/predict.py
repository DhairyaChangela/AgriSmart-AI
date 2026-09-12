from pathlib import Path
import shutil
import tempfile
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from PIL import UnidentifiedImageError
from sqlalchemy.orm import Session
from app.backend.database.database import get_db
from app.backend.services.database_service import save_prediction
from app.backend.services.model_service import model_service
router = APIRouter()
@router.post("/predict")
async def predict_crop(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    # Allowed MIME types
    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",
    }
    # Validate uploaded file type
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Please upload a JPG, JPEG, PNG, or WEBP image.",
        )
    # Determine file extension
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in {".jpg", ".jpeg", ".png", ".webp"}:
        suffix = ".jpg"
    temp_path = None
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix,
        ) as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_path = Path(temp_file.name)
        # Run model prediction
        result = model_service.predict_image(temp_path)
        # Save only successful predictions
        if result.get("status") == "success":
            save_prediction(db, result)
        return result
    except UnidentifiedImageError:
        # File has a valid image extension/MIME type but is not
        # actually a readable image.
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is not a valid image.",
        )
    except Exception as exc:
        # Unexpected server/model error
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(exc)}",
        )
    finally:
        # Always remove temporary uploaded file
        if temp_path is not None and temp_path.exists():
            temp_path.unlink(missing_ok=True)
