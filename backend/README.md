# Backend - Sistema de Prevención de Incendios

Este directorio contiene el código fuente del backend para el sistema de prevención de incendios "Guardián del Iberá".

## Descripción General

El backend está desarrollado utilizando **FastAPI**, un moderno framework web de Python. Se encarga de gestionar la lógica de negocio, la interacción con la base de datos y la comunicación con servicios externos como Google Earth Engine.

## Tecnologías Principales

*   **Framework:** FastAPI
*   **Base de Datos:** SQLAlchemy con SQLite (`incendios.db`)
*   **Autenticación:** python-jose, passlib
*   **Procesamiento Geoespacial:** Google Earth Engine API, Geopy, Xarray, Pandas
*   **Manejo de Dependencias:** pip (`requirements.txt`)
*   **Servidor ASGI:** Uvicorn

## Estructura del Proyecto

```
backend/
├── .env                 # Variables de entorno (configuración sensible)
├── .gitignore           # Archivos ignorados por Git
├── app/                 # Directorio principal de la aplicación FastAPI
│   ├── __init__.py
│   ├── api/             # Módulos de API (endpoints/rutas)
│   ├── core/            # Configuración central (ej. seguridad, settings)
│   ├── db/              # Módulos de base de datos (modelos, sesión)
│   ├── main.py          # Punto de entrada de la aplicación FastAPI
│   ├── schemas/         # Esquemas Pydantic (validación de datos)
│   ├── services/        # Lógica de negocio y servicios
│   └── utils/           # Funciones de utilidad
├── config/              # Archivos de configuración específicos
│   └── credentials/     # Credenciales (ej. para Google Earth Engine)
├── incendios.db         # Base de datos SQLite
├── requirements-dev.txt # Dependencias para desarrollo
├── requirements.txt     # Dependencias del proyecto
├── README.md            # Este archivo
└── venv/                # Entorno virtual de Python (si se usa)
```

## Funcionalidades Principales (Inferidas)

*   Gestión de datos relacionados con incendios (posiblemente históricos o predicciones).
*   Autenticación y autorización de usuarios.
*   Procesamiento y análisis de datos geoespaciales obtenidos de Google Earth Engine.
*   Exposición de una API RESTful para interactuar con un frontend u otros servicios.

## Cómo Empezar (Pasos generales)

1.  **Clonar el repositorio** (si aplica).
2.  **Crear y activar un entorno virtual:**
    ```bash
    python -m venv venv
    # En Windows
    venv\Scripts\activate
    # En macOS/Linux
    source venv/bin/activate
    ```
3.  **Instalar dependencias:**
    ```bash
    pip install -r requirements.txt
    ```
    *Nota: Puede ser necesario instalar también `requirements-dev.txt` para desarrollo.*
4.  **Configurar variables de entorno:** Crear un archivo `.env` basado en un posible `.env.example` (si existe) o según la documentación, incluyendo credenciales de base de datos y API keys (como Google Earth Engine).
5.  **Ejecutar la aplicación:**
    ```bash
    uvicorn app.main:app --reload
    ```
    *(El comando exacto puede variar según la configuración en `app/main.py`)*
6.  Acceder a la API a través de `http://127.0.0.1:8000` (o el puerto configurado) y a la documentación interactiva en `http://127.0.0.1:8000/docs`.

## Próximos Pasos Sugeridos

*   Revisar el contenido de `app/main.py`, `app/api/` y `app/services/` para entender en detalle los endpoints y la lógica de negocio.
*   Examinar `app/db/models.py` (o similar) para comprender la estructura de la base de datos.
*   Verificar la configuración en `app/core/config.py` (o similar) y el archivo `.env`.
*   Asegurarse de tener las credenciales correctas en `config/credentials/` para servicios como Google Earth Engine.
