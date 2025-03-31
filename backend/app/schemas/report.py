from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import enum 

try:
    from .user import User
except ImportError:
    User = None 

class ReportStatus(str, enum.Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    RESOLVED = "resolved"
    DISMISSED = "dismissed"

class ReportBase(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    description: Optional[str] = Field(None, max_length=500)
    department: Optional[str] = Field(None, max_length=100) 
    paraje: Optional[str] = Field(None, max_length=100)     
    photo_url: Optional[str] = None 

class ReportCreate(ReportBase):
    pass 

class ReportInDBBase(ReportBase):
    id: int
    reporter_id: int
    status: ReportStatus
    timestamp: datetime

    class Config:
        orm_mode = True

class Report(ReportInDBBase):
    reporter: Optional[User] = None 