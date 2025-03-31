# Guardián del Iberá - Backend

Sistema web y móvil para monitorear, prevenir incendios y fomentar la concientización ambiental en la provincia de Corrientes, Argentina.

## Estado Actual (Backend)

Este repositorio contiene el backend desarrollado con FastAPI. Funcionalidades implementadas:

*   **Integración con FIRMS:** Obtención de datos de focos de calor activos (VIIRS NRT).
*   **Integración con Google Earth Engine:**
    *   Cálculo de estadísticas NDVI para áreas específicas.
    *   Obtención de datos históricos de incendios (MODIS).
*   **Autenticación de Usuarios:**
    *   Registro de nuevos usuarios (`/register`).
    *   Login con generación de tokens JWT (`/login`).
    *   Endpoint protegido para obtener datos del usuario actual (`/me`).
    *   Soporte inicial para roles de usuario (citizen, admin, firefighter).
*   **Estructura:** Organizada con servicios, schemas (Pydantic), modelos (SQLAlchemy) y routers.

## Próximos Pasos

*   Implementar sistema de reportes ciudadanos.
*   Reforzar control de acceso basado en roles (RBAC).
*   Desarrollar panel de control para autoridades.
*   Crear sistema de alertas.
*   Desarrollar el frontend (web/móvil).

## Configuración y Ejecución

*(Instrucciones detalladas de configuración y ejecución se añadirán próximamente)*
