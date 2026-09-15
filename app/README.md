# `app/` — Application (backend + orchestration entry point)

Everything the application needs to run live: the FastAPI backend, and the
one-command orchestration that starts backend + frontend together.

## Layout

| Path                        | Role                                                            |
| --------------------------- | --------------------------------------------------------------- |
| `backend/`                  | FastAPI service — `/predict`, `/health`, `/history`, services, SQLite persistence |
| `backend/api/`              | HTTP endpoints (routers)                                        |
| `backend/services/`         | Business logic: model orchestration, plant gate, image validation, diagnosis service |
| `backend/database/`         | SQLite connection, models, migration bootstrap                    |
| `package.json`              | Root orchestration: `npm run dev` runs FastAPI + Next.js together |

## Running

From the repository root:

```bash
npm run dev        # FastAPI (port 8000) + Next.js (port 3000) together
npm run dev:api    # FastAPI only
```

## What is served

- `POST /predict` — image upload → validation → plant gate → 38-class classifier → confidence-aware result (`accepted` / `uncertain` / `rejected` / `model_not_ready`).
- `GET /history` — latest predictions persisted to SQLite.
- `GET /health` — liveness.

See the root [README](../README.md#api) for the full API contract and response states.