import { useEffect, useState } from "react";
import InfoCard from "./inforcard";
import styles from "./info.module.css";

async function searchDataClien(codigoCliente) {
  const API_URL =
    "https://asesores.segurospiramide.com/asg-api/dbo/customers/get_customer_code"; // Endpoint para obtener detalles

  try {
    const resp = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        p_code_customer: codigoCliente,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!resp.ok) {
      return null;
    }

    return await resp.json();
  } catch (error) {
    return null;
  }
}
export default function Info() {
  const [clientData, setClientData] = useState(null);
  const [clienDatos, setClienDatos] = useState(null);

  useEffect(() => {
    const storedClient = localStorage.getItem("clienteAutenticado");

    if (storedClient) {
      const authData = JSON.parse(storedClient);
      setClientData(authData);

      const codigoCliente = authData.p_client_code;

      if (codigoCliente) {
        searchDataClien(codigoCliente).then((data) => {
          if (data) {
            setClienDatos(data);
          }
        });
      }
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("clienteAutenticado");
    window.location.reload();
  };

  return (
    <div className={styles.contenedorPrincipal}>
      <h2>🎉 Bienvenido</h2>
      <p>Último Acceso: **{new Date().toLocaleTimeString()}**</p>
      <button onClick={handleLogout}>Cerrar Sesión</button>

      {clienDatos ? <InfoCard client={clienDatos} /> : null}
    </div>
  );
}
