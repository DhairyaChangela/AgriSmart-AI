from pathlib import Path
from collections import Counter
from typing import Optional

from PIL import Image
from torch.utils.data import Dataset, DataLoader
from sklearn.model_selection import train_test_split


# Project paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data" / "processed" / "raw" / "color"

VALID_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}


def discover_classes(data_dir: Path = DATA_DIR) -> list[str]:
    """Discover disease classes from folder names."""
    if not data_dir.exists():
        raise FileNotFoundError(f"Dataset directory not found: {data_dir}")

    classes = sorted(
        folder.name
        for folder in data_dir.iterdir()
        if folder.is_dir()
    )

    if not classes:
        raise RuntimeError(f"No class folders found in {data_dir}")

    return classes


def build_samples(
    data_dir: Path = DATA_DIR,
    selected_classes: Optional[list[str]] = None,
) -> tuple[list[tuple[Path, int]], list[str]]:
    """
    Build (image_path, label) samples.

    If selected_classes is None, all available classes are used.
    """
    classes = discover_classes(data_dir)

    if selected_classes is not None:
        missing = set(selected_classes) - set(classes)

        if missing:
            raise ValueError(
                f"Requested classes not found: {sorted(missing)}"
            )

        classes = sorted(selected_classes)

    class_to_idx = {
        class_name: index
        for index, class_name in enumerate(classes)
    }

    samples = []

    for class_name in classes:
        class_dir = data_dir / class_name
        label = class_to_idx[class_name]

        for path in class_dir.iterdir():
            if path.is_file() and path.suffix.lower() in VALID_EXTENSIONS:
                samples.append((path, label))

    return samples, classes


def validate_images(samples: list[tuple[Path, int]]) -> list[tuple[Path, int]]:
    """Remove corrupted/unreadable images."""
    valid_samples = []
    corrupted = []

    for path, label in samples:
        try:
            with Image.open(path) as image:
                image.verify()

            valid_samples.append((path, label))

        except Exception:
            corrupted.append(path)

    if corrupted:
        print(f"Warning: {len(corrupted)} corrupted images ignored.")

    return valid_samples


def create_train_val_split(
    samples: list[tuple[Path, int]],
    validation_ratio: float = 0.20,
    random_seed: int = 42,
) -> tuple[list[tuple[Path, int]], list[tuple[Path, int]]]:
    """Create a reproducible stratified train/validation split."""

    if not 0 < validation_ratio < 1:
        raise ValueError("validation_ratio must be between 0 and 1.")

    paths = [sample[0] for sample in samples]
    labels = [sample[1] for sample in samples]

    train_paths, val_paths, train_labels, val_labels = train_test_split(
        paths,
        labels,
        test_size=validation_ratio,
        random_state=random_seed,
        stratify=labels,
    )

    train_samples = list(zip(train_paths, train_labels))
    val_samples = list(zip(val_paths, val_labels))

    return train_samples, val_samples


class PlantDiseaseDataset(Dataset):
    """PyTorch dataset for plant disease images."""

    def __init__(self, samples, transform=None):
        self.samples = samples
        self.transform = transform

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, index):
        image_path, label = self.samples[index]

        image = Image.open(image_path).convert("RGB")

        if self.transform:
            image = self.transform(image)

        return image, label


def create_dataloaders(
    train_samples,
    val_samples,
    train_transform=None,
    val_transform=None,
    batch_size: int = 32,
    num_workers: int = 0,
):
    """Create PyTorch DataLoaders."""

    train_dataset = PlantDiseaseDataset(
        train_samples,
        transform=train_transform,
    )

    val_dataset = PlantDiseaseDataset(
        val_samples,
        transform=val_transform,
    )

    train_loader = DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=num_workers,
    )

    val_loader = DataLoader(
        val_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=num_workers,
    )

    return train_loader, val_loader


def print_dataset_summary(samples, classes):
    """Print useful dataset statistics."""

    counter = Counter(label for _, label in samples)

    print(f"Classes: {len(classes)}")
    print(f"Total valid images: {len(samples)}")
    print()
    print("Class distribution:")

    for label, class_name in enumerate(classes):
        print(f"  {label:2d} | {class_name} | {counter.get(label, 0)}")

if __name__ == "__main__":
    print("AgriSmart AI - Dataset Check")
    print("=" * 40)

    samples, classes = build_samples()
    samples = validate_images(samples)

    train_samples, val_samples = create_train_val_split(samples)

    print()
    print_dataset_summary(samples, classes)

    print()
    print(f"Training samples:   {len(train_samples)}")
    print(f"Validation samples: {len(val_samples)}")
    print(f"Validation ratio:   {len(val_samples) / len(samples):.2%}")
    