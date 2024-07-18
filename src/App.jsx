import { NavLink, Outlet } from 'react-router-dom'
import './App.css'
//import logoUTN from './logo/logoUTN.png'

function App() {


  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to={'/'}>Home</NavLink>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item ">
                <NavLink className="nav-link" to={'/mesas'}>Mesas de examenes</NavLink>
              </li>
              <li className="nav-item ">
                <NavLink className="nav-link" to={'/alumnos'}>Alumnos</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Outlet />
      
    </>
  )
}

export default App