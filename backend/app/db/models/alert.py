from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    message = Column(String(500), nullable=False)
    severity = Column(String(20), nullable=False)  # 'low', 'medium', 'high'
    region = Column(String(50), nullable=False)    # Ej: 'Corrientes', 'Chaco'
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)
    # Relación opcional con usuarios si las alertas son generadas por usuarios
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Relación
    creator = relationship("User", back_populates="alerts")

    def __repr__(self):
        return f"<Alert {self.title} ({self.severity})>"