import axios from "axios";
const URL = "http://localhost:5555/";

export function getAlumnos() {
  const options = {
    method: "GET",
    url: "http://localhost:5555/alumnos",
  };

  return axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
}

export function borrarAlumno(alumnoID) {
  const options = {
    method: "DELETE",
    url: `http://localhost:5555/alumnos/${alumnoID}`,
  };

  return axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      console.error(`error en borrarAlumno(): ${error}`);
    });
  //return axios.delete(`http://localhost:3000/alumnos/${alumnoID}`);
}

export function agregarAlumno(nuevoAlumno) {
  const options = {
    method: "POST",
    url: `${URL}alumnos`,
    data: nuevoAlumno,
  };
  
  return axios
    .request(options)
    .then(function (response) {
      if (response) {
        console.log(response.data);
        return response.data;
      } else console.log(response.status);
    })
    .catch(function () {
      alert("Dni ya registrado");
    });

  //   return axios
  //     .post("http://localhost:3000/alumnos", nuevoAlumno)
  //     .then((resp) => {
  //       console.log("Respuesta al agregar alumno:", resp.data);
  //     });
}

export function getAlumno(alumnoID) {
  const options = {
    method: "GET",
    url: `http://localhost:5555/alumnos/${alumnoID}`,
  };

  return axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      console.error(`error en gerAlumno(): ${error}`);
    });
  //return axios.get(`http://localhost:3000/alumnos/${alumnoID}`);
}

export function editarAlumno(id, nombre, apellido, dni) {
  const options = {
    method: "PUT",
    url: `http://localhost:5555/alumnos/${id}`,
    data: {
      nombre: nombre,
      apellido: apellido,
      dni: dni,
    },
  };

  return axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });

  //   return axios.put(`http://localhost:3000/alumnos/${id}`, {
  //     dni,
  //     nombre,
  //     apellido,
  //   });
}