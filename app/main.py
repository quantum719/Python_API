from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine, SessionLocal
from app import models
from app.routers import patients, auth

Base.metadata.create_all(bind=engine)

def seed_users():
    db = SessionLocal()
    if db.query(models.User).count() == 0:
        users = [
            models.User(email="admin@hospital.com", password="admin123", name="Admin"),
            models.User(email="doctor@hospital.com", password="doctor456", name="Dr. Smith"),
            models.User(email="nurse@hospital.com", password="nurse789", name="Nurse Joy"),
        ]
        db.add_all(users)
        db.commit()
    db.close()

seed_users()

from datetime import date

def seed_patients():
    db = SessionLocal()
    if db.query(models.Patient).count() == 0:
        patients = [
            models.Patient(id=1, name="Rohan Deshmukh", age=34, gender="Male", phone_number="9822334455", address="Kothrud, Pune", blood_group="O+", diagnosis="Typhoid", admission_date=date(2026,1,8), status="Cured"),
            models.Patient(id=2, name="Priya Sharma", age=28, gender="Female", phone_number="9876543210", address="Baner, Pune", blood_group="A+", diagnosis="Dengue Fever", admission_date=date(2026,1,22), status="Cured"),
            models.Patient(id=3, name="Vikram Singh", age=45, gender="Male", phone_number="9988776655", address="Hinjewadi, Pune", blood_group="O+", diagnosis="Cardiac Arrhythmia", admission_date=date(2026,2,3), status="Cured"),
            models.Patient(id=4, name="Sneha Kulkarni", age=62, gender="Female", phone_number="9765432109", address="Aundh, Pune", blood_group="B+", diagnosis="Hip Fracture", admission_date=date(2026,2,14), status="Under Treatment"),
            models.Patient(id=5, name="Amit Kulkarni", age=8, gender="Male", phone_number="9123456780", address="Wakad, Pune", blood_group="A+", diagnosis="Pneumonia", admission_date=date(2026,2,25), status="Cured"),
            models.Patient(id=6, name="Anjali Desai", age=54, gender="Female", phone_number="9012345678", address="Viman Nagar, Pune", blood_group="O+", diagnosis="Type 2 Diabetes", admission_date=date(2026,3,5), status="Under Treatment"),
            models.Patient(id=7, name="Sandeep Joshi", age=39, gender="Male", phone_number="9456781230", address="Kharadi, Pune", blood_group="AB+", diagnosis="Appendicitis", admission_date=date(2026,3,12), status="Cured"),
            models.Patient(id=8, name="Pooja Iyer", age=23, gender="Female", phone_number="9345678120", address="Shivaji Nagar, Pune", blood_group="A+", diagnosis="Viral Fever", admission_date=date(2026,3,20), status="Under Treatment"),
            models.Patient(id=9, name="Arjun Mehta", age=71, gender="Male", phone_number="9234567891", address="Camp, Pune", blood_group="O-", diagnosis="Chronic Bronchitis", admission_date=date(2026,3,28), status="Cured"),
            models.Patient(id=10, name="Neha Joshi", age=31, gender="Female", phone_number="9678901234", address="Hadapsar, Pune", blood_group="B+", diagnosis="Kidney Stones", admission_date=date(2026,4,2), status="Under Treatment"),
            models.Patient(id=11, name="Karan Patil", age=50, gender="Male", phone_number="9567890123", address="Pimpri, Pune", blood_group="O+", diagnosis="Hypertension", admission_date=date(2026,4,15), status="Cured"),
            models.Patient(id=12, name="Kavita Rao", age=19, gender="Female", phone_number="9445566778", address="Magarpatta, Pune", blood_group="A+", diagnosis="Acute Gastroenteritis", admission_date=date(2026,4,26), status="Under Treatment"),
            models.Patient(id=13, name="Suresh Nair", age=67, gender="Male", phone_number="9334455667", address="Deccan, Pune", blood_group="B-", diagnosis="COPD", admission_date=date(2026,5,1), status="Under Treatment"),
            models.Patient(id=14, name="Ritu Singh", age=5, gender="Female", phone_number="9223344556", address="Bavdhan, Pune", blood_group="O+", diagnosis="Tonsillitis", admission_date=date(2026,5,9), status="Admitted"),
            models.Patient(id=15, name="Rahul Verma", age=42, gender="Male", phone_number="9112233445", address="NIBM Road, Pune", blood_group="A-", diagnosis="Fractured Wrist", admission_date=date(2026,5,18), status="Under Treatment"),
            models.Patient(id=16, name="Meera Patel", age=58, gender="Female", phone_number="9001122334", address="Karve Nagar, Pune", blood_group="AB-", diagnosis="Anemia", admission_date=date(2026,5,25), status="Admitted"),
            models.Patient(id=17, name="Vivek Shah", age=36, gender="Male", phone_number="9990011223", address="Sinhagad Road, Pune", blood_group="O+", diagnosis="Malaria", admission_date=date(2026,5,30), status="Cured"),
            models.Patient(id=18, name="Divya Reddy", age=29, gender="Female", phone_number="9889900112", address="Yerwada, Pune", blood_group="A+", diagnosis="Migraine", admission_date=date(2026,6,2), status="Admitted"),
            models.Patient(id=19, name="Manoj Pawar", age=48, gender="Male", phone_number="9778899001", address="Katraj, Pune", blood_group="B+", diagnosis="Appendicitis", admission_date=date(2026,6,6), status="Admitted"),
            models.Patient(id=20, name="Asha Kumar", age=64, gender="Female", phone_number="9667788990", address="Wanowrie, Pune", blood_group="O-", diagnosis="Asthma Exacerbation", admission_date=date(2026,6,10), status="Under Treatment"),
        ]
        db.add_all(patients)
        db.commit()
    db.close()

seed_patients()

app = FastAPI(
    title="Patient Management API",
    description="CRUD API for managing patients",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(patients.router)

@app.get("/")
def root():
    return {"message": "Patient Management API", "docs": "/docs"}