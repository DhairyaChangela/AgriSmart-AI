# `tests/` — Verification

Future home of automated checks for code and model behavior.

## Planned scope

- **Unit tests:** validation helpers, advisory formatting, API schemas.
- **Integration tests:** app → backend → inference contract end to end.
- **Evaluation validation:** scripts that score predictions against the held-out set and confirm metric computation — not the metrics themselves.

## Rules

- Tests assert behavior, never invent expected accuracy.
- Evaluation scripts fail loudly on missing data instead of fabricating results.

> Status: **Planned.** This directory currently holds no tests.
