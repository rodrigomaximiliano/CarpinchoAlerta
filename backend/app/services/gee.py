import ee
import os
from fastapi import HTTPException
from app.core.config import settings
from pathlib import Path

class GEEService:
    def __init__(self):
        self.initialize_gee()

    def initialize_gee(self):
        try:
            credential_path = settings.GEE_CREDENTIAL_PATH
            
            if not Path(credential_path).exists():
                raise FileNotFoundError(f"Credenciales GEE no encontradas en {credential_path}")
            
            credentials = ee.ServiceAccountCredentials(
                email=None,
                key_file=credential_path
            )
            ee.Initialize(credentials)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error al inicializar Google Earth Engine: {str(e)}"
            )

    def get_ndvi(self, lat: float, lon: float, start_date: str, end_date: str):
        try:
            point = ee.Geometry.Point(lon, lat)
            
            collection = (ee.ImageCollection('MODIS/006/MOD13A2')
                        .filterBounds(point)
                        .filterDate(start_date, end_date))
            
            return collection.getInfo()
            
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error al obtener datos NDVI: {str(e)}"
            )