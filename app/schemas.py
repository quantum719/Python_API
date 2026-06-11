from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import date

class PatientBase(BaseModel): #Base class to inherit from. PatientCreate and PatientResponse inherit it, as they have similar structure.
    name: str
    age: int = Field(ge=0, le=100)
    gender: str
    phone_number: Optional[str] = None
    address: str
    blood_group: Literal["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    diagnosis: str
    admission_date: date
    status: str = "Admitted"

class PatientCreate(PatientBase): #Class used when client sends data. Inherits PatientBase.
    id: int

class PatientResponse(PatientBase):
    id: int

    class Config:
        from_attributes = True

class PatientUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = Field(default=None, ge=0, le=100)
    gender: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    blood_group: Optional[Literal["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]] = None
    diagnosis: Optional[str] = None
    admission_date: Optional[date] = None
    status: Optional[str] = "Admitted"
    
class UserLogin(BaseModel):
    email: str
    password: str
    
class UserCreate(BaseModel):
    email: str
    password: str
    name: str