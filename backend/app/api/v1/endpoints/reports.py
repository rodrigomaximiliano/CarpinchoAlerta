from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List # Importar List

from app import schemas # Importar desde el __init__ de schemas
from app.db import models # Importar desde el __init__ de models (si existe) o directamente
from app.api import deps # Importar dependencias
# Importar el modelo Report directamente si no hay __init__ en models
# from app.db.models.report import Report

router = APIRouter()

@router.post(
    "/",
    response_model=schemas.ReportRead, # Devolver el reporte creado
    status_code=status.HTTP_201_CREATED, # Código 201 para creación exitosa
    summary="Crear un nuevo reporte de foco ígneo",
    description="Permite a un usuario autenticado crear un nuevo reporte."
)
async def create_report(
    *,
    db: Session = Depends(deps.get_db),
    report_in: schemas.ReportCreate, # Usar el schema de creación
    current_user: models.User = Depends(deps.get_current_active_user) # Requerir usuario activo
):
    """
    Crea un nuevo reporte en la base de datos.

    - **latitude**: Latitud del punto reportado (obligatorio).
    - **longitude**: Longitud del punto reportado (obligatorio).
    - **description**: Descripción opcional del usuario.
    - **department**: Departamento (opcional).
    - **paraje**: Paraje o localidad (opcional).
    - **photo_url**: URL de una foto (opcional).
    """
    # Aquí podríamos añadir validación geográfica para asegurar que lat/lon estén en Corrientes
    # if not is_within_corrientes(report_in.latitude, report_in.longitude):
    #     raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         detail="Las coordenadas proporcionadas están fuera de los límites de Corrientes."
    #     )

    # Crear el objeto del modelo Report
    # Usamos **report_in.dict() para pasar los campos del schema
    # Añadimos el reporter_id desde el usuario actual
    db_report = models.Report(
        **report_in.dict(),
        reporter_id=current_user.id
    )

    # Añadir a la sesión y confirmar
    db.add(db_report)
    db.commit()
    db.refresh(db_report) # Refrescar para obtener el ID y created_at generados

    return db_report

# --- Endpoints Adicionales (Opcional) ---

# @router.get("/", response_model=List[schemas.ReportRead], summary="Listar reportes")
# async def read_reports(
#     db: Session = Depends(deps.get_db),
#     skip: int = 0,
#     limit: int = 100,
#     # Podríamos añadir filtros por status, usuario, etc.
# ):
#     """Obtiene una lista de reportes."""
#     reports = db.query(models.Report).offset(skip).limit(limit).all()
#     return reports

# @router.get("/{report_id}", response_model=schemas.ReportRead, summary="Obtener un reporte por ID")
# async def read_report(
#     report_id: int,
#     db: Session = Depends(deps.get_db),
# ):
#     """Obtiene un reporte específico por su ID."""
#     db_report = db.query(models.Report).filter(models.Report.id == report_id).first()
#     if db_report is None:
#         raise HTTPException(status_code=404, detail="Reporte no encontrado")
#     return db_report

# @router.patch("/{report_id}", response_model=schemas.ReportRead, summary="Actualizar un reporte (ej. estado)")
# async def update_report(
#     report_id: int,
#     report_in: schemas.ReportUpdate,
#     db: Session = Depends(deps.get_db),
#     # Podríamos requerir un usuario admin aquí
#     # current_user: models.User = Depends(deps.get_current_active_admin_user)
# ):
#     """Actualiza campos de un reporte (ej. cambiar estado). Requiere permisos adecuados."""
#     db_report = db.query(models.Report).filter(models.Report.id == report_id).first()
#     if db_report is None:
#         raise HTTPException(status_code=404, detail="Reporte no encontrado")
    
#     update_data = report_in.dict(exclude_unset=True) # Obtener solo los campos enviados
#     for field, value in update_data.items():
#         setattr(db_report, field, value)
        
#     db.add(db_report)
#     db.commit()
#     db.refresh(db_report)
#     return db_report