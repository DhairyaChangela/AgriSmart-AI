from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.backend.database.database import get_db
from app.backend.database.models import PredictionHistory


router = APIRouter()


@router.get("/history")
def get_prediction_history(
    db: Session = Depends(get_db),
):
    predictions = (
        db.query(PredictionHistory)
        .order_by(PredictionHistory.created_at.desc())
        .limit(20)
        .all()
    )

    return {
        "status": "success",
        "count": len(predictions),
        "history": [
            {
                "id": prediction.id,
                "crop": prediction.crop,
                "disease": prediction.disease,
                "class": prediction.class_label,
                "confidence": prediction.confidence,
                "confidence_percent": round(
                    prediction.confidence * 100,
                    2,
                ),
                "created_at": prediction.created_at.isoformat(),
            }
            for prediction in predictions
        ],
    }