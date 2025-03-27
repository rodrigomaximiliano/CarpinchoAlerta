import requests
from datetime import datetime, timedelta
from fastapi import HTTPException
from app.core.config import settings
from app.schemas.external.firms import FIRMSFireData
from typing import List

class FIRMSService:
    BASE_URL = "https://firms.modaps.eosdis.nasa.gov/api"
    
    def get_active_fires(self, region: str = "ARG", days: int = 1) -> List[FIRMSFireData]:
        try:
            date = (datetime.utcnow() - timedelta(days=days)).strftime('%Y-%m-%d')
            url = f"{self.BASE_URL}/area/csv/{settings.FIRMS_API_KEY}/VIIRS_SNPP_NRT/{region}/1/{date}"
            
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            fires = []
            for line in response.text.split('\n')[1:]:
                if line:
                    parts = line.split(',')
                    fires.append(FIRMSFireData(
                        latitude=float(parts[0]),
                        longitude=float(parts[1]),
                        brightness=float(parts[2]),
                        acq_date=datetime.strptime(parts[6], '%Y-%m-%d'),
                        confidence=parts[7],
                        frp=float(parts[8]) if parts[8] else None
                    ))
            return fires
            
        except requests.exceptions.RequestException as e:
            raise HTTPException(
                status_code=502,
                detail=f"Error al conectar con FIRMS API: {str(e)}"
            )