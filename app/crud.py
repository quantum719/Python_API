from sqlalchemy.orm import Session
from app import models
from app import schemas
from sqlalchemy import or_, cast, String

def create_patient(db: Session, patient: schemas.PatientCreate):
    db_patient = models.Patient(
        id=patient.id,
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

def get_patients(db, skip=0, limit=10, search=None):
    query = db.query(models.Patient)
    if search:
        term = f"%{search}%"
        query = query.filter(or_(
            models.Patient.name.ilike(term),
            models.Patient.gender.ilike(term),
            models.Patient.phone_number.ilike(term),
            models.Patient.address.ilike(term),
            models.Patient.blood_group.ilike(term),
            models.Patient.diagnosis.ilike(term),
            models.Patient.admission_date.ilike(term),
            models.Patient.status.ilike(term),
            cast(models.Patient.age, String).ilike(term),
            cast(models.Patient.id, String).ilike(term),
        ))
    return query.offset(skip).limit(limit).all()

def count_patients(db, search=None):
    query = db.query(models.Patient)
    if search:
        term = f"%{search}%"
        query = query.filter(or_(
            models.Patient.name.ilike(term),
            models.Patient.gender.ilike(term),
            models.Patient.phone_number.ilike(term),
            models.Patient.address.ilike(term),
            models.Patient.blood_group.ilike(term),
            models.Patient.diagnosis.ilike(term),
            models.Patient.admission_date.ilike(term),
            models.Patient.status.ilike(term),
            cast(models.Patient.age, String).ilike(term),
            cast(models.Patient.id, String).ilike(term),
        ))
    return query.count()

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