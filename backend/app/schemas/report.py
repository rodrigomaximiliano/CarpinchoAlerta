from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.db.models.report import ReportStatus # Importar el Enum del modelo

# --- Schema Base ---
# Propiedades comunes compartidas por otros schemas
class ReportBase(BaseModel):
    latitude: float = Field(..., ge=-90, le=90, description="Latitud del reporte")
    longitude: float = Field(..., ge=-180, le=180, description="Longitud del reporte")
    description: Optional[str] = Field(None, max_length=500, description="Descripción adicional del usuario")
    department: Optional[str] = Field(None, max_length=100, description="Departamento (opcional, podría autodetectarse)")
    paraje: Optional[str] = Field(None, max_length=100, description="Paraje o localidad cercana (opcional)")
    photo_url: Optional[str] = Field(None, description="URL de una foto adjunta (opcional)")

# --- Schema para Crear un Reporte (Entrada API) ---
# Hereda de ReportBase y añade/modifica lo necesario para la creación
# No incluye id, created_at, status, reporter_id (estos se asignan en el backend)
class ReportCreate(ReportBase):
    pass # Hereda todos los campos de ReportBase

# --- Schema para Actualizar un Reporte (Entrada API - Opcional) ---
# Permite actualizar campos específicos (ej. status por un admin)
class ReportUpdate(BaseModel):
    description: Optional[str] = Field(None, max_length=500)
    status: Optional[ReportStatus] = None
    department: Optional[str] = Field(None, max_length=100)
    paraje: Optional[str] = Field(None, max_length=100)
    photo_url: Optional[str] = None

# --- Schema para Leer un Reporte (Salida API) ---
# Hereda de ReportBase y añade los campos generados por la DB/backend
class ReportRead(ReportBase):
    id: int
    status: ReportStatus
    created_at: datetime
    reporter_id: int # Incluir el ID del reportero

    class Config:
        orm_mode = True # Compatible con SQLAlchemy ORM

# --- Schema para Leer Reporte con Info del Reportero (Salida API - Opcional) ---
# Podríamos añadir un schema que incluya detalles del usuario si fuera necesario
# class ReportReadWithReporter(ReportRead):
#    reporter: UserRead # Asumiendo que existe un schema UserRead
#    pass