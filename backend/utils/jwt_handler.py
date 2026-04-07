from jose import jwt, JWTError
import os
from datetime import datetime, timedelta

SECRET = os.getenv("JWT_SECRET")

def create_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(hours=24)
    token = jwt.encode(payload, SECRET, algorithm="HS256")
    return token

def decode_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(token, SECRET, algorithms=["HS256"])
        return payload
    except JWTError:
        return None