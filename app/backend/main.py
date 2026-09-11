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
