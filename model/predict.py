import argparse
import json
from pathlib import Path

import torch
from PIL import Image

from model.architectures.classifier import create_model
from model.preprocessing import get_val_transform


PROJECT_ROOT = Path(__file__).resolve().parent.parent

# Final selected model
CHECKPOINT_PATH = (
    PROJECT_ROOT
    / "model"
    / "checkpoints"
    / "generalized_model.pth"
)

LABELS_PATH = (
    PROJECT_ROOT
    / "model"
    / "labels"
    / "classes.json"
)


_model_cache = {}


def get_device():
    return torch.device(
        "cuda" if torch.cuda.is_available() else "cpu"
    )


def load_model(device=None):
    if device is None:
        device = get_device()

    cache_key = str(device)

    if cache_key in _model_cache:
        return _model_cache[cache_key]

    if not CHECKPOINT_PATH.exists():
        raise FileNotFoundError(
            f"Model checkpoint not found: {CHECKPOINT_PATH}"
        )

    if not LABELS_PATH.exists():
        raise FileNotFoundError(
            f"Class labels not found: {LABELS_PATH}"
        )

    with open(LABELS_PATH, "r", encoding="utf-8") as f:
        classes = json.load(f)

    model = create_model(
        num_classes=len(classes),
        pretrained=False,
    )

    checkpoint = torch.load(
        CHECKPOINT_PATH,
        map_location=device,
        weights_only=False,
    )

    model.load_state_dict(
        checkpoint["model_state_dict"]
    )

    model.to(device)
    model.eval()

    _model_cache[cache_key] = (model, classes)

    return model, classes


def predict(image_path, top_k=3):
    device = get_device()

    model, classes = load_model(device)

    image_path = Path(image_path)

    if not image_path.exists():
        raise FileNotFoundError(
            f"Image not found: {image_path}"
        )

    transform = get_val_transform()

    image = Image.open(image_path).convert("RGB")

    image_tensor = (
        transform(image)
        .unsqueeze(0)
        .to(device)
    )

    with torch.inference_mode():
        outputs = model(image_tensor)

        probabilities = torch.softmax(
            outputs,
            dim=1,
        )

        top_k = min(
            top_k,
            len(classes),
        )

        top_probabilities, top_indices = torch.topk(
            probabilities,
            k=top_k,
            dim=1,
        )

    top_predictions = []

    for probability, index in zip(
        top_probabilities[0],
        top_indices[0],
    ):
        class_label = classes[index.item()]
        confidence = probability.item()

        top_predictions.append(
            {
                "class": class_label,
                "confidence": round(
                    confidence,
                    4,
                ),
                "confidence_percent": round(
                    confidence * 100,
                    2,
                ),
            }
        )

    best_prediction = top_predictions[0]

    return (
        best_prediction["class"],
        best_prediction["confidence"],
        top_predictions,
    )


def main():
    parser = argparse.ArgumentParser(
        description="AgriSmart AI - Crop Disease Prediction"
    )

    parser.add_argument(
        "--image",
        required=True,
        help="Path to the crop/leaf image",
    )

    args = parser.parse_args()

    class_label, confidence, top_predictions = predict(
        args.image
    )

    print()
    print("=" * 50)
    print("AgriSmart AI - Prediction")
    print("=" * 50)

    print(
        f"Prediction : {class_label}"
    )

    print(
        f"Confidence : {confidence * 100:.2f}%"
    )

    print()
    print("Top Predictions:")

    for rank, prediction in enumerate(
        top_predictions,
        start=1,
    ):
        print(
            f"{rank}. "
            f"{prediction['class']} - "
            f"{prediction['confidence_percent']:.2f}%"
        )

    print("=" * 50)


if __name__ == "__main__":
    main()