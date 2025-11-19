// hook/generate_budget.js (Corregido para p_json_info)

export default async function PlanSeleccionado({ datos }) {
  console.log(
    "Datos recibidos en PlanSeleccionado:",
    datos.budgetId,
    datos.plan_id_buy
  );
  const innerData = {
    p_budget_id: datos.budgetId,
    p_currency_payment: datos.currency_payment, // Formato DD/MM/YYYY
    p_plan_id_buy: datos.plan_id_buy,
    p_plan_id_pay: datos.plan_id_pay,
  };

  console.log("Payload enviado a PlanSeleccionado:", innerData);

  try {
    const resp = await fetch(
      "https://asesoresoc.oceanicadeseguros.com/asg-api/dbo/budgets/budget_buy",
      {
        method: "POST",
        body: JSON.stringify(innerData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // ... (rest of the API call logic) ...
    const datosRespuesta = await resp.json();

    return datosRespuesta;
  } catch (error) {
    console.log("Error ejecutando el api:", error);
  }
}
