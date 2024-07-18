import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAlumnos, borrarAlumno } from './alumnosService.js';

export default function AbmAlumnos() {

    const [error, setError] = useState(null);
    const [alumnos, setAlumnos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getAlumnos()
            .then((alumnos) => {
                if (alumnos) {
                    setAlumnos(alumnos);
                } else {
                    alert('La respuesta es undefined');
                }
            })
            .catch((reason) => {
                setError(reason.message);
            })
    }, [])

    function Eliminar(alumnoID) {
        const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar al alumno?`);

        if (confirmDelete) {
            borrarAlumno(alumnoID)
                .then((alumno) => {
                    console.log(`alumno eliminado: ${alumno}`)
                    window.location.reload();
                })
                .catch((reason) => {
                    setError(reason.message);
                });


        }
    }

    return (
        <div className="container">
            {error ? <h1>{error}</h1> : null}
            <h1 className="mt-5">Padron de alumnos</h1>
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
                    {Array.isArray(alumnos.alumnos) && alumnos.alumnos.sort((function (a, b) {
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
                            <td>
                                <div className="btn-group" role="group" aria-label="Basic example">
                                    <button className="btn btn-secondary" onClick={() => navigate(`/alumnos/editar/${alumno.id}`)}>Editar</button>
                                    <button className="btn btn-danger" onClick={() => Eliminar(alumno.id)}>Eliminar</button>
                                </div>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
            <button className="btn btn-success" onClick={() => navigate('/agregar-alumno')}>Agregar Alumno</button>
        </div>
    );
}
