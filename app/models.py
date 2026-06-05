from sqlalchemy import Column, Integer, String, Date
from app.database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True, autoincrement=False)
    name = Column(String(100), nullable=False, index=True)
    age = Column(Integer, nullable=False)
    gender = Column(String(10), nullable=False)
    phone_number = Column(String(20))
    address = Column(String(255), nullable=False)
    blood_group = Column(String(5), nullable=False)
    diagnosis = Column(String(255), nullable=False)
    admission_date = Column(Date, nullable=False)
    
    