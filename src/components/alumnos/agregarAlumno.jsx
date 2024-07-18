import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { agregarAlumno } from './alumnosService.js';

export default function AgregarAlumno() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');


  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre || !apellido || !dni) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    let alumnoNuevo = {nombre, apellido, dni}

    agregarAlumno(alumnoNuevo)
      .then(() => {
        navigate('/alumnos')
      })
      .catch((error) => {
        alert(`Error al agregar alumno: ${error.message}`);
      });
  };

  return (
    <div className="container">
      <h1 className="mt-5">Agregar Alumno</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre:</label>
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
          <label htmlFor="apellido" className="form-label">Apellido:</label>
          <input
            type="text"
            className="form-control"
            id="apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="dni" className="form-label">DNI:</label>
          <input
            type="number"
            min={10000000}
            className="form-control"
            id="dni"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Agregar Alumno</button>
      </form>
    </div>
  );
}