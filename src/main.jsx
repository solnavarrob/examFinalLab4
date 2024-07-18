//import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.css'
import { Routes, BrowserRouter, Route } from 'react-router-dom'
import Home from './components/home.jsx'
import AbmMesas from './components/mesas/abmMesas.jsx'
import AgregarMesa from './components/mesas/agregarMesa.jsx'
import EditarMesa from './components/mesas/editarMesa.jsx'
import AbmAlumnos from './components/alumnos/abmAlumnos.jsx'
import AgregarAlumno from './components/alumnos/agregarAlumno.jsx'
import EditarAlumno from './components/alumnos/editarAlumno.jsx'
import InfoMesa from './components/mesas/infoMesa.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(

    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route index={true} element={<Home />}></Route>
          <Route path='mesas' element={<AbmMesas />}/>
          <Route path='agregar-mesa' element={<AgregarMesa />} />
          <Route path='mesas/editar/:id' element={<EditarMesa />} />
          <Route path='mesas/alumnos/:mesaID' element={<InfoMesa />} />
          <Route path='alumnos' element={<AbmAlumnos />} />
          <Route path='agregar-alumno' element={<AgregarAlumno />} />
          <Route path='alumnos/editar/:idAlumno' element={<EditarAlumno />} />
        </Route>
      </Routes>
    </BrowserRouter>

)