# AgriSmart AI — ML Pipeline

This directory contains the crop disease classification pipeline used by
AgriSmart AI.

## Components

- `train.py` — trains the disease classifier.
- `predict.py` — performs single-image inference.
- `evaluate.py` — evaluates the model and generates classification metrics
  and a confusion matrix.
- `dataset.py` — discovers classes, builds samples, validates images, and
  creates the train/validation split.
- `preprocessing.py` — defines training and validation image transforms.
- `architectures/classifier.py` — EfficientNet-B0 based classifier.
- `labels/classes.json` — class-label mapping used during inference.
- `checkpoints/best_model.pth` — trained model weights, distributed through
  the GitHub Release rather than normal Git history.

## Model

- Architecture: EfficientNet-B0
- Input size: 224 × 224
- Number of classes: 38
- Training dataset: PlantVillage
- Best validation Macro-F1: 0.9961
- Best validation accuracy: 0.9971

The reported validation metrics are from the PlantVillage validation split.
They are not the official SIH held-out field-test score.

## Download the trained model

Model weights are intentionally excluded from normal Git history.

Download the released checkpoint using:

```powershell
python scripts/download_model.py
