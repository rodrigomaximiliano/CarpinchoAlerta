from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer
from typing import Any

Base = declarative_base()

class BaseModel(Base):
    """
    Clase base abstracta para todos los modelos de SQLAlchemy.
    Proporciona campos comunes y métodos básicos.
    """
    __abstract__ = True
    
    id = Column(Integer, primary_key=True, index=True)
    
    def __init__(self, **kwargs: Any):
        for key, value in kwargs.items():
            setattr(self, key, value)
    
    def update(self, **kwargs: Any) -> None:
        """Actualiza los atributos del modelo"""
        for key, value in kwargs.items():
            setattr(self, key, value)
    
    def to_dict(self) -> dict:
        """Convierte el modelo a un diccionario"""
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}