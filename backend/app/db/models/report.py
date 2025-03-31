from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum as SQLEnum, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.base_class import Base
# Import User model might be needed if not already imported implicitly by relationship
# from app.db.models.user import User

class ReportStatus(str, enum.Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    RESOLVED = "resolved"
    DISMISSED = "dismissed"

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    latitude = Column(Float, nullable=False, index=True) # Add index
    longitude = Column(Float, nullable=False, index=True) # Add index
    description = Column(String, nullable=True)
    department = Column(String, nullable=True, index=True) # Nuevo
    paraje = Column(String, nullable=True, index=True)      # Nuevo
    photo_url = Column(String, nullable=True) # Mantener photo_url
    status = Column(SQLEnum(ReportStatus), default=ReportStatus.PENDING, nullable=False, index=True) # Usar Enum
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False) # Cambiado y con timezone
    
    # Renombrado owner_id a reporter_id y asegurar nullable=False si los reportes siempre deben tener autor
    reporter_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reporter = relationship("User", back_populates="reports") # Definir relación