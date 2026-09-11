# `model/` — AI pipeline

Future home of the crop/disease model lifecycle: training, inference, and evaluation.

## Planned responsibilities

- **Training:** dataset loading, augmentation, experiment configs.
- **Inference:** a versioned contract — image in, prediction + confidence out.
- **Evaluation:** scoring against the organizer-provided held-out test set.

## Rules

- Model weights (`*.pt`, `*.pth`, `*.onnx`, checkpoints) are never committed — see `.gitignore`.
- Final metrics are reported only after the official test set is evaluated. No invented accuracy numbers.
- Inference must always return a confidence value; downstream layers depend on it.

> Status: **Planned.** This directory currently holds no implementation.
