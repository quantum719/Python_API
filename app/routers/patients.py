from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
from app.database import get_db
from app import schemas, crud

router = APIRouter(prefix="/patients", tags=["patients"])


@router.post("/", response_model=schemas.PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient(patient: schemas.PatientCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_patient(db=db, patient=patient)
    except IntegrityError:
        raise HTTPException(status_code=409, detail="A patient with this information already exists")


@router.get("/", response_model=List[schemas.PatientResponse])
def get_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_patients(db=db, skip=skip, limit=limit)


@router.get("/{patient_id}", response_model=schemas.PatientResponse)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    db_patient = crud.get_patient(db=db, patient_id=patient_id)
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return db_patient


@router.put("/{patient_id}", response_model=schemas.PatientResponse)
def update_patient(patient_id: int, patient: schemas.PatientUpdate, db: Session = Depends(get_db)):
    db_patient = crud.update_patient(db=db, patient_id=patient_id, patient_update=patient)
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return db_patient


@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    db_patient = crud.delete_patient(db=db, patient_id=patient_id)
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return None