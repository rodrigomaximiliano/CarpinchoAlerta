from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, alerts, firms, gee, reports # Mover reports al final o donde corresponda, añadirlo

router = APIRouter()

router.include_router(auth.router, prefix="/auth", tags=["Auth"])
router.include_router(users.router, prefix="/users", tags=["users"])
router.include_router(reports.router, prefix="/reports", tags=["Reports"])
router.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
router.include_router(firms.router, tags=["FIRMS"])
router.include_router(gee.router, prefix="/gee", tags=["Google Earth Engine"])
router.include_router(reports.router, prefix="/reports", tags=["Reports"]) # Añadir router de reports