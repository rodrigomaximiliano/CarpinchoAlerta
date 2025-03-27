from datetime import datetime, timedelta
from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.db.models.alert import Alert
from app.schemas.alert import (
    AlertCreate,
    AlertUpdate,
    AlertStatus,
    AlertWithStats
)
from app.services.user import get_user_by_id
from app.services.report import get_reports_near_location
from app.utils.geospatial import calculate_distance

class AlertService:
    def __init__(self, db: Session):
        self.db = db

    def create_alert(self, alert_data: AlertCreate, creator_id: Optional[int] = None) -> Alert:
        """Crea una nueva alerta en el sistema"""
        try:
            db_alert = Alert(
                **alert_data.dict(),
                status=AlertStatus.active,
                creator_id=creator_id,
                created_at=datetime.utcnow()
            )
            self.db.add(db_alert)
            self.db.commit()
            self.db.refresh(db_alert)
            return db_alert
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error al crear alerta: {str(e)}"
            )

    def get_alert(self, alert_id: int) -> Optional[Alert]:
        """Obtiene una alerta por su ID"""
        return self.db.query(Alert).filter(Alert.id == alert_id).first()

    def get_active_alerts(self, hours: int = 24) -> List[Alert]:
        """Obtiene alertas activas de las últimas N horas"""
        cutoff_time = datetime.utcnow() - timedelta(hours=hours)
        return (
            self.db.query(Alert)
            .filter(Alert.is_active == True)
            .filter(Alert.created_at >= cutoff_time)
            .order_by(Alert.created_at.desc())
            .all()
        )

    def update_alert(self, alert_id: int, update_data: AlertUpdate) -> Optional[Alert]:
        """Actualiza una alerta existente"""
        db_alert = self.get_alert(alert_id)
        if not db_alert:
            return None

        try:
            for key, value in update_data.dict(exclude_unset=True).items():
                setattr(db_alert, key, value)
            
            db_alert.updated_at = datetime.utcnow()
            self.db.commit()
            self.db.refresh(db_alert)
            return db_alert
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error al actualizar alerta: {str(e)}"
            )

    def enrich_alert_with_stats(self, alert: Alert) -> AlertWithStats:
        """Enriquece una alerta con estadísticas relacionadas"""
        stats = {
            "related_reports_count": 0,
            "affected_area": None
        }

        if alert.coordinates and len(alert.coordinates) == 2:
            # Obtener reportes cercanos (10km de radio)
            longitude, latitude = alert.coordinates
            nearby_reports = get_reports_near_location(
                self.db, latitude, longitude, radius_km=10
            )
            stats["related_reports_count"] = len(nearby_reports)

            # Cálculo de área afectada (ejemplo simplificado)
            if nearby_reports:
                stats["affected_area"] = len(nearby_reports) * 0.5  # Hectáreas por reporte

        return AlertWithStats(**alert.__dict__, **stats)

    def resolve_old_alerts(self, days_threshold: int = 3) -> int:
        """Resuelve alertas antiguas automáticamente"""
        cutoff_time = datetime.utcnow() - timedelta(days=days_threshold)
        updated = (
            self.db.query(Alert)
            .filter(Alert.status == AlertStatus.active)
            .filter(Alert.created_at < cutoff_time)
            .update({
                Alert.status: AlertStatus.resolved,
                Alert.is_active: False,
                Alert.updated_at: datetime.utcnow()
            })
        )
        self.db.commit()
        return updated