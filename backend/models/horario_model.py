from pydantic import BaseModel
from typing import Optional, List


class UbicacionModel(BaseModel):
    bloque: Optional[str] = None
    piso: Optional[str] = None
    aula: Optional[str] = None
    descripcion: Optional[str] = None


class ClaseModel(BaseModel):
    id: str
    materia: str
    codigo: Optional[str] = None
    creditos: Optional[int] = None
    profesor: Optional[str] = None
    salon: Optional[str] = None
    ubicacion: UbicacionModel
    hora_inicio: str
    hora_fin: str
    semestre: str


class HuecoModel(BaseModel):
    hora_inicio: str
    hora_fin: str
    duracion_minutos: int
    sugerencias: List[str]


class HorarioDiaResponse(BaseModel):
    dia: str
    clases: List[ClaseModel]
    huecos: List[HuecoModel]


class HorarioSemanaResponse(BaseModel):
    semana: dict
