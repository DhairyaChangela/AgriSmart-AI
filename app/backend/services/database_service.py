from sqlalchemy.orm import Session

from app.backend.database.models import PredictionHistory


def save_prediction(
    db: Session,
    result: dict,
) -> PredictionHistory:
    prediction = PredictionHistory(
        crop=result["crop"],
        disease=result["disease"],
        class_label=result["class"],
        confidence=result["confidence"],
    )

    db.add(prediction)
    db.commit()
    db.refresh(prediction)

    return prediction