# Guardián del Iberá - Backend

Sistema web y móvil para monitorear, prevenir incendios y fomentar la concientización ambiental en la provincia de Corrientes, Argentina.

## Estado Actual (Backend)

Este repositorio contiene el backend desarrollado con FastAPI. Funcionalidades implementadas:

*   **Integración con FIRMS:** Obtención de datos de focos de calor activos (VIIRS NRT).
*   **Integración con Google Earth Engine:**
    *   Cálculo de estadísticas NDVI para áreas específicas.
    *   Obtención de datos históricos de incendios (MODIS).
*   **Autenticación de Usuarios:**
    *   Registro de nuevos usuarios (`/api/v1/auth/register`).
    *   Login con generación de tokens JWT (`/api/v1/auth/login`).
    *   Endpoint protegido para obtener datos del usuario actual (`/api/v1/auth/me`).
    *   Soporte inicial para roles de usuario (`citizen`, `admin`, `firefighter`).
*   **Sistema de Reportes de Incendios:**
    *   Endpoint para que usuarios autenticados creen reportes (`POST /api/v1/reports/`).
    *   Almacenamiento de detalles: ubicación (lat/lon), descripción, departamento, paraje, foto (opcional), estado y usuario que reporta.
    *   Estados de reporte: `PENDING`, `VERIFIED`, `RESOLVED`, `DISMISSED`.
*   **Gestión de Base de Datos (Alembic):**
    *   Inicialización y configuración de Alembic para manejar migraciones de la base de datos (compatible con SQLite y PostgreSQL).
    *   Migración inicial para crear las tablas `users` y `reports`.
*   **Estructura:** Organizada con servicios, schemas (Pydantic), modelos (SQLAlchemy) y routers.

## Próximos Pasos

*   Reforzar control de acceso basado en roles (RBAC) para endpoints de reportes (ej. ver/modificar reportes).
*   Desarrollar endpoints GET para consultar reportes (lista, por ID, por usuario, etc.).
*   Implementar la lógica para actualizar el estado de los reportes.
*   Desarrollar panel de control para autoridades (administradores, bomberos).
*   Crear sistema de alertas (basado en reportes, focos de calor, etc.).
*   Desarrollar el frontend (web/móvil).

## Configuración y Ejecución

1.  **Clonar el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd guardian-del-Ibera
    ```
2.  **Backend:**
    *   Navegar al directorio `backend`:
      ```bash
      cd backend
      ```
    *   Crear y activar un entorno virtual (recomendado):
      ```bash
      python -m venv venv
      # Windows
      .\venv\Scripts\activate
      # macOS/Linux
      # source venv/bin/activate
      ```
    *   Instalar dependencias:
      ```bash
      pip install -r requirements.txt
      ```
    *   **Configurar Variables de Entorno:** Copiar `.env.example` a `.env` y rellenar los valores necesarios (como `DATABASE_URL`, `SECRET_KEY`, API keys).
    *   **Aplicar Migraciones de Base de Datos:** (Asegúrate de que la `DATABASE_URL` en `.env` y `alembic.ini` sea correcta)
      ```bash
      alembic upgrade head
      ```
      *Nota: Si modificas los modelos SQLAlchemy, necesitarás generar una nueva migración con `alembic revision --autogenerate -m "Descripción del cambio"` antes de aplicar `upgrade`.*
    *   **Ejecutar la aplicación:**
      ```bash
      uvicorn app.main:app --reload
      ```
    *   La API estará disponible en `http://127.0.0.1:8000` y la documentación interactiva (Swagger UI) en `http://127.0.0.1:8000/docs`.

*(Instrucciones más detalladas y configuración de frontend se añadirán próximamente)*
