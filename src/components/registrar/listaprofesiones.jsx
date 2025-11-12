export default async function SearchPaises() {
  const API_URL =
    "https://asesores.segurospiramide.com/asg-api/dbo/toolkit/get_list_values_profession"; // Endpoint para obtener detalles

  try {
    const resp = await fetch(API_URL, {
      method: "POST",

      body: JSON.stringify({
        p_list_code: "CODACT",
      }),

      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!resp.ok) {
      return null;
    }

    const data = await resp.json();

    // 💡 CLAVE: Devolver el arreglo anidado 'p_cursor' o un array vacío si no existe
    return data.p_cursor || [];
  } catch (error) {
    return null;
  }
}
