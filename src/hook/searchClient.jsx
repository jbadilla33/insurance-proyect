export default async function SearchClient({ tipoid, numid }) {
  try {
    const resp = await fetch(
      "https://asesores.segurospiramide.com/asg-api/dbo/budgets/get_customer",
      {
        method: "POST",
        body: JSON.stringify({
          p_identification_number: numid,
          p_identification_type: tipoid,
          p_identification_verified: 0,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const datos = await resp.json();

    const data = datos.p_cursor;

    return data;
  } catch (error) {
    console.log("Error ejecutando el api");
  }
}
