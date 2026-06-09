from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import schemas, models

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login")
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="No account found with this email")
    if user.password != credentials.password:
        raise HTTPException(status_code=401, detail="Incorrect password")
    return { "id": user.id, "name": user.name, "email": user.email }