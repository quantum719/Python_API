from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db" #obj for the url
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}) #engine creation, connect_args allows for multiple request processing on same db same time
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) #sessionmaker returns a class, which here's stored in SessionLocal. autocommit=False allows us to commit() on our own, autoflish=False prevents giving db unfinished data, bind=engine makes the session use the connection from that engine which we created
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()