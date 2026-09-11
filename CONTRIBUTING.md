# Contributing to AgriSmart AI

Thanks for helping build farmer-first crop health intelligence. Keep it small, honest, and reviewable.

## Workflow

1. Open or pick an issue before writing code.
2. Branch from `main`: `feat/<topic>`, `fix/<topic>`, or `docs/<topic>`.
3. Keep pull requests focused — one concern per PR.
4. Use Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `chore:`).
5. Open a PR against `main` using the template in `.github/`.

## Pull request checklist

- [ ] Scope matches the linked issue — no unrelated changes.
- [ ] No fake metrics, datasets, testimonials, or screenshots.
- [ ] Docs updated if behavior or structure changed.
- [ ] No secrets, keys, tokens, or private data.
- [ ] New dependencies justified in the PR description.

## Standards

- Python code follows `ruff` defaults; web code follows the repo linter once the app layer lands.
- Prefer small, composable modules over speculative abstractions.
- Mobile-first and accessible by default for anything a farmer touches.
- Mark unfinished work clearly (`Planned`, `WIP`) instead of implying it ships.

## What not to contribute

- Model weights or large datasets (see `model/README.md` and `data/README.md`).
- `.env` files or any credentials.
- Generated artifacts (`__pycache__`, `node_modules`, `.next`, experiment logs).
