export default async function GetListValues(list_code) {
  try {
    const resp = await fetch(
      "https://asesores.segurospiramide.com/asg-api/dbo/toolkit/get_values_list",
      {
        method: "POST",
        body: JSON.stringify({
          p_list_code: list_code,
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
