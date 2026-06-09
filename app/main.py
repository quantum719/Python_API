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