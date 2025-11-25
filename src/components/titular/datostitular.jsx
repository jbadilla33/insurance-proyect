import { useParams, useNavigate } from "react-router-dom";
import SearchBudget from "../../hook/searchbudgets";
import { useEffect, useState, useCallback } from "react";
import SearchClient from "../../hook/searchclient";
import GetListValues from "../../hook/getlistvalues";
import Style from "./datostitular.module.css";
// importamos el hook para el próximo paso (asumiendo que existe)
// import NextStepHook from "../../hook/nextstephook";

export default function DatosTitular() {
  const navigate = useNavigate();
  const { budgetId } = useParams(); // Usamos desestructuración directa

  // --- Estados de Datos ---
  const [datosBudget, setDatosBudget] = useState(null);
  const [datosBudgetInfo, setDatosBudgetInfo] = useState(null);
  const [datosBudgetPlan, setDatosBudgetPlan] = useState([]);
  const [listaIngresos, setListaIngresos] = useState(null);

  // --- Estados del Formulario ---
  const [datos, setDatos] = useState({
    tipoid: "",
    numid: "",
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    codigoIngreso: "", // Campo editable
  });

  const [datosError, setDatosError] = useState({}); // Nuevo estado para errores
  const [saludDeclaracion, setSaludDeclaracion] = useState(null); // SI/NO
  const [errorCarga, setErrorCarga] = useState(null); // Para errores de API
  const [cargandoGeneral, setCargandoGeneral] = useState(true);
  const [cargandoEnvio, setCargandoEnvio] = useState(false); // Para el botón Siguiente

  // --- Funciones de Validación ---
  const validarDatos = useCallback(() => {
    // Quitamos la definición de 'errores' si no se usa localmente.
    let esValido = true;

    if (!datos.codigoIngreso) {
      esValido = false;
    }

    if (saludDeclaracion === null || saludDeclaracion === "NO") {
      esValido = false;
    } // 🚨 QUITAMOS: setDatosError(errores);

    return esValido;
  }, [datos.codigoIngreso, saludDeclaracion]);

  // --- 1. Lógica de Carga Inicial (SearchBudget y GetListValues) ---
  useEffect(() => {
    if (!budgetId) {
      setErrorCarga("ID de Cotización no encontrado.");
      setCargandoGeneral(false);
      return;
    }

    setCargandoGeneral(true);
    setErrorCarga(null);

    async function fetchInitialData() {
      try {
        const [budgetResult, ingresosResult] = await Promise.all([
          SearchBudget({ budgets: budgetId }),
          GetListValues("INGRPROM"),
        ]);

        const budgetInfo = budgetResult.dataBudgetInfo || null;

        // Establecer los datos del presupuesto
        setDatosBudget(budgetResult.data?.[0] || null);
        setDatosBudgetInfo(budgetInfo);
        setDatosBudgetPlan(
          budgetResult.dataBudgetPlan?.plans ||
            budgetResult.dataBudgetPlan ||
            []
        );
        setListaIngresos(ingresosResult);

        // Inicializar datos del titular si existen en la info del budget
        if (budgetInfo) {
          setDatos((prev) => ({
            ...prev,
            tipoid: budgetInfo.p_tipoid || "",
            numid: budgetInfo.p_numid || "",
            fechaNacimiento: budgetInfo.p_fechanac || "",
          }));
        }
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        setErrorCarga("Error de conexión al cargar el presupuesto.");
      }
      // NOTA: No desactivamos cargandoGeneral aquí, lo hacemos en el siguiente useEffect
    }
    fetchInitialData();
  }, [budgetId]);

  // --- 2. Lógica de Búsqueda de Cliente (Depende de datosBudgetInfo) ---
  useEffect(() => {
    // 💡 Eliminamos useRef. La condición de dependencia es suficiente.

    if (
      !datosBudgetInfo ||
      !datosBudgetInfo.p_tipoid ||
      !datosBudgetInfo.p_numid
    ) {
      if (!budgetId) setCargandoGeneral(false);
      return;
    }

    // Ya tenemos los datos del titular (tipoid y numid)
    const { p_tipoid: tipoid, p_numid: numid } = datosBudgetInfo;

    // Solo buscamos si los datos del titular están disponibles para la búsqueda
    async function fetchdatostitular() {
      try {
        const cliente = await SearchClient({ tipoid, numid });
        if (cliente && cliente.length > 0) {
          const data = cliente[0];

          // Solo actualizamos nombre y apellido, los demás campos ya se establecieron en el efecto 1
          setDatos((prevDatos) => ({
            ...prevDatos,
            nombre: data.NOMTER || "",
            apellido: data.APETER || "",
            // Los campos tipoid, numid y fechaNacimiento ya vienen de datosBudgetInfo
          }));
        }
      } catch (error) {
        console.error("Error al cargar los datos del cliente:", error);
      } finally {
        // Desactivamos la carga general solo después de la última llamada asíncrona
        setCargandoGeneral(false);
      }
    }
    fetchdatostitular();
  }, [datosBudgetInfo, budgetId]); // Depende de la info del presupuesto

  // --- 3. Manejador de Cambios ---
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    // 💡 Lógica clara para radio button vs. input normal
    if (name === "saludDeclaracion") {
      setSaludDeclaracion(value);
      // Limpiamos el error al interactuar
      setDatosError((prev) => ({ ...prev, saludDeclaracion: "" }));
    } else {
      setDatos((prevDatos) => ({
        ...prevDatos,
        [name]: type === "checkbox" ? checked : value,
      }));
      // Limpiamos el error al interactuar
      setDatosError((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // --- 4. Manejador de Envío (Siguiente) ---
  const handleSubmit = async () => {
    if (!validarDatos()) {
      alert("Por favor, corrige los errores y responde todas las preguntas.");
      return;
    }

    setCargandoEnvio(true);

    // 🚨 Simulamos la llamada a la API para el siguiente paso (ej: Guardar datos de titular)
    // const result = await NextStepHook({ datos, saludDeclaracion, budgetId });

    // if (result && result.status === 'OK') {
    //   navigate(`/Beneficiarios/${budgetId}`, { state: { datosTitular: datos } });
    // } else {
    //   alert("Error al guardar los datos del titular. Intente de nuevo.");
    // }

    // --- SIMULACIÓN DE ÉXITO ---
    setTimeout(() => {
      setCargandoEnvio(false);
      navigate(`/Beneficiarios/${budgetId}`, {
        state: { datosTitular: datos, saludDeclaracion },
      });
    }, 1000);
    // ----------------------------
  };

  // --- Renderizado Anticipado de Errores y Carga ---
  if (cargandoGeneral) {
    return (
      <div className={Style.container}>
        <p className={Style.loadingText}>
          Cargando datos del presupuesto y titular...
        </p>
      </div>
    );
  }

  if (!budgetId || errorCarga) {
    return (
      <div className={Style.container}>
        <h2 className={Style.errorTitle}>Error de Cotización</h2>
        <p>
          {errorCarga || "No se pudo cargar la información del presupuesto."}
        </p>
      </div>
    );
  }

  // --- Renderizado Principal ---
  const quoteData = datosBudget || {}; // Usar un objeto vacío si es null
  const esBotonDeshabilitado = cargandoEnvio || !validarDatos(); // Validar antes de habilitar

  return (
    <div className={Style.container}>
      <div className={Style.introSection}>
        <h2 className={Style.headerTitle}>REGISTRO DE DATOS TITULAR</h2>
        <p className={Style.introText}>
          Para tu comodidad y seguridad, te invitamos a crear tu cuenta como
          titular de póliza funeraria.
        </p>
      </div>

      {/* 💡 Datos de la Cotización Dinámicos */}
      <div className={Style.quoteInfoContainer}>
        <div className={Style.quoteInfoItem}>
          <span>Número de Cotización:</span> {budgetId}
        </div>
        <div className={Style.quoteInfoItem}>
          <span>Fecha:</span> {quoteData.DATE_CREATION || "N/A"}
        </div>
        <div className={Style.quoteInfoItem}>
          <span>Válida hasta:</span> {quoteData.EXPIRED_ON || "N/A"}
        </div>
      </div>

      <div className={Style.sectionBlock}>
        <h2>Datos del Titular</h2>
        {/* Usamos los datos del estado 'datos' que contiene el nombre/apellido buscados */}
        <p>
          <strong>Tipo de Identificación:</strong>{" "}
          <span className={Style.datoFijo}>{datos.tipoid || "N/A"}</span>
        </p>
        <p>
          <strong>Número de Identificación:</strong>{" "}
          <span className={Style.datoFijo}>{datos.numid || "N/A"}</span>
        </p>
        <p>
          <strong>Nombre:</strong>{" "}
          <span className={Style.datoFijo}>{datos.nombre || "N/A"}</span>
        </p>
        <p>
          <strong>Apellido:</strong>{" "}
          <span className={Style.datoFijo}>{datos.apellido || "N/A"}</span>
        </p>
        <p>
          <strong>Fecha de Nacimiento:</strong>{" "}
          <span className={Style.datoFijo}>
            {datos.fechaNacimiento || "N/A"}
          </span>
        </p>
        <p>
          <strong>Planes Encontrados:</strong> {datosBudgetPlan.length}
        </p>
      </div>

      <div className={Style.sectionBlock}>
        <h2>LISTA DE INGRESO</h2>
        <select
          name="codigoIngreso"
          value={datos.codigoIngreso}
          onChange={handleChange}
          className={Style.selectInput}
          disabled={cargandoEnvio}
        >
          <option value="">-- Seleccione Ingreso --</option>
          {listaIngresos?.map((ingreso) => (
            <option key={ingreso.VALOR} value={ingreso.VALOR}>
              {ingreso.DESCRIPCION}
            </option>
          ))}
        </select>
        {datosError.codigoIngreso && (
          <span className={Style.errorSpan}>{datosError.codigoIngreso}</span>
        )}
      </div>

      <div className={Style.sectionBlock}>
        <h2>Ayúdanos con estas preguntas</h2>
        <p className={Style.healthQuestion}>
          Como titular de la póliza ¿ declaro gozar de buena salud física y
          mental, entendiendo que no padezco alguna enfermedad terminal y niego
          adicción a algun tipo de drogas o alcohol?
        </p>
        <div className={Style.radioGroup}>
          <input
            type="radio"
            name="saludDeclaracion"
            value="SI"
            checked={saludDeclaracion === "SI"}
            onChange={handleChange}
            id="salud-si"
            disabled={cargandoEnvio}
          />
          <label htmlFor="salud-si">Si</label>

          <input
            type="radio"
            name="saludDeclaracion"
            value="NO"
            checked={saludDeclaracion === "NO"}
            onChange={handleChange}
            id="salud-no"
            disabled={cargandoEnvio}
          />
          <label htmlFor="salud-no">No</label>
        </div>
        {datosError.saludDeclaracion && (
          <span className={Style.errorSpan}>{datosError.saludDeclaracion}</span>
        )}
        {saludDeclaracion === "NO" && (
          <p className={Style.alertMessage}>
            ⚠️ Debe declarar "Sí" para continuar con la cotización.
          </p>
        )}
      </div>

      <div className={Style.advisorBlock}>
        <h2>Asesor de seguros</h2>
        <p>14 - SEGUROS PIRAMIDE, C.A</p>{" "}
        {/* Esto debería ser dinámico si es posible */}
      </div>

      <div className={Style.buttonContainer}>
        <button
          className={Style.nextButton}
          onClick={handleSubmit}
          disabled={esBotonDeshabilitado}
        >
          {cargandoEnvio ? "Guardando Datos..." : "Siguiente"}
        </button>
      </div>
    </div>
  );
}
