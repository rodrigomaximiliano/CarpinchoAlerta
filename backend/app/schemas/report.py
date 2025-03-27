from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field, HttpUrl
from typing import Optional

class ReportStatus(str, Enum):
    pending = "pending"
    verified = "verified"
    in_progress = "in_progress"
    resolved = "resolved"
    false_alarm = "false_alarm"

class ReportBase(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    description: str = Field(..., max_length=500)
    photo_url: Optional[HttpUrl] = None
    is_anonymous: bool = False

class ReportCreate(ReportBase):
    pass

class ReportUpdate(BaseModel):
    status: Optional[ReportStatus] = None
    description: Optional[str] = Field(None, max_length=500)
    verification_notes: Optional[str] = Field(None, max_length=500)

class ReportInDBBase(ReportBase):
    id: int
    created_at: datetime
    status: ReportStatus
    owner_id: Optional[int] = None

    class Config:
        orm_mode = True

# Solución para referencia circular
from app.schemas.user import UserBase

class Report(ReportInDBBase):
    owner: Optional[UserBase] = None

class ReportWithLocation(Report):
    location_name: Optional[str] = None
    distance_to_city: Optional[float] = Field(None, ge=0)

Report.update_forward_refs()  # Resuelve referencias circulares