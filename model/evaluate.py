from pathlib import Path
import json

import torch
import numpy as np
import matplotlib.pyplot as plt

from sklearn.metrics import (
    accuracy_score,
    f1_score,
    classification_report,
    confusion_matrix,
    ConfusionMatrixDisplay,
)

from model.dataset import create_dataloaders
from model.architectures.classifier import create_model


PROJECT_ROOT = Path(__file__).resolve().parent.parent

CHECKPOINT_PATH = PROJECT_ROOT / "model" / "checkpoints" / "best_model.pth"
LABELS_PATH = PROJECT_ROOT / "model" / "labels" / "classes.json"
RESULTS_DIR = PROJECT_ROOT / "results"

BATCH_SIZE = 32


def main():
    print("=" * 60)
    print("AgriSmart AI - Model Evaluation")
    print("=" * 60)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Device: {device}")

    if not CHECKPOINT_PATH.exists():
        print("\nModel checkpoint not found:")
        print(CHECKPOINT_PATH)
        print("\nWait for training to finish first.")
        return

    with open(LABELS_PATH, "r", encoding="utf-8") as f:
        classes = json.load(f)

    print(f"Classes: {len(classes)}")

    # Load validation dataset
    _, val_loader = create_dataloaders(batch_size=BATCH_SIZE)

    # Load model
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

    print("\nRunning evaluation...")

    all_predictions = []
    all_targets = []

    with torch.no_grad():
        for images, targets in val_loader:
            images = images.to(device)
            outputs = model(images)

            predictions = torch.argmax(outputs, dim=1)

            all_predictions.extend(predictions.cpu().numpy())
            all_targets.extend(targets.numpy())

    all_predictions = np.array(all_predictions)
    all_targets = np.array(all_targets)

    # Metrics
    accuracy = accuracy_score(all_targets, all_predictions)

    macro_f1 = f1_score(
        all_targets,
        all_predictions,
        average="macro",
        zero_division=0,
    )

    print("\n" + "=" * 60)
    print("OVERALL RESULTS")
    print("=" * 60)

    print(f"Accuracy : {accuracy:.4f}")
    print(f"Macro-F1 : {macro_f1:.4f}")

    # Per-class metrics
    report = classification_report(
        all_targets,
        all_predictions,
        target_names=classes,
        zero_division=0,
    )

    print("\n" + "=" * 60)
    print("PER-CLASS METRICS")
    print("=" * 60)
    print(report)

    # Create results directory
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)

    # Save classification report
    report_path = RESULTS_DIR / "classification_report.txt"

    with open(report_path, "w", encoding="utf-8") as f:
        f.write("AgriSmart AI - Classification Report\n\n")
        f.write(f"Accuracy: {accuracy:.4f}\n")
        f.write(f"Macro-F1: {macro_f1:.4f}\n\n")
        f.write(report)

    # Confusion matrix
    cm = confusion_matrix(
        all_targets,
        all_predictions,
    )

    fig, ax = plt.subplots(figsize=(20, 20))

    disp = ConfusionMatrixDisplay(
        confusion_matrix=cm,
        display_labels=classes,
    )

    disp.plot(
        ax=ax,
        xticks_rotation=90,
        colorbar=False,
    )

    plt.title("AgriSmart AI - Confusion Matrix")
    plt.tight_layout()

    confusion_path = RESULTS_DIR / "confusion_matrix.png"
    plt.savefig(confusion_path, dpi=200)
    plt.close()

    print("\nResults saved:")
    print(f"Classification report: {report_path}")
    print(f"Confusion matrix:      {confusion_path}")

    print("\nEvaluation complete.")


if __name__ == "__main__":
    main()