from datetime import datetime
from fastapi import APIRouter, HTTPException, Header
from utils.jwt_handler import decode_token
from services.horario_service import get_horario_dia, get_horario_semana, seed_demo, DIAS_SEMANA

router = APIRouter(prefix="/horario", tags=["horario"])

DIAS_PYTHON = {0: "lunes", 1: "martes", 2: "miercoles", 3: "jueves", 4: "viernes", 5: "sabado", 6: "domingo"}


def _get_user(authorization: str) -> str:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token requerido")
    token = authorization.split(" ", 1)[1]
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
    return payload["user_id"]


@router.get("/hoy")
def horario_hoy(authorization: str = Header(...)):
    user_id = _get_user(authorization)
    dia = DIAS_PYTHON.get(datetime.now().weekday(), "lunes")
    return get_horario_dia(user_id, dia)


@router.get("/semana")
def horario_semana(authorization: str = Header(...)):
    user_id = _get_user(authorization)
    return get_horario_semana(user_id)


@router.get("/dia/{dia}")
def horario_dia(dia: str, authorization: str = Header(...)):
    if dia not in DIAS_SEMANA:
        raise HTTPException(status_code=400, detail=f"Día inválido. Usa: {', '.join(DIAS_SEMANA)}")
    user_id = _get_user(authorization)
    return get_horario_dia(user_id, dia)


@router.post("/seed-demo")
def seed_demo_route(authorization: str = Header(...)):
    user_id = _get_user(authorization)
    result = seed_demo(user_id)
    return {"message": "Horario de demo cargado", **result}
