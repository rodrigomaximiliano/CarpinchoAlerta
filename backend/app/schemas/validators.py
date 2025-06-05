from datetime import datetime
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

def validar_temperatura(temp: float, umbral_critico: float = 100.0) -> Dict[str, Any]:
    """
    Valida y categoriza la temperatura detectada.
    
    Args:
        temp: Temperatura en Celsius
        umbral_critico: Temperatura que requiere atención inmediata
    """
    if not isinstance(temp, (int, float)):
        logger.error(f"Temperatura inválida detectada: {temp}")
        raise ValueError("Error en lectura de temperatura")
        
    if temp < 0 or temp > 1000:  # Validación física
        logger.error(f"Temperatura fuera de rango físico: {temp}°C")
        raise ValueError("Temperatura fuera de rango realista")

    return {
        "temperatura": round(temp, 1),
        "nivel_riesgo": "CRÍTICO" if temp > umbral_critico else "ALTO" if temp > 60 else "MEDIO",
        "requiere_verificacion": temp > umbral_critico,
        "confianza_lectura": "Alta" if 20 <= temp <= 150 else "Requiere verificación"
    }

def validar_coordenadas(lat: float, lon: float) -> bool:
    """Valida que las coordenadas estén en el área de Iberá."""
    IBERA_BOUNDS = {
        "lat_min": -31.0,
        "lat_max": -26.0,
        "lon_min": -60.0,
        "lon_max": -57.0
    }
    
    if not (-90 <= lat <= 90 and -180 <= lon <= 180):
        logger.error(f"Coordenadas inválidas: {lat}, {lon}")
        return False
        
    in_bounds = (IBERA_BOUNDS["lat_min"] <= lat <= IBERA_BOUNDS["lat_max"] and
                IBERA_BOUNDS["lon_min"] <= lon <= IBERA_BOUNDS["lon_max"])
                
    if not in_bounds:
        logger.warning(f"Coordenadas fuera del área de Iberá: {lat}, {lon}")
        
    return in_bounds
