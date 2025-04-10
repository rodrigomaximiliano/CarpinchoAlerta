from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
import enum

class ReportStatus(str, enum.Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    DISMISSED = "dismissed"

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    description = Column(String, nullable=True)
    status = Column(SQLEnum(ReportStatus), default=ReportStatus.PENDING, nullable=False)
    reported_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # --- Relación con Usuario (Asumiendo que se requiere login) ---
    # Descomentar y ajustar si el modelo User está en 'user.py'
    # user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    # reporter = relationship("User") # Ajustar "User" si el nombre de la clase es diferente

    # --- Campos Adicionales (Opcional) ---
    # image_url = Column(String, nullable=True)
    # location_details = Column(String, nullable=True) # Para Dpto/Paraje