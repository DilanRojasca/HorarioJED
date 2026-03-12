from fastapi import APIRouter, HTTPException
from models.user_model import UserRegister, UserLogin
from services.auth_service import register_user, login_user

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.post("/register")
def register(data: UserRegister):

    user = register_user(data)

    return {
        "message": "Usuario creado",
        "user": user
    }


@router.post("/login")
def login(data: UserLogin):

    result = login_user(data)

    if not result:
        raise HTTPException(
            status_code=401,
            detail="Credenciales incorrectas"
        )

    return result