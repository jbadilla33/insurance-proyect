import { useState, useEffect } from "react";
import style from "./registro.module.css";
import SearchActividad from "./listaprofesiones";

export default function Registro() {
  const [actividad, setActividad] = useState([]);

  const [text, setText] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    profesion: "",
    aprobado: false,
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    setText("");

    setFormData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    SearchActividad().then((data) => {
      if (data) {
        setActividad(data);
      }
    });
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (formData.firstName === "") {
      setText("Debe ingresar el nombre");
      return;
    }

    if (formData.lastName === "") {
      setText("Debe ingresar el apellido");
      return;
    }

    if (formData.username === "") {
      setText("Debe ingresar el usuario");
      return;
    }

    if (formData.password === "") {
      setText("Debe ingresar la contraseña");
      return;
    }

    if (formData.email === "") {
      setText("Debe ingresar el correo");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setText("El correo electrónico no es válido");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setText("Las Contraseñas no coinciden");
      return;
    }

    if (formData.profesion === "") {
      setText("Debe ingresar la profesión");
      return;
    }

    if (!formData.aprobado) {
      setText("Debe ingresar los terminos y condiciones");
      return;
    }

    console.log("Datos de registro:", formData);
  };

  return (
    <div className={style.container}>
      <h1>Registrarse</h1>

      <h2>Por favor llenar el siguiente formulario</h2>

      <div className={style.containerForm}>
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            id="firstName"
            placeholder="Nombre Asegurado"
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            type="text"
            id="lastName"
            placeholder="Apellido Asegurado"
            value={formData.lastName}
            onChange={handleChange}
          />
          <input
            type="text"
            id="username"
            placeholder="Usuario"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="password"
            id="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirmar contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <input
            type="text"
            id="email"
            placeholder="Correo"
            value={formData.email}
            onChange={handleChange}
          />
          <select
            id="profesion"
            value={formData.profesion}
            onChange={handleChange}
          >
            <option value="">Profesion</option>
            {actividad.map((act) => (
              <option key={act.VALOR} value={act.VALOR}>
                {act.DESCRIPCION}
              </option>
            ))}
          </select>
          <input
            type="checkbox"
            id="aprobado"
            checked={formData.aprobado}
            onChange={handleChange}
          />{" "}
          <label htmlFor="aprobado">Aceptar terminos y condiciones</label>
          <button type="submmit">Registrarse</button>
        </form>

        {text && <p className={style.error}>{text}</p>}
      </div>
    </div>
  );
}
