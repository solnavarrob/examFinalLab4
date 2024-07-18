import axios from "axios";
//import { getAlumnos } from "../alumnos/alumnos-service";

//let idAlumnosMesa = [];

export function getMesas() {
  const options = {
    method: 'GET',
    url: 'http://localhost:5555/mesas',
  };
  
  return axios.request(options).then(function (response) {
    console.log(response.data);
    return response.data;
  }).catch(function (error) {
    console.error(error);
  });
}

export function borrarMesa(mesaID) {
  const options = {
    method: 'DELETE',
    url: `http://localhost:5555/mesas/${mesaID}`,
  };
  
  return axios.request(options).then(function (response) {
    console.log(response.data);
    return response.data
  }).catch(function (error) {
    console.error(error);
  });
}

export function agregarMesa(nuevaMesa) {
  const options = {
    method: 'POST',
    url: 'http://localhost:5555/mesas',
    data: nuevaMesa,
  };
  
  return axios.request(options).then(function (response) {
    console.log(response.data);
    return response.data;
  }).catch(function (error) {
    console.error(error);
  });
}

export function getMesa(mesaID) {
  const options = {
    method: 'GET',
    url: `http://localhost:5555/mesas/${mesaID}`
  };
  
  return axios.request(options).then(function (response) {
    console.log(response.data);
    return response.data
  }).catch(function (error) {
    console.error(error);
  });
}

export function editarMesa(id, nombre, fecha) {
  const options = {
    method: 'PUT',
    url: `http://localhost:5555/mesas/${id}`,
    data: {
      nombre: nombre,
      fecha: fecha
    }
  };
  
  return axios.request(options).then(function (response) {
    console.log(response.data);
    return response.data
  }).catch(function (error) {
    console.error(error);
  });
}


// Alumnos de una mesa


export function getAlumnosMesa(mesaID) {
  //console.log('Valor de mesaID:', mesaID);
  // let alumnosMesa = [];

  // getMesa(mesaID)
  //   .then((resp) => {
  //     if (resp.status === 200 || resp.status === 304) {
  //       idAlumnosMesa = resp.data.alumnos;
  //     }
  //     //console.log('Llamada a getMesa completada con éxito:', resp);
  //   })
  //   .catch((error) => {
  //     console.log(
  //       `error al cargar datos de mesa en getAlumnosMesa, ${error.message}`
  //     );
  //   });

  // getAlumnos()
  //   .then((alumnos) => {
  //       alumnosMesa = alumnos.data.filter((alumno) => 
  //       idAlumnosMesa.includes(alumno.dni))
  //     })
  //   .catch((error) => {
  //     console.log(
  //       `error al cargar datos de alumnos en getAlumnosMesa, ${error.message}`
  //     );
  //   });
  // return alumnosMesa;

  const options = {
    method: 'GET',
    url: `http://localhost:5555/mesas/alumnos/${mesaID}`
  };
  
  return axios.request(options).then(function (response) {
    console.log(response.data);
    return response.data;
  }).catch(function (error) {
    console.error(error);
  });
}


export async function agregarAlumnoMesa(mesaID, alumnoID) {

  const options = {
    method: 'POST',
    url: `http://localhost:5555/mesas/alumnos/${mesaID}?idAlumno=${alumnoID}`,
  };
  
   axios.request(options).then(function (response) {
    console.log(response.data);
    //return response.data;
  }).catch(function (error) {
    console.error(error);
  });
}



export async function borrarAlumnoMesa(mesaID, alumnoID) {
  const options = {
    method: 'DELETE',
    url: `http://localhost:5555/mesas/alumnos/${mesaID}?idAlumno=${alumnoID}`,
  };
  
  axios.request(options).then(function (response) {
    console.log(response.data);
  }).catch(function (error) {
    console.error(error);
  });
}

