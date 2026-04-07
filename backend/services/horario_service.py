import re
from datetime import datetime
from database.supabase_client import supabase
from models.horario_model import ClaseModel, HuecoModel, UbicacionModel

DIAS_SEMANA = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"]

# IDs fijos del seed de materias y profesores
SEED_HORARIOS = [
    # Lunes
    {"materia_id": "b1000000-0000-0000-0000-000000000001", "profesor_id": "a1000000-0000-0000-0000-000000000001",
     "dia_semana": "lunes",     "hora_inicio": "08:00", "hora_fin": "10:00", "salon": "Auditorio Principal",   "semestre": "2025-1"},
    {"materia_id": "b1000000-0000-0000-0000-000000000002", "profesor_id": "a1000000-0000-0000-0000-000000000002",
     "dia_semana": "lunes",     "hora_inicio": "10:00", "hora_fin": "12:00", "salon": "Bloque 1 - 302",        "semestre": "2025-1"},
    {"materia_id": "b1000000-0000-0000-0000-000000000003", "profesor_id": "a1000000-0000-0000-0000-000000000003",
     "dia_semana": "lunes",     "hora_inicio": "14:00", "hora_fin": "16:00", "salon": "Bloque 4 - 105",        "semestre": "2025-1"},
    {"materia_id": "b1000000-0000-0000-0000-000000000004", "profesor_id": "a1000000-0000-0000-0000-000000000004",
     "dia_semana": "lunes",     "hora_inicio": "16:00", "hora_fin": "18:00", "salon": "Bloque 3 - 201",        "semestre": "2025-1"},
    # Martes
    {"materia_id": "b1000000-0000-0000-0000-000000000005", "profesor_id": "a1000000-0000-0000-0000-000000000005",
     "dia_semana": "martes",    "hora_inicio": "08:00", "hora_fin": "10:00", "salon": "Lab Sistemas 3",         "semestre": "2025-1"},
    {"materia_id": "b1000000-0000-0000-0000-000000000006", "profesor_id": "a1000000-0000-0000-0000-000000000002",
     "dia_semana": "martes",    "hora_inicio": "14:00", "hora_fin": "16:00", "salon": "Bloque 2 - 204",        "semestre": "2025-1"},
    # Miércoles
    {"materia_id": "b1000000-0000-0000-0000-000000000001", "profesor_id": "a1000000-0000-0000-0000-000000000001",
     "dia_semana": "miercoles", "hora_inicio": "08:00", "hora_fin": "10:00", "salon": "Auditorio Principal",   "semestre": "2025-1"},
    {"materia_id": "b1000000-0000-0000-0000-000000000004", "profesor_id": "a1000000-0000-0000-0000-000000000004",
     "dia_semana": "miercoles", "hora_inicio": "10:00", "hora_fin": "12:00", "salon": "Bloque 3 - 201",        "semestre": "2025-1"},
    {"materia_id": "b1000000-0000-0000-0000-000000000003", "profesor_id": "a1000000-0000-0000-0000-000000000003",
     "dia_semana": "miercoles", "hora_inicio": "14:00", "hora_fin": "16:00", "salon": "Bloque 4 - 105",        "semestre": "2025-1"},
    # Jueves
    {"materia_id": "b1000000-0000-0000-0000-000000000002", "profesor_id": "a1000000-0000-0000-0000-000000000002",
     "dia_semana": "jueves",    "hora_inicio": "10:00", "hora_fin": "12:00", "salon": "Bloque 1 - 302",        "semestre": "2025-1"},
    {"materia_id": "b1000000-0000-0000-0000-000000000005", "profesor_id": "a1000000-0000-0000-0000-000000000005",
     "dia_semana": "jueves",    "hora_inicio": "14:00", "hora_fin": "16:00", "salon": "Lab Sistemas 3",         "semestre": "2025-1"},
    # Viernes
    {"materia_id": "b1000000-0000-0000-0000-000000000006", "profesor_id": "a1000000-0000-0000-0000-000000000002",
     "dia_semana": "viernes",   "hora_inicio": "08:00", "hora_fin": "10:00", "salon": "Bloque 2 - 204",        "semestre": "2025-1"},
    {"materia_id": "b1000000-0000-0000-0000-000000000004", "profesor_id": "a1000000-0000-0000-0000-000000000004",
     "dia_semana": "viernes",   "hora_inicio": "10:00", "hora_fin": "12:00", "salon": "Bloque 3 - 201",        "semestre": "2025-1"},
]


def _parse_salon(salon: str | None) -> UbicacionModel:
    if not salon:
        return UbicacionModel()
    match = re.match(r'[Bb]loque\s+(\w+)\s*[-–]\s*(\d+)', salon)
    if match:
        bloque = match.group(1)
        aula = match.group(2)
        piso = aula[0] if len(aula) == 3 else "1"
        return UbicacionModel(bloque=bloque, piso=piso, aula=aula, descripcion=salon)
    return UbicacionModel(descripcion=salon)


def _format_time(t) -> str:
    return str(t)[:5]


def _minutos_entre(t1_str: str, t2_str: str) -> int:
    fmt = "%H:%M:%S" if len(t1_str) == 8 else "%H:%M"
    dt1 = datetime.strptime(t1_str, fmt)
    dt2 = datetime.strptime(t2_str, fmt)
    return int((dt2 - dt1).total_seconds() / 60)


def _sugerencias(hora_inicio_str: str, duracion_min: int) -> list[str]:
    hora = int(hora_inicio_str[:2])
    sugs = []
    if 11 <= hora <= 14:
        sugs.append("🍽️ Ir a almorzar")
    if duracion_min >= 60:
        sugs.append("📚 Estudio independiente en la biblioteca")
    if duracion_min >= 90:
        sugs.append("☕ Pausa en la cafetería")
    if duracion_min < 60:
        sugs.append("📝 Repasar apuntes de la clase anterior")
    if duracion_min >= 45:
        sugs.append("🏃 Pausa activa / actividad física")
    return sugs[:3]


def _calcular_huecos(clases: list[ClaseModel]) -> list[HuecoModel]:
    if len(clases) < 2:
        return []
    huecos = []
    for i in range(len(clases) - 1):
        fin = clases[i].hora_fin
        inicio = clases[i + 1].hora_inicio
        diff = _minutos_entre(fin + ":00", inicio + ":00")
        if diff >= 30:
            huecos.append(HuecoModel(
                hora_inicio=fin,
                hora_fin=inicio,
                duracion_minutos=diff,
                sugerencias=_sugerencias(fin, diff),
            ))
    return huecos


def _rows_to_clases(rows: list[dict]) -> list[ClaseModel]:
    clases = []
    for r in rows:
        materia = r.get("materias") or {}
        profesor = r.get("profesores") or {}
        salon = r.get("salon")
        clases.append(ClaseModel(
            id=str(r["id"]),
            materia=materia.get("nombre", "Sin nombre"),
            codigo=materia.get("codigo"),
            creditos=materia.get("creditos"),
            profesor=profesor.get("nombre"),
            salon=salon,
            ubicacion=_parse_salon(salon),
            hora_inicio=_format_time(str(r["hora_inicio"])),
            hora_fin=_format_time(str(r["hora_fin"])),
            semestre=r.get("semestre", ""),
        ))
    clases.sort(key=lambda c: c.hora_inicio)
    return clases


def get_horario_dia(user_id: str, dia: str) -> dict:
    rows = (
        supabase.table("horarios")
        .select("*, materias(nombre, codigo, creditos), profesores(nombre)")
        .eq("user_id", user_id)
        .eq("dia_semana", dia)
        .execute()
        .data
    )
    clases = _rows_to_clases(rows)
    return {"dia": dia, "clases": clases, "huecos": _calcular_huecos(clases)}


def get_horario_semana(user_id: str) -> dict:
    rows = (
        supabase.table("horarios")
        .select("*, materias(nombre, codigo, creditos), profesores(nombre)")
        .eq("user_id", user_id)
        .execute()
        .data
    )
    semana: dict = {d: {"dia": d, "clases": [], "huecos": []} for d in DIAS_SEMANA}
    por_dia: dict = {d: [] for d in DIAS_SEMANA}
    for r in rows:
        d = r.get("dia_semana")
        if d in por_dia:
            por_dia[d].append(r)

    for dia, filas in por_dia.items():
        clases = _rows_to_clases(filas)
        semana[dia] = {"dia": dia, "clases": clases, "huecos": _calcular_huecos(clases)}

    return {"semana": semana}


def seed_demo(user_id: str) -> dict:
    # Evitar duplicados: borrar horarios previos del usuario en semestre 2025-1
    supabase.table("horarios").delete().eq("user_id", user_id).eq("semestre", "2025-1").execute()

    registros = [{"user_id": user_id, **h} for h in SEED_HORARIOS]
    supabase.table("horarios").insert(registros).execute()
    return {"inserted": len(registros)}
