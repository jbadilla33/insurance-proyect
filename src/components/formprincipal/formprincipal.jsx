import { useState } from "react";
import Styles from "./formprincipal.module.css";
import SearchClient from "../../hook/searchClient";
import SeleccionaPlan from "../seleccionaplanes/seleccionaplane";
import { useNavigate, Link } from "react-router-dom";
import GenerateBudget from "../../hook/generatebudgets";

export default function FormularioPrincipal() {
  const navigate = useNavigate();
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

  const [isLoading, setIsLoading] = useState(false);

  const [isNumidEdited, setIsNumidEdited] = useState(false);

  function validarDatos(data) {
    let errores = {};
    let esValido = true;

    const fechaActual = new Date();
    const añoActual = fechaActual.getFullYear();

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
    } else {
      const fechaNacimiento = new Date(data.fechaNacimiento);
      const edad = añoActual - fechaNacimiento.getFullYear();

      if (edad < 18) {
        errores.fechaNacimiento = "Debes tener al menos 18 años.";
        esValido = false;
      } else if (edad > 70) {
        errores.fechaNacimiento = "Edad supera el maximo cotizable.";
        esValido = false;
      } else if (fechaNacimiento > fechaActual) {
        errores.fechaNacimiento =
          "La fecha de nacimiento no puede ser en el futuro.";
        esValido = false;
      }
    }

    return { errores, esValido };
  }

  async function handleSearch(tipoid, numid) {
    if (!tipoid || numid.length < 8) {
      return;
    }

    setIsLoading(true);
    setDatosError({ ...datosError, numid: "" });

    try {
      const cliente = await SearchClient({ tipoid, numid });

      if (cliente && cliente.length > 0) {
        const data = cliente[0];

        let fechaNacimientoISO = "";
        if (data.FECNAC) {
          try {
            const partes = data.FECNAC.split("/");
            if (partes.length === 3) {
              fechaNacimientoISO = `${partes[2]}-${partes[1]}-${partes[0]}`;
            }
          } catch (e) {
            console.error("Error al formatear la fecha:", e);
          }
        }
        setDatos((prevDatos) => ({
          ...prevDatos,
          nombre: data.NOMTER || "",
          apellido: data.APETER || "",
          fechaNacimiento: fechaNacimientoISO,
        }));
        console.log("Datos de cliente cargados:", data);
      } else {
        setDatos((prevDatos) => ({
          ...prevDatos,
          nombre: "",
          apellido: "",
          fechaNacimiento: "",
        }));

        setDatosError((prevErrores) => ({
          ...prevErrores,
          numid: "Cliente no encontrado. Rellene los campos manualmente.",
        }));
      }
    } catch (error) {
      console.error("Error al buscar cliente:", error);
      setDatosError((prevErrores) => ({
        ...prevErrores,
        numid: "Error de conexión al buscar cliente.",
      }));
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setDatos((prevDatos) => {
      const newDatos = { ...prevDatos, [name]: value };

      if (name === "numid" || name === "tipoid") {
        if (name === "tipoid" && value !== prevDatos.tipoid) {
          newDatos.nombre = "";
          newDatos.apellido = "";
          newDatos.fechaNacimiento = "";
        }

        if (name === "numid") {
          setIsNumidEdited(true);
        }

        if (newDatos.tipoid && newDatos.numid.length >= 7) {
          handleSearch(newDatos.tipoid, newDatos.numid);
        }
      }

      return newDatos;
    });

    setDatosError((prevErrores) => ({
      ...prevErrores,
      [name]: "",
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const { errores, esValido } = validarDatos(datos);
    setDatosError(errores);

    if (esValido) {
      const budgets = await GenerateBudget({ datos });
      if (budgets && budgets.p_sts === "OK") {
        // 1. Combina los datos del formulario con la respuesta de la API
        const datosFinales = {
          cliente: datos, // Datos personales del cliente
          budgetInfo: budgets, // El objeto completo de la respuesta de la API (ej: {p_sts: "OK", p_budget_id: 686445})
        };

        navigate("/Planes", {
          state: {
            data: datosFinales,
          },
        });
      } else {
        // Manejar error de API si no devuelve OK
        alert("Error al generar el presupuesto. No se puede avanzar.");
        console.error("Fallo al generar budget:", budgets);
      }
    } else {
      console.log("Hay errores en el formulario. No se pudo enviar.");
    }
  }

  const hayCamposVacios = Object.values(datos).some((valor) => valor === "");
  const hayErroresVisibles = Object.values(datosError).some(
    (error) => error !== ""
  );
  const deshabilitarBoton = hayCamposVacios || hayErroresVisibles || isLoading;

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
            <select
              value={datos.tipoid}
              name="tipoid"
              onChange={handleChange}
              disabled={isLoading}
            >
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
              disabled={isLoading}
            />
            {datosError.numid && (
              <span className={Styles.errorSpan}>{datosError.numid}</span>
            )}
            {isLoading && (
              <span className={Styles.loadingSpan}>Buscando cliente...</span>
            )}

            <input
              type="text"
              name="nombre"
              value={datos.nombre}
              placeholder="Nombres"
              onChange={handleChange}
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
            {datosError.fechaNacimiento && (
              <span className={Styles.errorSpan}>
                {datosError.fechaNacimiento}
              </span>
            )}

            <button type="submit" disabled={deshabilitarBoton}>
              Siguiente
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
