# `app/` — Application layer

Future home of everything the farmer touches: image capture, quality feedback, results, guidance, and the AgriBot assistant surface.

## Planned responsibilities

- Crop/leaf photo capture and upload.
- Client-side image validation feedback (size, type, framing hints).
- API communication — no model logic lives here.
- Diagnosis display: disease, confidence, explanation, next steps.
- Error and retry states for every failure mode.

## Boundaries

- No training code, no model weights, no inference logic.
- No hard-coded diagnosis content — all results arrive via the backend contract.

> Status: **Planned.** This directory currently holds no implementation.
