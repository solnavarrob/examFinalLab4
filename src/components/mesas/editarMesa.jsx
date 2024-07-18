import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { editarMesa, getMesa } from './mesasService.js';

export default function EditarMesa() {
    const { id } = useParams();
    const [nombre, setNombre] = useState('');
    const [fecha, setFecha] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        getMesa(id)
            .then((mesa) => {
                if (mesa) {
                    setNombre(mesa.nombre);
                    setFecha(mesa.fecha);
                } else {
                    setError(`Error al cargar la mesa`);
                }
            })
            .catch((error) => {
                setError(`Error al cargar la mesa: ${error.message}`);
            });
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();

        editarMesa(id, nombre, fecha)
            .then((mesa) => {
                if (mesa) {
                    navigate('/mesas');
                } else {
                    setError(`Error al editar la mesa: ${mesa.id}`);
                }
            })
            .catch((error) => {
                setError(`Error al editar la mesa: ${error.message}`);
            });
    };

    return (
        <div className="container">
            <h2 className="mt-5">Editar Mesa</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre de la Asignatura:</label>
                    <input type="text" id="nombre" value={nombre} className="form-control" onChange={(e) => setNombre(e.target.value)} />

                    <label htmlFor="fecha" className="form-label">Fecha del Examen:</label>
                    <input type="date" id="fecha" value={fecha} className="form-control" onChange={(e) => setFecha(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary">Guardar Cambios</button>

            </form>
        </div>
    );
}
