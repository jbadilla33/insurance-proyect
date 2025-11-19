import { useLocation } from "react-router-dom";
import SearchBudget from "../../hook/searchbudgets";
import { useState, useEffect } from "react";
import Style from "./planes.module.css";
import PlanSeleccionado from "../../hook/planseleccionado";
import { useNavigate } from "react-router-dom";

export default function SeleccionaPlan() {
  const navigate = useNavigate();
  const location = useLocation();

  const [datosBudget, setDatosBudget] = useState(null);
  const [datosBudgetPlan, setDatosBudgetPlan] = useState([]);
  const [cargando, setCargando] = useState(true);
  // Nuevo estado para manejar la selección del plan
  const [planSeleccionado, setPlanSeleccionado] = useState(null);

  const datosRecibidos = location.state?.data;

  console.log("datos recibios", datosRecibidos);

  // --- Lógica Inicial de Verificación ---
  if (!datosRecibidos) {
    return (
      <div className={Style.container}>
        <h1 style={{ color: "red" }}>Error de Datos</h1>
        <p>
          Error: No se encontraron datos del cliente. Por favor, vuelva al
          formulario.
        </p>
      </div>
    );
  }
  const infoBudget = datosRecibidos.budgetInfo;
  const budgetId = infoBudget.p_budget_id;

  // --- Función para manejar la selección del plan ---
  const handlePlanSelection = (planId) => {
    setPlanSeleccionado(planId);
    // Aquí podrías añadir lógica adicional, como guardar la selección
    // en un estado global o habilitar un botón de "Continuar"
    console.log(`Plan seleccionado: ${planId}`);
  };

  // --- Lógica de Carga de Datos ---
  useEffect(() => {
    async function fetchBudgetData() {
      setCargando(true);
      const { data, dataBudgetPlan } = await SearchBudget({
        budgets: budgetId,
      });
      setDatosBudget(data && data.length > 0 ? data[0] : null);

      // Aseguramos que dataBudgetPlan.plans sea el array de planes
      setDatosBudgetPlan(dataBudgetPlan?.plans || dataBudgetPlan || []);

      setCargando(false);
    }
    fetchBudgetData();
  }, [budgetId]);

  // --- Renderizado Condicional ---
  if (cargando) {
    return (
      <div className={Style.container}>
        <div>Cargando planes y datos de cotización...</div>
      </div>
    );
  }

  if (!datosBudget) {
    return (
      <div className={Style.container}>
        <div>Error al cargar los datos de la cotización.</div>
      </div>
    );
  }

  async function handleNextHolder() {
    console.log("Avanzando con el plan seleccionado:", planSeleccionado);
    const datos = {
      budgetId: budgetId,
      plan_id_buy: planSeleccionado,
    };

    const respPlanSeleccionado = await PlanSeleccionado({ datos });

    console.log("respPlanSeleccionado", respPlanSeleccionado);

    if (respPlanSeleccionado && respPlanSeleccionado.result === "OK") {
      const datosFinales = {
        budgetId: budgetId,
      };

      console.log("Datos finales para el siguiente paso:", datosFinales);

      navigate("/Titular", {
        state: {
          data: datosFinales,
        },
      });
    } else {
      // Manejar error de API si no devuelve OK
      alert("Error al generar el presupuesto. No se puede avanzar.");
      console.error("Fallo al generar budget:", budgets);
    }
  }

  // --- Renderizado Principal ---
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

      <hr />
      <div>
        <h2>Datos de la Cotización</h2>
        <div className={Style.quoteDetails} key={datosBudget.BUDGET_ID}>
          <p>
            <strong>Número de Cotización:</strong> {budgetId}
          </p>
          <p>
            <strong>Fecha:</strong> {datosBudget.DATE_CREATION}
          </p>
          <p>
            <strong>Válida hasta:</strong> {datosBudget.EXPIRED_ON}
          </p>
        </div>
      </div>

      <hr />

      {/* Sección de Planes Ofrecidos (Tarjetas) */}
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
                <p>
                  Suma Asegurada:{" "}
                  <strong>
                    {plan.sumaaseg} {plan.fraccionamiento[0]?.codmoneda}
                  </strong>
                </p>
                <p>
                  Prima Anual:{" "}
                  <strong>
                    {plan.prima} {plan.fraccionamiento[0]?.codmoneda}
                  </strong>
                </p>

                {/* Detalles de Coberturas */}
                <div className={Style.detailGroup}>
                  <p>Coberturas:</p>
                  {plan.coberturas.map((cobertura, index) => (
                    <span key={index}>
                      <strong>
                        <p>{cobertura.desccobert}</p>
                      </strong>{" "}
                      (Prima: {cobertura.prima === 0 ? "0" : cobertura.prima})
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
      {planSeleccionado && (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button
            style={{
              padding: "15px 30px",
              fontSize: "1.2em",
              backgroundColor: "#ff7f50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(255, 127, 80, 0.3)",
            }}
            onClick={handleNextHolder}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
