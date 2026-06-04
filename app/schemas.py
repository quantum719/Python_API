from pydantic import BaseModel #Inheriting BaseModel allows Pydantic to supervise the data that comes into classes, converting it or rejecting it or serializing it into JSON
from typing import Optional
from datetime import date

class PatientBase(BaseModel): #Base class to inherit from. PatientCreate and PatientResponse inherit it, as they have similar structure.
    name: str
    age: int
    gender: str
    phone_number: Optional[str] = None
    address: str
    blood_group: str
    diagnosis: str
    admission_date: date

class PatientCreate(PatientBase): #Class used when client sends data. Inherits PatientBase.
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