import { useLocation } from "react-router-dom";
import SearchBudget from "../../hook/searchbudgets";
import { useEffect, useState } from "react";

export default function DatosTitular() {
  const location = useLocation();
  const datosRecibidos = location.state?.data;
  const budgetId = datosRecibidos?.budgetId;
  const [datosBudget, setDatosBudget] = useState(null);
  const [datosBudgetPlan, setDatosBudgetPlan] = useState([]);
  const [cargando, setCargando] = useState(true);

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

  console.log(datosBudget);

  return (
    <div>
      {cargando && <p>Cargando datos...</p>}
      {!cargando && (
        <div>
          <h2>Datos del Titular</h2>
          <p>
            <strong>Nombre:</strong>
          </p>
          <p>
            <strong>Fecha de Nacimiento:</strong>
          </p>
        </div>
      )}
    </div>
  );
}
