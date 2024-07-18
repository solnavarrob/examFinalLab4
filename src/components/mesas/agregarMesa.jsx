import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { agregarMesa } from './mesasService.js';

export default function AgregarMesa() {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre || !fecha) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    let mesaNueva = {nombre, fecha}

    agregarMesa(mesaNueva)
      .then(() => {
        navigate('/mesas')
      })
      .catch((error) => {
        alert(`Error al agregar mesa: ${error.message}`);
      });
  };

  return (
    <div className="container">
      <h1 className="mt-5">Agregar Mesa</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre de la Asignatura:</label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="fecha" className="form-label">Fecha del Examen:</label>
          <input
            type="date"
            className="form-control"
            id="fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Agregar Mesa</button>
      </form>
    </div>
  );
}