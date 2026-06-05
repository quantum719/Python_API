from sqlalchemy.orm import Session
from app import models
from app import schemas

def create_patient(db: Session, patient: schemas.PatientCreate):
    db_patient = models.Patient(
        name=patient.name,
        age=patient.age,
        gender=patient.gender,
        phone_number=patient.phone_number,
        address=patient.address,
        blood_group=patient.blood_group,
        diagnosis=patient.diagnosis,
        admission_date=patient.admission_date
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

def get_patients(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Patient).offset(skip).limit(limit).all()

def get_patient(db: Session, patient_id: int):
    return db.query(models.Patient).filter(models.Patient.id == patient_id).first()

def update_patient(db: Session, patient_id: int, patient_update: schemas.PatientUpdate):
    db_patient = get_patient(db, patient_id)
    if db_patient is None:
        return None
    
    update_data = patient_update.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(db_patient, field, value)
    
    db.commit()
    db.refresh(db_patient)
    return db_patient

def delete_patient(db: Session, patient_id: int):
    db_patient = get_patient(db, patient_id)
    if db_patient is None:
        return None
    db.delete(db_patient)
    db.commit()
    return db_patient