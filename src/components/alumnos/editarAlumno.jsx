import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { editarAlumno, getAlumno } from './alumnosService.js';

export default function EditarAlumno() {
    const { idAlumno } = useParams();
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [dni, setDni] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        getAlumno(idAlumno)
            .then((alumno) => {
                if (alumno) {
                    setNombre(alumno.nombre);
                    setApellido(alumno.apellido);
                    setDni(alumno.dni);
                } else {
                    setError(`Error al cargar al alumno`);
                }
            })
            .catch((error) => {
                setError(`Error al cargar al alumno: ${error.message}`);
            });
    }, [idAlumno]);

    const handleSubmit = (e) => {
        e.preventDefault();

        editarAlumno(idAlumno, nombre, apellido, dni)
            .then((alumnoEditado) => {
                if (alumnoEditado) {
                    navigate('/alumnos');
                } else {
                    setError(`Error al editar alumno de dni: ${alumnoEditado.dni}`);
                }
            })
            .catch((error) => {
                setError(`Error al editar alumno: ${error.message}`);
            });
    };

    return (
        <div className="container">
            <h2 className="mt-5">Editar Alumno</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre:</label>
                    <input type="text" id="nombre" value={nombre} className="form-control" onChange={(e) => setNombre(e.target.value)} />

                    <label htmlFor="apellido" className="form-label">Apellido:</label>
                    <input type="text" id="apellido" value={apellido} className="form-control" onChange={(e) => setApellido(e.target.value)} />

                    <label htmlFor="dni" className="form-label">DNI:</label>
                    <input type="number" id="dni" value={dni} className="form-control" readOnly />
                </div>
                <button type="submit" className="btn btn-primary">Guardar Cambios</button>

            </form>
        </div>
    );
}
