export default function InformationClient({ client }) {
  console.log(client);

  return (
    <div>
      <h2>Bienvenido, {client.primernombre}</h2>
      <p>ID de Cliente: {client.numid}</p>
      <p>Correo: {client.correo}</p>
      <button onClick={() => window.location.reload()}>Cerrar Sesión</button>
    </div>
  );
}
