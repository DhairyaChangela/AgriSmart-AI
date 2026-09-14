from pathlib import Path
import shutil
import tempfile

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from PIL import UnidentifiedImageError
from sqlalchemy.orm import Session

from app.backend.database.database import get_db
from app.backend.services.database_service import save_prediction
from app.backend.services.image_validation_service import image_validation_service
from app.backend.services.model_service import model_service


router = APIRouter()


@router.post("/predict")
async def predict_crop(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    # Validate uploaded file extension.
    # Actual image contents are validated by PIL.
    filename = file.filename or ""
    suffix = Path(filename).suffix.lower()

    if suffix not in {".jpg", ".jpeg", ".png", ".webp"}:
        raise HTTPException(
            status_code=400,
            detail="Please upload a JPG, JPEG, PNG, or WEBP image.",
        )

    temp_path = None

    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix,
        ) as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_path = Path(temp_file.name)

        # Stage 1: Validate the uploaded image
        validation = image_validation_service.validate_file(temp_path)

        if not validation["valid"]:
            return validation

        # Stage 2 + Stage 3: Run classifier and validate result
        result = model_service.predict_image(temp_path)

        # Save successful predictions
        if result.get("status") == "success":
            save_prediction(db, result)

        return result

    except UnidentifiedImageError:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is not a valid image.",
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(exc)}",
        )

    finally:
        # Always remove temporary uploaded file
        if temp_path is not None and temp_path.exists():
            temp_path.unlink(missing_ok=True)