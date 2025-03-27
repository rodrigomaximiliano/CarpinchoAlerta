from sqlalchemy import Column, Float, String, DateTime, Boolean, Integer, ForeignKey
from sqlalchemy.sql import func
from app.db.base_class import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    description = Column(String)
    photo_url = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    status = Column(String, default="reported")
    is_anonymous = Column(Boolean, default=False)
    owner_id = Column(Integer, ForeignKey("users.id"))