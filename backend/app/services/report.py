from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.models.report import Report as ReportModel
from app.db.models.user import User as UserModel # Para tipado del usuario
from app.schemas.report import ReportCreate, ReportStatus # Importar también ReportStatus

class ReportService:
    def create_report(
        self, db: Session, *, report_in: ReportCreate, reporter: UserModel
    ) -> ReportModel:
        """
        Crea un nuevo reporte en la base de datos.
        Asocia el reporte con el usuario que lo reporta.
        """
        # Crear instancia explícitamente para claridad
        db_report = ReportModel(
            latitude=report_in.latitude,
            longitude=report_in.longitude,
            description=report_in.description,
            department=report_in.department,
            paraje=report_in.paraje,
            photo_url=report_in.photo_url,
            reporter_id=reporter.id,
            # El status se establece por defecto en el modelo (`PENDING`)
        )
        db.add(db_report)
        db.commit()
        db.refresh(db_report)
        return db_report

    # --- Métodos adicionales (Ejemplos para el futuro) ---

    def get_report(self, db: Session, *, report_id: int) -> Optional[ReportModel]:
        """Obtiene un reporte por su ID."""
        return db.query(ReportModel).filter(ReportModel.id == report_id).first()

    def get_reports(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[ReportModel]:
        """Obtiene una lista de reportes."""
        # Considerar ordenar por timestamp descendente
        return db.query(ReportModel).order_by(ReportModel.timestamp.desc()).offset(skip).limit(limit).all()

    def get_reports_by_reporter(
        self, db: Session, *, reporter_id: int, skip: int = 0, limit: int = 100
    ) -> List[ReportModel]:
        """Obtiene los reportes de un usuario específico."""
        return db.query(ReportModel).filter(ReportModel.reporter_id == reporter_id).order_by(ReportModel.timestamp.desc()).offset(skip).limit(limit).all()
    
    # def update_report_status(
    #     self, db: Session, *, report_id: int, status: ReportStatus, current_user: UserModel
    # ) -> Optional[ReportModel]:
    #     """Actualiza el estado de un reporte (ej. para admins/firefighters)."""
    #     # Aquí podrías añadir lógica de permisos: if current_user.role not in [UserRole.admin, UserRole.firefighter]: raise HTTPException...
    #     db_report = self.get_report(db, report_id=report_id)
    #     if db_report:
    #         db_report.status = status
    #         # Podrías añadir un campo 'verifier_id' = current_user.id
    #         db.commit()
    #         db.refresh(db_report)
    #     return db_report

# Instancia del servicio para usar en endpoints
report_service = ReportService()