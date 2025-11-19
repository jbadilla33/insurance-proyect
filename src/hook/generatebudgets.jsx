// hook/generate_budget.js (Corregido para p_json_info)

export default async function GenerateBudget({ datos }) {
  // 1. Crear el objeto de DATOS INTERNO (la cadena JSON que va dentro de p_json_info)

  const fechaActual = new Date();
  const añoActual = fechaActual.getFullYear();
  const fechaNacimiento = new Date(datos.fechaNacimiento);
  const edad = añoActual - fechaNacimiento.getFullYear();

  console.log(edad);

  const innerData = {
    p_tipoid: datos.tipoid,
    dateOfBirth: datos.fechaNacimiento, // Formato DD/MM/YYYY
    p_numid: datos.numid,
    p_identification_name: datos.nombre,
    p_identification_lastname: datos.apellido,

    // Asumimos que la edad viene en 'datos.edad'
    p_ages_titu: edad.toString(),
    p_all_ages: edad.toString(),

    // Campos estáticos/vacíos
    p_applicant_name: "",
    p_applicant_phone_number: "",
    p_applicant_email: "",
    p_partner_code: "4452",
    p_codprod: "FUNE",
    p_alianza: "J306206329",
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
      "https://asesoresoc.oceanicadeseguros.com/asg-api/dbo/budgets/generate_budget",
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
