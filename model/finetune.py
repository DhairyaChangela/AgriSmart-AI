import json
import random
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
from sklearn.metrics import f1_score, accuracy_score
from torch.optim import AdamW
from torch.optim.lr_scheduler import ReduceLROnPlateau

from model.dataset import (
    build_samples,
    create_train_val_split,
    create_dataloaders,
)
from model.preprocessing import (
    get_train_transform,
    get_val_transform,
)
from model.architectures.classifier import create_model


# ============================================================
# Configuration
# ============================================================

SEED = 42

BATCH_SIZE = 32
NUM_EPOCHS = 5

# Lower LR because we are fine-tuning an already trained model.
LEARNING_RATE = 2e-5
WEIGHT_DECAY = 1e-4

NUM_WORKERS = 0

PROJECT_ROOT = Path(__file__).resolve().parent.parent

CHECKPOINT_DIR = PROJECT_ROOT / "model" / "checkpoints"
LABEL_DIR = PROJECT_ROOT / "model" / "labels"

BASELINE_PATH = CHECKPOINT_DIR / "baseline_model.pth"
OUTPUT_PATH = CHECKPOINT_DIR / "generalized_model.pth"


# ============================================================
# Reproducibility
# ============================================================

def set_seed(seed=SEED):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)

    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)


# ============================================================
# Device
# ============================================================

def get_device():
    if torch.cuda.is_available():
        device = torch.device("cuda")
        print(f"Using GPU: {torch.cuda.get_device_name(0)}")
    else:
        device = torch.device("cpu")
        print("CUDA GPU not available. Using CPU.")

    return device


# ============================================================
# Class weights
# ============================================================

def calculate_class_weights(train_samples, num_classes):
    counts = np.zeros(num_classes, dtype=np.float32)

    for _, label in train_samples:
        counts[label] += 1

    total = counts.sum()

    weights = total / (num_classes * counts)

    return torch.tensor(weights, dtype=torch.float32)


# ============================================================
# Training
# ============================================================

def train_one_epoch(
    model,
    loader,
    criterion,
    optimizer,
    device,
    scaler,
):
    model.train()

    running_loss = 0.0
    all_predictions = []
    all_labels = []

    for images, labels in loader:

        images = images.to(device, non_blocking=True)
        labels = labels.to(device, non_blocking=True)

        optimizer.zero_grad(set_to_none=True)

        if device.type == "cuda":

            with torch.amp.autocast("cuda"):
                outputs = model(images)
                loss = criterion(outputs, labels)

            scaler.scale(loss).backward()
            scaler.step(optimizer)
            scaler.update()

        else:

            outputs = model(images)
            loss = criterion(outputs, labels)

            loss.backward()
            optimizer.step()

        running_loss += loss.item() * images.size(0)

        predictions = outputs.argmax(dim=1)

        all_predictions.extend(
            predictions.detach().cpu().numpy()
        )

        all_labels.extend(
            labels.detach().cpu().numpy()
        )

    epoch_loss = running_loss / len(loader.dataset)

    epoch_f1 = f1_score(
        all_labels,
        all_predictions,
        average="macro",
        zero_division=0,
    )

    epoch_accuracy = accuracy_score(
        all_labels,
        all_predictions,
    )

    return epoch_loss, epoch_f1, epoch_accuracy


# ============================================================
# Validation
# ============================================================

def validate(
    model,
    loader,
    criterion,
    device,
):
    model.eval()

    running_loss = 0.0
    all_predictions = []
    all_labels = []

    with torch.no_grad():

        for images, labels in loader:

            images = images.to(device, non_blocking=True)
            labels = labels.to(device, non_blocking=True)

            if device.type == "cuda":

                with torch.amp.autocast("cuda"):
                    outputs = model(images)
                    loss = criterion(outputs, labels)

            else:

                outputs = model(images)
                loss = criterion(outputs, labels)

            running_loss += loss.item() * images.size(0)

            predictions = outputs.argmax(dim=1)

            all_predictions.extend(
                predictions.cpu().numpy()
            )

            all_labels.extend(
                labels.cpu().numpy()
            )

    epoch_loss = running_loss / len(loader.dataset)

    epoch_f1 = f1_score(
        all_labels,
        all_predictions,
        average="macro",
        zero_division=0,
    )

    epoch_accuracy = accuracy_score(
        all_labels,
        all_predictions,
    )

    return epoch_loss, epoch_f1, epoch_accuracy


# ============================================================
# Main
# ============================================================

def main():

    set_seed()

    print("=" * 60)
    print("AgriSmart AI - EfficientNet-B0 Fine-Tuning")
    print("=" * 60)

    device = get_device()

    # --------------------------------------------------------
    # Check baseline
    # --------------------------------------------------------

    if not BASELINE_PATH.exists():
        raise FileNotFoundError(
            f"Baseline model not found: {BASELINE_PATH}"
        )

    # --------------------------------------------------------
    # Dataset
    # --------------------------------------------------------

    print("\nLoading dataset...")

    samples, classes = build_samples()

    print(f"Classes: {len(classes)}")
    print(f"Total images: {len(samples)}")

    train_samples, val_samples = create_train_val_split(
        samples,
        validation_ratio=0.20,
        random_seed=SEED,
    )

    print(f"Training images:   {len(train_samples)}")
    print(f"Validation images: {len(val_samples)}")

    # --------------------------------------------------------
    # DataLoaders
    # --------------------------------------------------------

    train_loader, val_loader = create_dataloaders(
        train_samples,
        val_samples,
        train_transform=get_train_transform(),
        val_transform=get_val_transform(),
        batch_size=BATCH_SIZE,
        num_workers=NUM_WORKERS,
    )

    # --------------------------------------------------------
    # Model
    # --------------------------------------------------------

    print("\nLoading baseline model...")

    model = create_model(
        num_classes=len(classes),
        pretrained=False,
    )

    checkpoint = torch.load(
        BASELINE_PATH,
        map_location=device,
        weights_only=False,
    )

    model.load_state_dict(
        checkpoint["model_state_dict"]
    )

    model = model.to(device)

    print(
        f"Baseline validation Macro-F1: "
        f"{checkpoint.get('val_macro_f1', 'unknown')}"
    )

    # --------------------------------------------------------
    # Loss
    # --------------------------------------------------------

    class_weights = calculate_class_weights(
        train_samples,
        len(classes),
    ).to(device)

    criterion = nn.CrossEntropyLoss(
        weight=class_weights
    )

    # --------------------------------------------------------
    # Optimizer
    # --------------------------------------------------------

    optimizer = AdamW(
        model.parameters(),
        lr=LEARNING_RATE,
        weight_decay=WEIGHT_DECAY,
    )

    scheduler = ReduceLROnPlateau(
        optimizer,
        mode="max",
        factor=0.5,
        patience=1,
    )

    # --------------------------------------------------------
    # Mixed precision
    # --------------------------------------------------------

    scaler = torch.amp.GradScaler(
        "cuda",
        enabled=(device.type == "cuda"),
    )

    # --------------------------------------------------------
    # Fine-tuning
    # --------------------------------------------------------

    best_f1 = 0.0

    print("\nStarting fine-tuning...")
    print("-" * 60)

    for epoch in range(1, NUM_EPOCHS + 1):

        train_loss, train_f1, train_accuracy = train_one_epoch(
            model,
            train_loader,
            criterion,
            optimizer,
            device,
            scaler,
        )

        val_loss, val_f1, val_accuracy = validate(
            model,
            val_loader,
            criterion,
            device,
        )

        scheduler.step(val_f1)

        print(f"Epoch {epoch}/{NUM_EPOCHS}")

        print(
            f"  Train Loss: {train_loss:.4f} | "
            f"Train Macro-F1: {train_f1:.4f} | "
            f"Train Accuracy: {train_accuracy:.4f}"
        )

        print(
            f"  Val Loss:   {val_loss:.4f} | "
            f"Val Macro-F1: {val_f1:.4f} | "
            f"Val Accuracy: {val_accuracy:.4f}"
        )

        print(
            f"  Learning Rate: "
            f"{optimizer.param_groups[0]['lr']:.7f}"
        )

        if val_f1 > best_f1:

            best_f1 = val_f1

            torch.save(
                {
                    "model_state_dict": model.state_dict(),
                    "classes": classes,
                    "num_classes": len(classes),
                    "val_macro_f1": val_f1,
                    "val_accuracy": val_accuracy,
                    "epoch": epoch,
                    "base_model": "baseline_model.pth",
                },
                OUTPUT_PATH,
            )

            print(
                f"  ✓ Best fine-tuned model saved "
                f"(Macro-F1: {best_f1:.4f})"
            )

        print("-" * 60)

    print("\nFine-tuning complete.")

    print(
        f"Best Fine-Tuned Validation Macro-F1: "
        f"{best_f1:.4f}"
    )

    print(
        f"Model saved to: {OUTPUT_PATH}"
    )


if __name__ == "__main__":
    main()