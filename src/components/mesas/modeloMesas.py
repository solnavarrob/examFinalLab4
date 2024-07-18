from datetime import date
from typing import List
from pydantic import BaseModel


class MesaBase(BaseModel):
    id: int
    nombre: str
    fecha: date

class MesaList(BaseModel):
    mesas: List[MesaBase]

class MesaSinId(BaseModel):
    nombre: str
    fecha: date
