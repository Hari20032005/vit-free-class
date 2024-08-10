from typing import List
from fastapi import FastAPI, Request, Form
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from enum import Enum as PyEnum

# Define the database URL
DATABASE_URL = "postgresql://postgres:1234@localhost:5433/my_schedule";

# Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Create a base class for SQLAlchemy models
Base = declarative_base()

# Define an enumeration for the room type
class RoomType(PyEnum):
    classroom = "classroom"
    lab = "lab"

# Define the Schedule model
class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    day = Column(String, index=True)
    type = Column(Enum(RoomType))
    time = Column(String)
    floor = Column(Integer)
    building = Column(String)
    room = Column(String)

# Create the database tables
Base.metadata.create_all(bind=engine)

# Create a SQLAlchemy session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a FastAPI instance
app = FastAPI()

# Define a Pydantic model for request validation
class ScheduleCreate(BaseModel):
    day: str
    type: RoomType
    time: str
    floor: int
    building: str
    room: str

@app.post("/submit/")
async def submit_schedule(
    request: Request,
    day: str = Form(...),
    type: RoomType = Form(...),
    time: str = Form(...),
    floor: int = Form(...),
    building: str = Form(...),
    room: str = Form(...),
):
    # Create a new session
    db = SessionLocal()

    # Create a new Schedule instance
    new_schedule = Schedule(
        day=day,
        type=type,
        time=time,
        floor=floor,
        building=building,
        room=room
    )

    # Add the new schedule to the database
    db.add(new_schedule)
    db.commit()
    db.refresh(new_schedule)
    db.close()

    return {"message": "Schedule submitted successfully"}

@app.get("/data/")
async def get_schedules():
    # Create a new session
    db = SessionLocal()

    # Query all schedules
    schedules = db.query(Schedule).all()
    db.close()

    return {"schedules": [schedule.__dict__ for schedule in schedules]}
