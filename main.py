from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, Column, Integer, String, Date
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from datetime import date

# Database
DATABASE_URL = "sqlite:///./hrms.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

# Models
class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, unique=True, index=True)
    full_name = Column(String)
    email = Column(String, unique=True)
    department = Column(String)

class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, index=True)
    day = Column(Date)
    status = Column(String)

Base.metadata.create_all(bind=engine)

# App
app = FastAPI()

# ✅ CORS (this fixes Vercel -> Render calls)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Schemas
class EmployeeCreate(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

class AttendanceCreate(BaseModel):
    employee_id: str
    status: str

# Routes
@app.get("/")
def read_root():
    return {"message": "HRMS Backend is running"}

@app.post("/employees")
def add_employee(emp: EmployeeCreate, db: Session = Depends(get_db)):
    new_emp = Employee(**emp.dict())
    db.add(new_emp)
    db.commit()
    db.refresh(new_emp)
    return new_emp

@app.get("/employees")
def list_employees(db: Session = Depends(get_db)):
    return db.query(Employee).all()

@app.delete("/employees/{emp_id}")
def delete_employee(emp_id: int, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == emp_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(emp)
    db.commit()
    return {"message": "Employee deleted"}

@app.post("/attendance")
def mark_attendance(att: AttendanceCreate, db: Session = Depends(get_db)):
    record = Attendance(
        employee_id=att.employee_id,
        day=date.today(),
        status=att.status
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@app.get("/attendance/{employee_id}")
def get_attendance(employee_id: str, db: Session = Depends(get_db)):
    return db.query(Attendance).filter(Attendance.employee_id == employee_id).all()
