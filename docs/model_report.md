# AgriSmart AI — One-Page Model Report

**Date:** 2026-09-15 · **Scope:** the disease-classification model shipped in this repository

---

## Project

AgriSmart AI — AI-powered crop/leaf disease detection built as farmer-facing decision support.

## Problem

Identify crop/leaf disease from a photo and present it as **condition → confidence → explanation → next action**. Predictions are restricted to the 38 trained classes; non-plant images are rejected before classification.

## Dataset

- **Source:** PlantVillage — `mohanty/PlantVillage` (see `scripts/download_plantvillage.py`), color subset.
- **Classes:** 38 crop/disease classes (`model/labels/classes.json`).
- **Size (verified):** 54,305 color images in the training set (54,284 unique + 21 duplicate halves), 256×256 JPG/JPEG/PNG; 0 corrupt in inventory manifest.
- **Split:** stratified 80/20 train/validation, seed 42 → **43,444 train / 10,861 validation**.
- No official held-out set exists locally.

## Model

- **Architecture:** EfficientNet-B0 (torchvision), ImageNet-pretrained init, classifier head replaced with `nn.Linear(1280, 38)`.
- **Training:** `model/train.py` — AdamW (lr 1e-4, wd 1e-4), **weighted CrossEntropyLoss** for class imbalance, ReduceLROnPlateau, 5 epochs; checkpoint saved on best validation Macro-F1 (epoch 4). `model/finetune.py` fine-tunes to `generalized_model.pth`.
- **Preprocessing:** inputs resized to **224×224**, ImageNet normalization (mean `0.485,0.456,0.406`, std `0.229,0.224,0.225`). Inference/validation share one transform (`Resize 224 → ToTensor → Normalize`).

## Classification

- **Output space:** 38 classes from `model/labels/classes.json`; `classes.json` == checkpoint `classes` (identical order), classifier output dim `[38, 1280]`.
- **Safety gate:** zero-shot CLIP plant/non-plant gate (`model/plant_gate.py`, `openai/clip-vit-base-patch32`) runs **before** the classifier and is **fail-closed** — without it the app refuses to diagnose. Non-plant images return `rejected / not_crop` and never reach the 38-class model.

## Validation / Evaluation

| Category | Result |
|---|---|
| **Clean validation (reproduced baseline)** | Accuracy **0.99705** (10829/10861) · Macro-F1 **0.99606** — reproduced by `model/evaluate.py` (stratified 20%, seed 42) and matches the checkpoint's recorded `val_accuracy`/`val_macro_f1` bit-for-bit. |
| **Official held-out testing** | **Not yet measured** — no held-out/field set is available locally. |

## Metrics (clean validation split)

| Metric | Value |
|---|---|
| Accuracy | 0.9971 |
| Macro-F1 | 0.9961 |
| Macro precision / recall | 0.9961 / 0.9960 |

- **Per-class** precision/recall/F1 for all 38 classes: `results/phase5_reproduced_metrics.json`. Weakest: `Corn Cercospora_leaf_spot` (F1 0.967), `Corn Northern_Leaf_Blight` (0.980), `Tomato Early_blight` (0.980), `Potato healthy` (0.983).
- **Confusion matrix (38×38):** `docs/assets/confusion_matrix.png` (source `results/confusion_matrix_phase7.png`).
- **Error analysis:** 32 errors on clean validation; top confusion Corn Northern_Leaf_Blight → Cercospora_leaf_spot. Confidence signal: correct median 0.9998 vs incorrect median 0.718.

### Robustness (validation images only)

| Corruption | Accuracy | Macro-F1 |
|---|---|---|
| Clean | 0.9971 | 0.9961 |
| Gaussian blur (r=2) | 0.7959 | 0.7843 |
| JPEG q25 | 0.9768 | 0.9740 |
| Random crop 80% | 0.9796 | 0.9744 |
| Rotation 8° / brightness / contrast / occlusion | ≥ 0.9949 | ≥ 0.9934 |

### Shortcut diagnostics

Flat-green background **0.400** accuracy · grayscale **0.598** — the model relies on background and color shortcuts (largest field-transfer risk).

## Model checkpoint

- **Used by the app:** `model/checkpoints/best_model.pth` (epoch 4, SHA-256 `67BF7F05…B5E41`). `model/predict.py` loads `generalized_model.pth` first, else `best_model.pth`.
- **Download (SHA-256 verified):** `python scripts/download_model.py`.

## Reproducibility

```bash
pip install -r requirements.txt
python scripts/download_model.py          # model/checkpoints/best_model.pth
python -m model.evaluate                  # reproduces val split + metrics (requires dataset)
python -m model.predict --image leaf.jpg
npm install && npm run dev                # FastAPI :8000 + Next.js :3000
```

Note: `predict.py` / `evaluate.py` / `train.py` are run as modules (`python -m model.*`) so the repository root is on `sys.path` — invoking them as bare scripts (`python model/predict.py`) fails to resolve the `model` package imports.

Training/evaluation additionally requires the dataset present at the path expected by `model/dataset.py` (`data/processed/raw/color`).

## Limitations

- Validation numbers are in-lab PlantVillage results — **not** a field-performance claim.
- Gaussian-blur gap (acc 0.796) and background/color shortcut dependence (flat-green 0.400, grayscale 0.598) are the main field-signal risks.
- Output space is fixed to the project's 38-class mapping; the official SIH class/held-out list could not be verified locally.
- Non-plant images are never diagnosed (fail-closed CLIP gate).

---

*Sources: `model/*` code; `results/ml_phase1_audit_report.md`, `results/phase5_reproduced_metrics.json`, `results/error_analysis.json`, `results/phase6_8_robustness_shortcut_summary.json` (local, git-ignored).*