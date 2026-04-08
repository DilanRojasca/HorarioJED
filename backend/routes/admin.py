from fastapi import APIRouter, HTTPException, Header
from database.supabase_client import supabase
from utils.jwt_handler import decode_token

router = APIRouter(prefix="/admin", tags=["admin"])

def _verify_admin(authorization: str):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token requerido o formato inválido")
    token = authorization.split(" ", 1)[1]
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
    
    # Check if the user is admin from supabase
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Token sin user_id")
        
    return user_id

@router.get("/students")
def get_students(authorization: str = Header(...)):
    _verify_admin(authorization)
    # Fetch students
    response = supabase.table("users").select("id, full_name, cedula, email").eq("role", "student").execute()
    return response.data

@router.get("/courses")
def get_courses(authorization: str = Header(...)):
    _verify_admin(authorization)
    # Fetch all courses
    response = supabase.table("materias").select("id, nombre, codigo, creditos").execute()
    return response.data
