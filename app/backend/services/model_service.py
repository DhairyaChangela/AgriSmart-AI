from pathlib import Path

import torch

from model.predict import predict


class ModelService:
    def __init__(self):
        self.checkpoint_path = (
            Path(__file__).resolve().parents[3]
            / "model"
            / "checkpoints"
            / "best_model.pth"
        )

    def is_model_available(self):
        return self.checkpoint_path.exists()

    def predict_image(self, image_path):
        if not self.is_model_available():
            return {
                "status": "model_not_ready",
                "message": "The trained model is not available yet.",
            }

        class_label, confidence = predict(image_path)

        parts = class_label.split("___", 1)

        crop = parts[0] if parts else class_label
        disease = parts[1] if len(parts) > 1 else class_label

        return {
            "status": "success",
            "class": class_label,
            "crop": crop,
            "disease": disease,
            "confidence": round(confidence, 4),
            "confidence_percent": round(confidence * 100, 2),
        }


model_service = ModelService()
