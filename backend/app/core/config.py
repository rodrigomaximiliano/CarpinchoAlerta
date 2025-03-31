from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Incendios Corrientes API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    DATABASE_URL: str = "sqlite:///./incendios.db"
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 horas
    
    FIRMS_API_KEY: str
    GEE_CREDENTIAL_PATH: str = "./config/credentials/service-account.json"
    GEE_SERVICE_ACCOUNT_EMAIL: str
    GEE_API_KEY: str

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()