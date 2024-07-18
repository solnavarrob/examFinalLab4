import datetime
from typing import Dict, Optional, List
from fastapi import Body, FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from datetime import date
from sqlalchemy.exc import IntegrityError
from pydantic import BaseModel
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from sqlalchemy import Column, Date, ForeignKey, Integer, String, column, create_engine, select, text
from fastapi.responses import JSONResponse
from components.alumnos.modeloAlumnos import AlumnoBase, AlumnoList, AlumnoSinId
from components.mesas.modeloMesas import MesaBase, MesaList, MesaSinId

SQLALCHEMY_DATABASE_URL = "postgresql+psycopg2://postgres:081063@localhost:5432/postgres"
engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


Base = declarative_base()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)




class Alumno(Base):  
    __tablename__ = 'alumnos'
    id = Column(Integer, primary_key=True)
    nombre = Column(String(50))
    apellido = Column(String(50))
    dni = Column(Integer, unique=True)
    mesas_asignadas = relationship('AlumnoXMesa', back_populates='alumno')

class Mesa(Base):  
    __tablename__ = 'mesas'
    id = Column(Integer, primary_key=True)
    nombre = Column(String(50))
    fecha = Column(Date)
    alumnos_inscritos = relationship('AlumnoXMesa', back_populates='mesa')

class AlumnoXMesa(Base):
    __tablename__ = 'alumnosXmesas'
    idMesa = Column(Integer, ForeignKey('mesas.id'), primary_key=True)
    idAlumno = Column(Integer, ForeignKey('alumnos.id'), primary_key=True)
    alumno = relationship('Alumno', back_populates='mesas_asignadas')
    mesa = relationship('Mesa', back_populates='alumnos_inscritos')

#Base.metadata.drop_all(engine)    
Base.metadata.create_all(engine)

session = SessionLocal()

class AlumnosRepository():
    def buscar_alumno(self, session, id: int) -> Alumno:
        alumnoBuscado = session.query(Alumno).filter(Alumno.id == id).first()
        if alumnoBuscado is None:
            raise HTTPException(status_code=404, detail="Alumno no encontrado")
        return alumnoBuscado
    
    def all_alumnos(self, session) -> List[Alumno]:
        alumnos = session.query(Alumno).all()
        return alumnos
    
    def guardar_alumno(self, session, alumno: Alumno) -> Alumno:
        try:
            session.add(alumno)
            session.commit()
            return alumno
        except IntegrityError: 
            session.rollback()
            raise HTTPException(status_code=400, detail="Un alumno con este DNI ya existe.")
    
    
    def editar_alumno(self, session, idAlumno: int, nombreAlumno: str, apellidoAlumno: str, dniAlumno: int):
        alumnoBuscado = session.query(Alumno).filter(Alumno.id == idAlumno).first()
        if alumnoBuscado is None:
            raise HTTPException(status_code=404, detail="Alumno no encontrado")
        alumnoBuscado.nombre = nombreAlumno
        alumnoBuscado.apellido = apellidoAlumno
        alumnoBuscado.dni = dniAlumno
        session.commit()
        return alumnoBuscado
    
    def eliminar_alumno(self, session, idAlumno: int):
        alumnoBuscado = session.query(Alumno).filter(Alumno.id == idAlumno).first()
        if alumnoBuscado is None:
            raise HTTPException(status_code=404, detail="Alumno no encontrado")
        
        inscripciones = session.query(AlumnoXMesa).filter(AlumnoXMesa.idAlumno == idAlumno).all()
        for inscripcion in inscripciones:
           session.delete(inscripcion)

        session.delete(alumnoBuscado)
        session.commit()
        return alumnoBuscado


class MesasRepository():
    def buscar_mesa(self, session, idMesa: int) -> Mesa:
        mesaBuscada = session.query(Mesa).filter(Mesa.id == idMesa).first()
        if mesaBuscada is None:
            raise HTTPException(status_code=404, detail="Mesa no encontrada")
        return mesaBuscada
    
    def all_mesas(self, session) -> List[Mesa]:
        mesas = session.query(Mesa).all()
        return mesas
    
    def guardar_mesa(self, session, mesa: Mesa) -> Mesa:
        try:
            session.add(mesa)
            session.commit()
            return mesa
        except IntegrityError as e: 
            session.rollback()
            raise HTTPException(status_code=400, detail=str(e.orig))
    
    def editar_mesa(self, session, idMesa: int, nombreMesa: str, fechaMesa: date):
        mesaBuscada = session.query(Mesa).filter(Mesa.id == idMesa).first()
        if mesaBuscada is None:
            raise HTTPException(status_code=404, detail="Mesa no encontrada")
        mesaBuscada.nombre = nombreMesa
        mesaBuscada.fecha = fechaMesa
        session.commit()
        return mesaBuscada
    
    def eliminar_mesa(self, session, idMesa: int):
        mesaBuscada = session.query(Mesa).filter(Mesa.id == idMesa).first()
        if mesaBuscada is None:
            raise HTTPException(status_code=404, detail="Mesa no encontrada")
        
        inscripciones = session.query(AlumnoXMesa).filter(AlumnoXMesa.idMesa == idMesa).all()
        for inscripcion in inscripciones:
           session.delete(inscripcion)

        session.delete(mesaBuscada)
        session.commit()
        return mesaBuscada

class AlumnosXmesaRepository():
    def all_alumnos_mesa(self, session, idMesa: int):
        listaAlumnosMesa = session.query(AlumnoXMesa).filter(AlumnoXMesa.idMesa == idMesa).all()
        if not listaAlumnosMesa:
            raise HTTPException(status_code=404, detail="Mesa sin alumnos")
        listaAlumnos = [session.query(Alumno).filter(Alumno.id == alumnoXmesa.idAlumno).first() for alumnoXmesa in listaAlumnosMesa] 
        listaAlumnosBase = [AlumnoBase(id=alumno.id, nombre=alumno.nombre, apellido=alumno.apellido, dni=alumno.dni) for alumno in listaAlumnos]
        return AlumnoList(alumnos=listaAlumnosBase)

    def borrar_alumno_mesa(self, session, idMesa: int, idAlumno: int):
        alumnoMesaBuscado = session.query(AlumnoXMesa).filter(AlumnoXMesa.idMesa == idMesa, AlumnoXMesa.idAlumno == idAlumno).first()
        if alumnoMesaBuscado is None:
            raise HTTPException(status_code=404, detail="Alumno no encontrado")

        alumnoBorrado = session.query(Alumno).filter(Alumno.id == idAlumno).first()
        if alumnoBorrado is None:
            raise HTTPException(status_code=404, detail="Alumno no encontrado")
        
        session.delete(alumnoMesaBuscado)
        session.commit()
        #return AlumnoBase(id=alumnoBorrado.id, nombre=alumnoBorrado.nombre, apellido=alumnoBorrado.apellido, dni=alumnoBorrado.dni)

    def agregar_alumno_mesa(self, session, idMesa: int, idAlumno: int):
        mesa = session.query(Mesa).filter(Mesa.id == idMesa).first()
        if mesa is None:
            raise HTTPException(status_code=404, detail="Mesa no encontrada")

        alumno = session.query(Alumno).filter(Alumno.id == idAlumno).first()
        if alumno is None:
            raise HTTPException(status_code=404, detail="Alumno no encontrado")

        alumno_en_mesa = session.query(AlumnoXMesa).filter(AlumnoXMesa.idMesa == idMesa, AlumnoXMesa.idAlumno == idAlumno).first()
        if alumno_en_mesa is not None:
            raise HTTPException(status_code=400, detail="El alumno ya está en la mesa")

        alumno_mesa = AlumnoXMesa(idMesa=idMesa, idAlumno=idAlumno)
        session.add(alumno_mesa)
        session.commit()


###########Alumnos################

@app.get("/alumnos", response_model=AlumnoList)
async def get_alumnos():
    repo = AlumnosRepository()
    alumnos = repo.all_alumnos(session)
    return {"alumnos": [AlumnoBase(id=alumno.id, nombre=alumno.nombre, apellido=alumno.apellido, dni=alumno.dni) for alumno in alumnos]}

@app.get("/alumnos/{idAlumno}", response_model=AlumnoBase)
async def get_alumno(idAlumno: int):
    repo = AlumnosRepository()
    alumnoBuscado = repo.buscar_alumno(session, idAlumno)
    return alumnoBuscado

@app.post("/alumnos", response_model=AlumnoBase)
async def post_alumno(alumno: AlumnoSinId):
    if(alumno.dni > 99999999):
        raise HTTPException(status_code=400, detail="Dni no valido.")
    try:
        repo = AlumnosRepository()
        print(alumno.dni > 99999999)
        print(alumno)

        alumnoNuevo = Alumno(nombre=alumno.nombre, apellido=alumno.apellido, dni=alumno.dni)
        alumno_guardado = repo.guardar_alumno(session, alumnoNuevo)
        return alumno_guardado
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Un alumno con este DNI ya existe.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ocurrió un error al agregar el alumno. {e}")

@app.put("/alumnos/{idAlumno}", response_model=AlumnoBase)
async def put_alumno(idAlumno: int, data_alumno: AlumnoSinId):
    repo = AlumnosRepository()
    alumnoEditado = repo.editar_alumno(session, idAlumno, data_alumno.nombre, data_alumno.apellido, data_alumno.dni)
    return alumnoEditado

@app.delete("/alumnos/{idAlumno}", response_model=AlumnoBase)
async def delete_alumno(idAlumno: int):
    repo =AlumnosRepository()
    alumnoEliminado = repo.eliminar_alumno(session, idAlumno)
    return alumnoEliminado

################Mesas######################

@app.get("/mesas", response_model=MesaList)
async def get_mesas():
    repo = MesasRepository()
    mesas = repo.all_mesas(session)
    return {"mesas": [MesaBase(id=mesa.id, nombre=mesa.nombre, fecha=mesa.fecha) for mesa in mesas]}

@app.get("/mesas/{idMesa}", response_model=MesaBase)
async def get_mesa(idMesa: int):
    repo = MesasRepository()
    mesaBuscada = repo.buscar_mesa(session, idMesa)
    return mesaBuscada

@app.post("/mesas", response_model=MesaBase)
async def post_mesa(mesa: MesaSinId):
    repo = MesasRepository()
    mesaNueva = Mesa(nombre=mesa.nombre, fecha=mesa.fecha)
    mesa_guardada = repo.guardar_mesa(session, mesaNueva)
    return mesa_guardada

@app.put("/mesas/{idMesa}", response_model=MesaBase)
async def put_mesa(idMesa: int, data_mesa: MesaSinId):
    repo = MesasRepository()
    alumnoEditado = repo.editar_mesa(session, idMesa, data_mesa.nombre, data_mesa.fecha)
    return alumnoEditado

@app.delete("/mesas/{idMesa}", response_model=MesaBase)
async def delete_mesa(idMesa: int):
    repo = MesasRepository()
    mesaEliminada = repo.eliminar_mesa(session, idMesa)
    return mesaEliminada

##########alumnosXmesas##########

@app.get("/mesas/alumnos/{idMesa}", response_model=AlumnoList)
async def get_alumnos_mesa(idMesa: int):
    repo = AlumnosXmesaRepository()
    alumnos_mesa = repo.all_alumnos_mesa(session, idMesa)
    return alumnos_mesa

@app.post("/mesas/alumnos/{idMesa}")
async def post_alumno_mesa(idMesa: int, idAlumno: int):
    repo = AlumnosXmesaRepository()
    repo.agregar_alumno_mesa(session, idMesa, idAlumno)

@app.delete("/mesas/alumnos/{idMesa}")
async def delete_alumno_mesa(idMesa: int, idAlumno: int):
    repo = AlumnosXmesaRepository()
    alumnoBorrado = repo.borrar_alumno_mesa(session, idMesa, idAlumno)


    