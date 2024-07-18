from typing import List
from pydantic import BaseModel


class AlumnoBase(BaseModel):
    id: int
    nombre: str
    apellido: str
    dni: int

class AlumnoList(BaseModel):
    alumnos: List[AlumnoBase]

class AlumnoSinId(BaseModel):
    nombre: str
    apellido: str
    dni: int
