from pydantic import BaseModel, EmailStr

class UserRegister(BaseModel):
    fullName: str
    cedula: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str