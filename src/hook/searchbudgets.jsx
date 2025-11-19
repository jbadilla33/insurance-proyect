export default async function SearchBudget({ budgets }) {
  try {
    const resp = await fetch(
      "https://asesoresoc.oceanicadeseguros.com/asg-api/dbo/budgets/get_budget_by_id",
      {
        method: "POST",
        body: JSON.stringify({
          p_budget_id: budgets,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const datos = await resp.json();

    const data = datos.p_cur_budget;
    const dataBudgetPlan = datos.p_budget_plans;

    return { data, dataBudgetPlan };
  } catch (error) {
    console.log("Error ejecutando el api");
  }
}
