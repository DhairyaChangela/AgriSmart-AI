from pathlib import Path
import sys

_PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(_PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(_PROJECT_ROOT))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.backend.api.predict import router as predict_router
from app.backend.api.history import router as history_router
from app.backend.database.database import init_db


app = FastAPI(
    title="AgriSmart AI API",
    description="AI-powered crop disease detection and agriculture advisory API",
    version="1.0.0",
)


@app.on_event("startup")
def startup():
    init_db()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    predict_router,
    tags=["Prediction"],
)

app.include_router(
    history_router,
    tags=["History"],
)

@app.get("/")
def root():
    return {
        "message": "AgriSmart AI API is running",
        "status": "ok",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.backend.main:app", host="127.0.0.1", port=8000)
