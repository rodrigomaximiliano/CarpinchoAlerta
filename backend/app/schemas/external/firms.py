from pydantic import BaseModel
from datetime import datetime

class FIRMSFireData(BaseModel):
    latitude: float
    longitude: float
    brightness: float
    acq_date: datetime
    confidence: str
    frp: float | None = None
    
    class Config:
        orm_mode = True