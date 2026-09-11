# `data/` — Datasets

Future home of dataset organization and metadata. Large or sensitive data is never committed.

## Planned layout

| Path          | Contents                                                     |
| ------------- | ------------------------------------------------------------ |
| `raw/`        | Immutable originals (local only, git-ignored)                |
| `processed/`  | Reproducible derivatives (local only, git-ignored)           |
| `samples/`    | A tiny set of openly licensed samples for smoke tests        |
| `*.md / *.json` | Dataset cards and manifests describing source and license  |

## Rules

- Every dataset gets a card: source, license, size, splits, and intended use.
- The official hidden test set is never copied here — evaluation references it, nothing more.
- No fake dataset statistics. If a number isn't measured, it isn't written.

> Status: **Planned.** This directory currently holds no data.
