import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react"; // Importamos useMemo
import SearchBudget from "../../hook/searchbudgets";
import PlanSeleccionado from "../../hook/planseleccionado";
import Style from "./planes.module.css"; // Se asume que este CSS existe y se ajustará

export default function SeleccionaPlan() {
  const navigate = useNavigate();
  // 💡 Optimización: Desestructuración directa y clara del budgetId
  const { budgetId } = useParams();

  // --- Estados ---
  const [datosBudget, setDatosBudget] = useState(null);
  const [datosBudgetPlan, setDatosBudgetPlan] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null); // Nuevo estado para errores
  const [planSeleccionado, setPlanSeleccionado] = useState(null);

  // 💡 Nota: Los datos de location.state no se usan para la lógica principal,
  // pero los mantenemos para referencia o futura implementación si es necesario.
  const location = useLocation();
  const datosRecibidos = location.state;

  // --- Lógica de Carga de Datos (useEffect) ---
  useEffect(() => {
    if (!budgetId) {
      setErrorCarga("No se encontró el ID de la cotización en la URL.");
      setCargando(false);
      return;
    }

    async function fetchBudgetData() {
      setCargando(true);
      setErrorCarga(null);

      try {
        // 💡 Optimización: Desestructuramos el resultado de SearchBudget
        const result = await SearchBudget({ budgets: budgetId });

        const dataInfo =
          result.data && result.data.length > 0 ? result.data[0] : null;
        const dataPlanes =
          result.dataBudgetPlan?.plans || result.dataBudgetPlan || [];

        if (!dataInfo) {
          setErrorCarga(
            `No se encontraron datos para la cotización ID: ${budgetId}`
          );
        } else {
          setDatosBudget(dataInfo);
          setDatosBudgetPlan(dataPlanes);
        }
      } catch (error) {
        console.error("Error al cargar el presupuesto:", error);
        setErrorCarga("Error de conexión al cargar los planes.");
      } finally {
        setCargando(false);
      }
    }
    fetchBudgetData();
  }, [budgetId]);

  // --- Funciones de Manejo de Eventos ---

  const handlePlanSelection = (planId) => {
    setPlanSeleccionado(planId);
    console.log(`Plan seleccionado: ${planId}`);
  };

  async function handleNextHolder() {
    if (!planSeleccionado) {
      alert("Por favor, seleccione un plan antes de continuar.");
      return;
    }

    // 🚨 Mostramos el estado de carga antes de la llamada a la API
    setCargando(true);

    const datos = {
      budgetId: budgetId,
      plan_id_buy: planSeleccionado,
    };

    try {
      const respPlanSeleccionado = await PlanSeleccionado({ datos });

      if (respPlanSeleccionado && respPlanSeleccionado.result === "OK") {
        const datosFinales = { budgetId: budgetId };

        // Navegación a la ruta dinámica /Titular/:budgetId
        navigate(`/Titular/${budgetId}`, {
          state: { data: datosFinales },
        });
      } else {
        alert("Error al seleccionar el plan. No se puede avanzar.");
        console.error("Fallo al seleccionar plan:", respPlanSeleccionado);
      }
    } catch (error) {
      alert("Ocurrió un error en el proceso de selección del plan.");
      console.error("Error en handleNextHolder:", error);
    } finally {
      // 🚨 Detenemos el estado de carga
      setCargando(false);
    }
  }

  // --- Lógica de Renderizado Anticipado (Early Returns) ---

  // 1. Error de URL (budgetId no existe)
  if (!budgetId) {
    return (
      <div className={Style.container}>
        <h1 className={Style.errorTitle}>Error de Datos</h1>
        <p>
          Error: No se encontró el ID de la cotización en la URL. Por favor,
          vuelva al formulario principal.
        </p>
      </div>
    );
  }

  // 2. Estado de Carga
  if (cargando) {
    return (
      <div className={Style.container}>
        <div className={Style.loadingText}>
          Cargando planes y datos de cotización...
        </div>
      </div>
    );
  }

  // 3. Error de Carga de API
  if (errorCarga) {
    return (
      <div className={Style.container}>
        <h1 className={Style.errorTitle}>Error de Cotización</h1>
        <p>{errorCarga}</p>
      </div>
    );
  }

  // --- RENDERIZADO PRINCIPAL (Cuando todo está cargado) ---
  return (
    <div className={Style.container}>
      <div>
        <h1>PLANES DISPONIBLES</h1>
        <p>
          Entendemos que tus necesidades y las de tu familia son particulares.
          Por eso, te brindamos opciones flexibles para que diseñes la
          tranquilidad a tu medida y asegures su futuro.
        </p>
      </div>

      <hr className={Style.separator} />

      {/* --- DATOS DE LA COTIZACIÓN --- */}
      <div>
        <h2>Datos de la Cotización</h2>
        <div className={Style.quoteInfoContainer}>
          <p>
            <strong>Número de Cotización:</strong> {budgetId}
          </p>
          <p>
            <strong>Fecha:</strong> {datosBudget.DATE_CREATION || "N/A"}
          </p>
          <p>
            <strong>Válida hasta:</strong> {datosBudget.EXPIRED_ON || "N/A"}
          </p>
        </div>
      </div>

      <hr className={Style.separator} />

      {/* --- GRID DE PLANES --- */}
      <div>
        <h2>Planes que te ofrecemos</h2>
        {datosBudgetPlan.length > 0 ? (
          <div className={Style.plansGrid}>
            {datosBudgetPlan.map((plan) => (
              <div
                key={plan.plan_id}
                className={`${Style.planCard} ${
                  planSeleccionado === plan.plan_id ? Style.selected : ""
                }`}
                onClick={() => handlePlanSelection(plan.plan_id)}
              >
                <h3>{plan.descplanprod}</h3>

                {/* 💡 MEJOR FORMATO DE MONEDA/PRIMA */}
                {/* Usamos el operador ?. (optional chaining) para evitar errores si 'fraccionamiento' es null */}
                <p>
                  Suma Asegurada:{" "}
                  <strong>
                    {plan.sumaaseg}{" "}
                    {plan.fraccionamiento?.[0]?.codmoneda || "DL"}
                  </strong>
                </p>
                <p>
                  Prima Anual:{" "}
                  <strong>
                    {plan.prima} {plan.fraccionamiento?.[0]?.codmoneda || "DL"}
                  </strong>
                </p>

                <div className={Style.detailGroup}>
                  <p>Coberturas:</p>
                  {plan.coberturas.map((cobertura, index) => (
                    // 💡 Optimización: Usar la clave 'plan_id' del plan y el 'index' para una key más segura
                    <span key={`${plan.plan_id}-${index}`}>
                      <p>
                        <strong>{cobertura.desccobert}</strong>
                        {/* Mostramos la prima de cobertura de forma clara */}
                        <span>
                          {" "}
                          (Prima:{" "}
                          {cobertura.prima === 0 ? "0" : cobertura.prima})
                        </span>
                      </p>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No se encontraron planes disponibles para esta cotización.</p>
        )}
      </div>

      {/* --- BOTÓN DE AVANCE --- */}
      <div className={Style.buttonContainer}>
        <button
          className={Style.nextButton} // 💡 Clase CSS para estilos más limpios
          onClick={handleNextHolder}
          disabled={cargando || !planSeleccionado} // Deshabilitamos si carga o no hay plan
        >
          {cargando ? "Procesando..." : "Siguiente"}
        </button>
      </div>
    </div>
  );
}
