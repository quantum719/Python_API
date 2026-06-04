from pydantic import BaseModel
from typing import Optional
from datetime import date

class PatientBase(BaseModel):
    name: str
    age: int
    gender: str
    phone_number: Optional[str] = None
    address: str
    blood_group: str
    diagnosis: str
    admission_date: date

class PatientCreate(PatientBase):
    pass

class PatientResponse(PatientBase):
    id: int

    class Config:
        from_attributes = True

class PatientUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    blood_group: Optional[str] = None
    diagnosis: Optional[str] = None
    admission_date: Optional[date] = None