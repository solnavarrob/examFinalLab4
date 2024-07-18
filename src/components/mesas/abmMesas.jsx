import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMesas, borrarMesa } from "./mesasService.js";


export default function AbmMesas() {

    const [error, setError] = useState(null);
    const [mesas, setMesas] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getMesas()
            .then((mesas) => {
                if (mesas) {
                    setMesas(mesas);
                }
                else {
                    alert('La respuesta es undefined');
                }
            })
            .catch((reason) => {
                setError(reason.message);
            })
    }, [])

    function Eliminar(mesaID) {
        const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar la mesa?`);

        if (confirmDelete) {
            borrarMesa(mesaID)
                .then((mesa) => {
                    console.log(`mesa eliminada: ${mesa}`)
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
            <h1 className="mt-5">Administración de Mesas</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Asignatura</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(mesas.mesas) && mesas.mesas.sort((function (a, b) {
                        if (a.fecha > b.fecha) {
                            return 1;
                        }
                        if (a.fecha < b.fecha) {
                            return -1;
                        }
                        return 0;
                    })).map((mesa) => (
                        <tr key={mesa.id}>
                            <td>{mesa.nombre}</td>
                            <td>{mesa.fecha}</td>
                            <td>
                                <div className="btn-group" role="group" aria-label="Basic example">
                                    <button className="btn btn-info mr-2" onClick={() => navigate(`alumnos/${mesa.id}`)}>Ingresar</button>
                                    <button className="btn btn-secondary" onClick={() => navigate(`/mesas/editar/${mesa.id}`)}>Editar</button>
                                    <button className="btn btn-danger" onClick={() => Eliminar(mesa.id)}>Eliminar</button>
                                </div>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="btn btn-success" onClick={() => navigate('/agregar-mesa')}>Agregar Mesa</button>
        </div>
    );
}