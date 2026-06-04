from app.database import Base, engine
from app import models  # noqa: F401 — registers Patient with Base

Base.metadata.create_all(bind=engine) #creates the whole database with all tables (classes derived from Base) and binds to engine

print("Database tables created.")