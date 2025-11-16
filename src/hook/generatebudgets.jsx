// hook/generate_budget.js (Corregido para p_json_info)

export default async function generate_budget({ datos }) {
  // 1. Crear el objeto de DATOS INTERNO (la cadena JSON que va dentro de p_json_info)
  const innerData = {
    p_tipoid: datos.tipoid,
    dateOfBirth: datos.fechaNacimiento, // Formato DD/MM/YYYY
    p_numid: datos.numid,
    p_identification_name: datos.nombre,
    p_identification_lastname: datos.apellido,

    // Asumimos que la edad viene en 'datos.edad'
    p_ages_titu: datos.edad,
    p_all_ages: datos.edad,

    // Campos estáticos/vacíos
    p_applicant_name: "",
    p_applicant_phone_number: "",
    p_applicant_email: "",
    p_partner_code: "14",
    p_codprod: "PHOG",
    p_alianza: "V141289450",
    p_tipo_canal: "A",
  };

  // 2. Serializar los datos internos a una CADENA JSON
  const jsonInfoString = JSON.stringify(innerData);

  // 3. Crear el PAYLOAD EXTERNO con la clave p_json_info
  const outerPayload = {
    p_json_info: jsonInfoString, // Esto es la CADENA JSON generada en el paso 2
  };

  console.log("Payload enviado a generate_budget:", outerPayload);

  try {
    const resp = await fetch(
      "https://asesores.segurospiramide.com/asg-api/dbo/budgets/generate_budget",
      {
        method: "POST",
        // 4. Serializar el payload EXTERNO para la solicitud HTTP
        body: JSON.stringify(outerPayload),
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
