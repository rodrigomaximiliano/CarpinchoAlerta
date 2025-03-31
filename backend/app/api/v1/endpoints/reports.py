from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.report import Report, ReportCreate
from app.services.report import report_service
from app.api.v1.endpoints.auth import get_current_user
from app.db.models.user import User as UserModel

router = APIRouter()

@router.post("/", response_model=Report, status_code=status.HTTP_201_CREATED)
def create_report(
    *, 
    db: Session = Depends(get_db),
    report_in: ReportCreate,
    current_user: UserModel = Depends(get_current_user)
) -> Report:
    """
    Crea un nuevo reporte de incendio.
    Requiere autenticación.
    """
    report = report_service.create_report(db=db, report_in=report_in, reporter=current_user)
    return report

# --- Endpoints adicionales (GET, etc. - para el futuro) ---

# @router.get("/", response_model=List[Report])
# def read_reports(
#     db: Session = Depends(get_db),
#     skip: int = 0,
#     limit: int = 100,
#     # current_user: UserModel = Depends(get_current_user) # Podría requerir auth
# ) -> List[Report]:
#     """Recupera una lista de reportes."""
#     reports = report_service.get_reports(db, skip=skip, limit=limit)
#     return reports

# @router.get("/{report_id}", response_model=Report)
# def read_report(
#     *, 
#     db: Session = Depends(get_db),
#     report_id: int,
#     # current_user: UserModel = Depends(get_current_user) # Podría requerir auth
# ) -> Report:
#     """Obtiene un reporte específico por ID."""
#     db_report = report_service.get_report(db, report_id=report_id)
#     if db_report is None:
#         raise HTTPException(status_code=404, detail="Reporte no encontrado")
#     return db_report