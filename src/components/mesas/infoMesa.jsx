import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMesa, agregarAlumnoMesa, getAlumnosMesa, borrarAlumnoMesa } from './mesasService.js';
import { getAlumnos } from '../alumnos/alumnosService.js';



export default function InfoMesa() {
    const { mesaID } = useParams();
    const [nombreMesa, setNombreMesa] = useState('');
    const [alumnosEnMesa, setAlumnosEnMesa] = useState([]);
    const [alumnosDisponibles, setAlumnosDisponibles] = useState([]);
    const [nuevoAlumnoID, setNuevoAlumnoID] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const cargarInfoMesa = async () => {
            try {
                let allAlumnos, mesaAlumnos;
    
                const mesa = await getMesa(mesaID);
                if (mesa) {
                    setNombreMesa(mesa.nombre);
                } else {
                    setError(`Error al cargar la mesa: ${mesa.nombre}`);
                    return;
                }
    
                const alumnosMesa = await getAlumnosMesa(mesaID);
                if (alumnosMesa) {
                    setAlumnosEnMesa(alumnosMesa);
                    mesaAlumnos = alumnosMesa.alumnos;
                } else {
                    setError("mesa sin alumnos");
                    return;
                }
    
                const alumnos = await getAlumnos();
                if (alumnos) {
                    allAlumnos = alumnos.alumnos;
                } else {
                    alert('La respuesta es undefined');
                    return;
                }
    
                const idsEnMesa = mesaAlumnos.map(alumno => alumno.id);
                const alumnosDisp = allAlumnos.filter(alumno => !idsEnMesa.includes(alumno.id));
                setAlumnosDisponibles(alumnosDisp);
            } catch (error) {
                setError(error.message);
            }
        };
    
        cargarInfoMesa();
    }, [mesaID]);
    

    const handleAgregarAlumno = () => {
        let existeAlumnoConMismoDNI
        Array.isArray(alumnosEnMesa.alumnos) && alumnosEnMesa.alumnos.map((alumno) => {
            if (alumno.id == nuevoAlumnoID) existeAlumnoConMismoDNI = true;
        })

        if (existeAlumnoConMismoDNI) {
            setError('Ya existe un alumno con el mismo ID en la mesa.');
        } else {
            setError('');
        }

        agregarAlumnoMesa(mesaID, nuevoAlumnoID);
        // .then((alumno) => {
        //     if (alumno) {
        //         if (!existeAlumnoConMismoDNI && nuevoAlumnoID !== "") {
        //             //setAlumnosEnMesa((prevAlumnosEnMesa) => [
        //             //    ...prevAlumnosEnMesa,
        //             //    nuevoAlumnoID,
        //             //]);
        //         }
        //         else setError('El alumno que intenta agregar ya se encuentra en la lista o no es un alumno valido');
        //         setNuevoAlumnoID('');
        //     } else {
        //         setError(`Error al agregar el alumno`);
        //     }
        // })
        // .catch((error) => {
        //     setError(`Error al agregar el alumno: ${error.message}`);
        // });
        window.location.reload();
    };

    function borrarAlumno(alumnoID) {
        borrarAlumnoMesa(mesaID, alumnoID);
        window.location.reload();
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Información de la Mesa: {nombreMesa}</h1>
            {error && <p className="text-danger">{error}</p>}
            <div>
                <h2>Alumnos Anotados en la Mesa:</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Apellido</th>
                            <th>Nombre</th>
                            <th>DNI</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(alumnosEnMesa.alumnos) && alumnosEnMesa.alumnos.sort((function (a, b) {
                            if (a.apellido > b.apellido) {
                                return 1;
                            }
                            if (a.apellido < b.apellido) {
                                return -1;
                            }
                            return 0;
                        })).map((alumno) => (
                            <tr key={alumno.id}>
                                <td>{alumno.apellido}</td>
                                <td>{alumno.nombre}</td>
                                <td>{alumno.dni}</td>
                                <td><button className="btn btn-danger" onClick={() => borrarAlumno(alumno.id)}>Eliminar</button></td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
            <div className="mt-4">
                <h2>Alumnos:</h2>
                <label htmlFor="nuevoAlumno">Seleccionar Alumno:</label>
                <select
                    id="nuevoAlumno"
                    className="form-select"
                    value={nuevoAlumnoID}
                    onChange={(e) => setNuevoAlumnoID(e.target.value)}
                >
                    <option value="" disabled>
                        Seleccione un alumno
                    </option>
                    {Array.isArray(alumnosDisponibles) && alumnosDisponibles.sort((function (a, b) {
                        if (a.apellido > b.apellido) {
                            return 1;
                        }
                        if (a.apellido < b.apellido) {
                            return -1;
                        }
                        return 0;
                    })).map((alumno) => {
                        //console.log(alumno);
                        return (
                            <option key={alumno.id} value={alumno.id}>
                                {alumno.apellido}, {alumno.nombre}, dni: {alumno.dni}
                            </option>
                        )
                    })}
                </select>

                <button className="btn btn-primary mt-2" onClick={handleAgregarAlumno}>
                    Agregar Alumno
                </button>
            </div>
        </div>
    );
}
