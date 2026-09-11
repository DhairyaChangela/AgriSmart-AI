import argparse
import json
from pathlib import Path

import torch
from PIL import Image

from model.architectures.classifier import create_model
from model.preprocessing import get_val_transform


PROJECT_ROOT = Path(__file__).resolve().parent.parent

CHECKPOINT_PATH = PROJECT_ROOT / "model" / "checkpoints" / "best_model.pth"
LABELS_PATH = PROJECT_ROOT / "model" / "labels" / "classes.json"


def load_model(device):
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

    model.load_state_dict(checkpoint["model_state_dict"])
    model.to(device)
    model.eval()

    return model, classes


def predict(image_path):
    device = torch.device(
        "cuda" if torch.cuda.is_available() else "cpu"
    )

    model, classes = load_model(device)

    image_path = Path(image_path)

    if not image_path.exists():
        raise FileNotFoundError(
            f"Image not found: {image_path}"
        )

    transform = get_val_transform()

    image = Image.open(image_path).convert("RGB")
    image_tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(image_tensor)
        probabilities = torch.softmax(outputs, dim=1)

        confidence, predicted_index = torch.max(
            probabilities,
            dim=1,
        )

    predicted_index = predicted_index.item()
    confidence = confidence.item()

    class_label = classes[predicted_index]

    return class_label, confidence


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

    class_label, confidence = predict(args.image)

    print()
    print("=" * 50)
    print("AgriSmart AI - Prediction")
    print("=" * 50)
    print(f"Prediction : {class_label}")
    print(f"Confidence : {confidence * 100:.2f}%")
    print("=" * 50)


if __name__ == "__main__":
    main()
