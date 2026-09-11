from pathlib import Path
import shutil
import tempfile

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
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

    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Please upload a JPG, JPEG, PNG, or WEBP image.",
        )

    suffix = Path(file.filename or "").suffix.lower()

    if suffix not in {".jpg", ".jpeg", ".png", ".webp"}:
        suffix = ".jpg"

    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix,
        ) as temp_file:

            shutil.copyfileobj(file.file, temp_file)
            temp_path = Path(temp_file.name)

        result = model_service.predict_image(temp_path)

        # Save only successful model predictions.
        if result.get("status") == "success":
            save_prediction(db, result)

        return result

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(exc)}",
        )

    finally:
        if temp_path is not None and temp_path.exists():
            temp_path.unlink(missing_ok=True)