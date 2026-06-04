from fastapi import FastAPI
from app.database import Base, engine
from app import models  # noqa: F401
from app.routers import patients

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Patient Management API",
    description="CRUD API for managing patients",
    version="1.0.0",
)

app.include_router(patients.router)

@app.get("/")
def root():
    return {"message": "Patient Management API", "docs": "/docs"}