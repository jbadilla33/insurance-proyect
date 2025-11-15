import { useState } from "react";
import Styles from "./formprincipal.module.css";

export default function FormularioPrincipal() {
  const [datos, setDatos] = useState({
    tipoid: "",
    numid: "",
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
  });

  const [datosError, setDatosError] = useState({
    tipoid: "",
    numid: "",
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
  });

  function validarDatos(data) {
    let errores = {};
    let esValido = true;

    if (!data.tipoid) {
      errores.tipoid = "Debes seleccionar un tipo de identificación.";
      esValido = false;
    }

    if (!/^[0-9]+$/.test(data.numid)) {
      errores.numid = "Solo se permiten números en el campo de identificación.";
      esValido = false;
    } else if (data.numid.length <= 7) {
      errores.numid = "Debe tener al menos 7 caracteres.";
      esValido = false;
    } else if (data.numid.length > 14) {
      errores.numid = "Debe tener como máximo 14 caracteres.";
      esValido = false;
    }

    if (!data.nombre.trim()) {
      errores.nombre = "El nombre es obligatorio.";
      esValido = false;
    }

    if (!data.apellido.trim()) {
      errores.apellido = "El apellido es obligatorio.";
      esValido = false;
    }
    if (!data.fechaNacimiento) {
      errores.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
      esValido = false;
    } else if (data.fechaNacimiento) {
      const fechaNacimiento = new Date(data.fechaNacimiento);
      const fechaActual = new Date();
      const edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
      if (edad < 18) {
        errores.fechaNacimiento = "Debes tener al menos 18 años.";
        esValido = false;
      }

      if (edad > 70) {
        errores.fechaNacimiento = "Edad supera el maximo cotizable.";
        esValido = false;
      }

      if (fechaNacimiento > fechaActual) {
        errores.fechaNacimiento =
          "La fecha de nacimiento no puede ser en el futuro.";
        esValido = false;
      }
    }

    return { errores, esValido };
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setDatos({
      ...datos,
      [name]: value,
    });
    setDatosError({
      ...datosError,
      [name]: "",
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const { errores, esValido } = validarDatos(datos);
    setDatosError(errores);

    if (esValido) {
      console.log("¡Formulario Enviado Correctamente!", datos);
    } else {
      console.log("Hay errores en el formulario. No se pudo enviar.");
    }
  }

  return (
    <main className={Styles.main}>
      <section className={Styles.sectionTittle}>
        <img src="/imgformprincipal.png" alt="" />
        <div className={Styles.divTittle}>
          <h2>
            Registra tus datos manualmente con precisión y avanza en tu proceso
            sin demoras.
          </h2>
        </div>
      </section>
      <div className={Styles.divButton}>
        <button type="button" className={Styles.buttonVolver}>
          Volver
        </button>
      </div>
      <section className={Styles.sectionForm}>
        <h2>Cédula de Identidad - RIF.</h2>
        <div className={Styles.divForm}>
          <form action="" onSubmit={handleSubmit}>
            <select value={datos.tipoid} name="tipoid" onChange={handleChange}>
              <option value="">Tipo Identificacion</option>
              <option value="V">V</option>
              <option value="P">P</option>
              <option value="J">J</option>
            </select>
            {datosError.tipoid && (
              <span className={Styles.errorSpan}>{datosError.tipoid}</span>
            )}
            <input
              type="text"
              name="numid"
              value={datos.numid}
              placeholder="No. de Identificacion"
              onChange={handleChange}
            />
            {datosError.numid && (
              <span className={Styles.errorSpan}>{datosError.numid}</span>
            )}
            <input
              type="text"
              name="nombre"
              value={datos.nombre}
              placeholder="Nombres"
              onChange={handleChange}
            />
            {datosError.nombre && (
              <span className={Styles.errorSpan}>{datosError.nombre}</span>
            )}
            <input
              type="text"
              name="apellido"
              value={datos.apellido}
              placeholder="Apellidos"
              onChange={handleChange}
            />
            {datosError.apellido && (
              <span className={Styles.errorSpan}>{datosError.apellido}</span>
            )}
            <input
              type="date"
              name="fechaNacimiento"
              value={datos.fechaNacimiento}
              placeholder="Fecha de Nacimiento"
              onChange={handleChange}
            />
            {datosError.fechaNacimiento && (
              <span className={Styles.errorSpan}>
                {datosError.fechaNacimiento}
              </span>
            )}
            <button type="submit">Siguiente</button>
          </form>
        </div>
      </section>
    </main>
  );
}
