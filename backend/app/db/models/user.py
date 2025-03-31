from sqlalchemy import Boolean, Column, Integer, String, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.db.base_class import Base
from app.schemas.user import UserRole

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.citizen, nullable=False)
    is_active = Column(Boolean(), default=True)
    is_superuser = Column(Boolean(), default=False)

    # Inverse relationship with Report
    reports = relationship("Report", back_populates="reporter")