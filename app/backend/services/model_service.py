from pathlib import Path

from model.predict import predict


class ModelService:
    # Stage 3 validation thresholds.
    MIN_CONFIDENCE = 0.60
    MIN_TOP1_TOP2_GAP = 0.20

    _CHECKPOINTS_DIR = (
        Path(__file__).resolve().parents[3] / "model" / "checkpoints"
    )

    # Check common checkpoint names; use the first one that exists.
    _CHECKPOINT_NAMES = ["generalized_model.pth", "best_model.pth"]

    def __init__(self):
        self.checkpoint_path = next(
            (
                p
                for name in self._CHECKPOINT_NAMES
                if (p := self._CHECKPOINTS_DIR / name).exists()
            ),
            self._CHECKPOINTS_DIR / self._CHECKPOINT_NAMES[0],
        )

    def is_model_available(self):
        return self.checkpoint_path.exists()

    def predict_image(self, image_path):
        if not self.is_model_available():
            return {
                "status": "model_not_ready",
                "message": "The trained model is not available yet.",
            }

        class_label, confidence, top_predictions = predict(
            image_path
        )

        parts = class_label.split("___", 1)

        crop = parts[0] if parts else class_label
        disease = parts[1] if len(parts) > 1 else class_label

        # Stage 3: validate prediction reliability.
        top1_confidence = top_predictions[0]["confidence"]

        top2_confidence = (
            top_predictions[1]["confidence"]
            if len(top_predictions) > 1
            else 0.0
        )

        prediction_gap = top1_confidence - top2_confidence

        is_reliable = (
            top1_confidence >= self.MIN_CONFIDENCE
            and prediction_gap >= self.MIN_TOP1_TOP2_GAP
        )

        if is_reliable:
            prediction_status = "accepted"
            validation_message = (
                "The model produced a sufficiently decisive prediction."
            )
        else:
            prediction_status = "uncertain"
            validation_message = (
                "The model is uncertain about this prediction. "
                "Please upload a clearer and closer image of the "
                "affected leaf or crop."
            )

        return {
            "status": "success",
            "prediction_status": prediction_status,
            "validation_message": validation_message,
            "class": class_label,
            "crop": crop,
            "disease": disease,
            "confidence": round(confidence, 4),
            "confidence_percent": round(confidence * 100, 2),
            "prediction_gap": round(prediction_gap, 4),
            "prediction_gap_percent": round(
                prediction_gap * 100,
                2,
            ),
            "top_predictions": top_predictions,
        }


model_service = ModelService()