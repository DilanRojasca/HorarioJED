from database.supabase_client import supabase
from utils.hash import hash_password, verify_password
from utils.jwt_handler import create_token


def register_user(data):

    hashed_password = hash_password(data.password)

    user = {
        "full_name": data.fullName,
        "cedula": data.cedula,
        "email": data.email,
        "password": hashed_password
    }

    response = supabase.table("users").insert(user).execute()

    return response.data


def login_user(data):

    response = supabase.table("users").select("*").eq("email", data.email).execute()

    user = response.data

    if not user:
        return None

    user = user[0]

    if not verify_password(data.password, user["password"]):
        return None

    token = create_token({
        "user_id": user["id"],
        "email": user["email"]
    })

    return {
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["full_name"],
            "email": user["email"]
        }
    }