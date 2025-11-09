export default function InfoCard({ client }) {
  const [datos] = client.p_cursor;

  console.log(datos);

  const { NOMTER1: nombre, APETER1: apellido } = datos;

  return (
    <div>
      bienvenido
      <h2>
        {nombre} {apellido}
      </h2>
    </div>
  );
}
