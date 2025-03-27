from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field
from typing import Optional

class AlertSeverity(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"

class AlertStatus(str, Enum):
    active = "active"
    resolved = "resolved"
    expired = "expired"

class AlertBase(BaseModel):
    title: str = Field(..., max_length=100)
    message: str = Field(..., max_length=500)
    severity: AlertSeverity
    region: str = Field(..., max_length=50)
    coordinates: Optional[list] = Field(None, min_items=2, max_items=2)

class AlertCreate(AlertBase):
    pass

class AlertUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=100)
    message: Optional[str] = Field(None, max_length=500)
    status: Optional[AlertStatus] = None
    is_active: Optional[bool] = None

class AlertInDBBase(AlertBase):
    id: int
    created_at: datetime
    status: AlertStatus
    is_active: bool
    creator_id: Optional[int] = None

    class Config:
        orm_mode = True

# Solución para referencia circular
from app.schemas.user import UserBase

class Alert(AlertInDBBase):
    creator: Optional[UserBase] = None

class AlertWithStats(Alert):
    affected_area: Optional[float] = Field(None, ge=0)
    related_reports_count: int = Field(0)

Alert.update_forward_refs()  # Resuelve referencias circulares