from jose import jwt
import os
from datetime import datetime, timedelta

SECRET = os.getenv("JWT_SECRET")

def create_token(data: dict):

    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(hours=24)

    token = jwt.encode(payload, SECRET, algorithm="HS256")

    return token