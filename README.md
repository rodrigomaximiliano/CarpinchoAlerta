# Carpincho Alerta  

Web and mobile system for monitoring, preventing wildfires, and promoting environmental awareness in the province of Corrientes, Argentina.  

## Current Status (Backend)  

This repository contains the backend developed with FastAPI. Implemented features:  

*   **FIRMS Integration:** Retrieval of active fire hotspot data (VIIRS NRT).  
*   **Google Earth Engine Integration:**  
    *   Calculation of NDVI statistics for specific areas.  
    *   Retrieval of historical wildfire data (MODIS).  
*   **User Authentication:**  
    *   New user registration (`/api/v1/auth/register`).  
    *   Login with JWT token generation (`/api/v1/auth/login`).  
    *   Protected endpoint to get the current user's data (`/api/v1/auth/me`).  
    *   Initial support for user roles (`citizen`, `admin`, `firefighter`).  
*   **Wildfire Reporting System:**  
    *   Endpoint for authenticated users to create reports (`POST /api/v1/reports/`).  
    *   Storage of details: location (lat/lon), description, department, village, optional photo, status, and reporting user.  
    *   Report statuses: `PENDING`, `VERIFIED`, `RESOLVED`, `DISMISSED`.  
*   **Database Management (Alembic):**  
    *   Initialization and configuration of Alembic to manage database migrations (compatible with SQLite and PostgreSQL).  
    *   Initial migration to create the `users` and `reports` tables.  
*   **Structure:** Organized with services, schemas (Pydantic), models (SQLAlchemy), and routers.  

## Next Steps  

*   Strengthen role-based access control (RBAC) for report endpoints (e.g., view/modify reports).  
*   Develop GET endpoints to query reports (list, by ID, by user, etc.).  
*   Implement the logic to update report statuses.  
*   Develop a control panel for authorities (administrators, firefighters).  
*   Create an alert system (based on reports, hotspots, etc.).  
*   Develop the frontend (web/mobile).  

## Setup & Execution  

1.  **Clone the repository:**
    ```bash
    git clone <REPOSITORY_URL>
    cd guardian-del-Ibera
    ```
2.  **Backend:**
    *   Navigate to the `backend` directory:
      ```bash
      cd backend
      ```
    *   Create and activate a virtual environment (recommended):
      ```bash
      python -m venv venv
      # Windows
      .\venv\Scripts\activate
      # macOS/Linux
      source venv/bin/activate
      ```
    *   Install dependencies:
      ```bash
      pip install -r requirements.txt
      ```
    *   **Configure Environment Variables:** Copy `.env.example` to `.env` and fill in the required values (such as `DATABASE_URL`, `SECRET_KEY`, API keys).  
    *   **Apply Database Migrations:** (Make sure the `DATABASE_URL` in `.env` and `alembic.ini` is correct)
      ```bash
      alembic upgrade head
      ```
      *Note: If you modify the SQLAlchemy models, you will need to generate a new migration with `alembic revision --autogenerate -m "Description of change"` before applying `upgrade`.*  
    *   **Run the application:**
      ```bash
      uvicorn app.main:app --reload
      ```
    *   The API will be available at `http://127.0.0.1:8000` and the interactive documentation (Swagger UI) at `http://127.0.0.1:8000/docs`.  

## Example Endpoint Usage  

### Create Report  

```json
POST /api/v1/reports/
{
  "latitude": -27.4698,
  "longitude": -58.8306,
  "description": "Visible smoke column",
  "department": "Capital",
  "paraje": "Example Village",
  "photo_url": "https://example.com/photo.jpg"
}

Expected Response

{
  "id": 1,
  "latitude": -27.4698,
  "longitude": -58.8306,
  "description": "Visible smoke column",
  "department": "Capital",
  "paraje": "Example Village",
  "photo_url": "https://example.com/photo.jpg",
  "status": "PENDING",
  "created_at": "2024-06-01T12:00:00",
  "reporter_id": 2
}

Troubleshooting

    If you have migration issues, check that the DATABASE_URL variable is correctly set.

    If you encounter dependency errors, run pip install -r requirements.txt again.

Requirements

    Python >= 3.10 recommended

    pip >= 22

    Alembic >= 1.11

(More detailed instructions and frontend setup will be added soon)
