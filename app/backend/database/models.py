from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.backend.database.database import Base


class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    crop: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    disease: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    class_label: Mapped[str] = mapped_column(
        String(250),
        nullable=False,
    )

    confidence: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )