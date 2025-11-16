import { useLocation } from "react-router-dom";
import SearchBudget from "../../hook/searchbudgets";
import { useState, useEffect } from "react";

export default function SeleccionaPlan() {
  // Obtener el objeto location de la ruta actual
  const location = useLocation();
  const [datosBudget, setDatosBudget] = useState(null);
  const [datosBudgetPlan, setDatosBudgetPlan] = useState([]);
  const [cargando, setCargando] = useState(true);

  const datosRecibidos = location.state?.data;

  if (!datosRecibidos) {
    return (
      <div>
        Error: No se encontraron datos del cliente. Por favor, vuelva al
        formulario.
      </div>
    );
  }
  const infoBudget = datosRecibidos.budgetInfo;
  const budgetId = infoBudget.p_budget_id;

  useEffect(() => {
    async function fetchBudgetData() {
      setCargando(true);
      const { data, dataBudgetPlan } = await SearchBudget({
        budgets: budgetId,
      });
      setDatosBudget(data && data.length > 0 ? data[0] : null);

      setDatosBudgetPlan(dataBudgetPlan?.plans || dataBudgetPlan || []);

      setCargando(false);
    }
    fetchBudgetData();
  }, [budgetId]);

  console.log(datosBudgetPlan);

  if (cargando) {
    return <div>Cargando planes y datos de cotización...</div>;
  }

  if (!datosBudget) {
    return <div>Error al cargar los datos de la cotización.</div>;
  }

  return (
    <div>
      <div>
        <h1>PLANES DISPONIBLES </h1>
        <p>
          Entendemos que tus necesidades y las de tu familia son particulares.
          Por eso, te brindamos opciones flexibles para que diseñes la
          tranquilidad a tu medida y asegures su futuro.
        </p>
      </div>

      <hr />
      <div>
        <h2>Datos de la Cotización</h2>
        <div key={datosBudget.BUDGET_ID}>
          <p>Número de Cotización: **{budgetId}**</p>
          <p>Fecha: **{datosBudget.DATE_CREATION}**</p>
          <p>Válida hasta: **{datosBudget.EXPIRED_ON}**</p>
        </div>
      </div>

      <hr />

      <div>
        <h2>Planes Encontrados</h2>
        {datosBudgetPlan.length > 0 ? (
          datosBudgetPlan.map((plan) => (
            <div key={plan.plan_id}>
              <p>Nombre del Plan: **{plan.descplanprod}**</p>
              <p>
                Suma Asegurada: **{plan.sumaaseg}{" "}
                {plan.fraccionamiento[0]?.codmoneda}**
              </p>
              <p>
                Prima Anual: **{plan.prima} {plan.fraccionamiento[0]?.codmoneda}
                **
              </p>
              <p>
                Fraccionamiento:
                {plan.fraccionamiento.map((frac, index) => (
                  <span key={index}>
                    **{frac.nomplan}** ({frac.prima} {frac.codmoneda})
                    {index < plan.fraccionamiento.length - 1 ? " | " : ""}
                  </span>
                ))}
              </p>
            </div>
          ))
        ) : (
          <p>No se encontraron planes disponibles para esta cotización.</p>
        )}
      </div>
    </div>
  );
}
