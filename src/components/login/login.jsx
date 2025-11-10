import { useState } from "react";
import SearchClient from "./search-client";
import InformationClient from "./information-client";
import { useNavigate } from "react-router-dom";
import styles from "./login.module.css";

export default function Login() {
  const [user, setUser] = useState("sandraguzman");
  const [password, setPassword] = useState("Aranza103.");
  const [client, setClient] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Lógica de autenticación aquí
    if (!user || !password) {
      alert("Faltan datos de inicio de sesión");
      return;
    }

    const cliente = await SearchClient({
      username: user,
      password: password,
    });

    if (cliente) {
      const dataUser = cliente.user;

      const clienteAutenticado = {
        p_client_code: "00000029584359",
        P_PORTAL_USER_ID: dataUser.P_PORTAL_USER_ID,
        // Agrega aquí los demás campos que necesites
      };
      localStorage.setItem(
        "clienteAutenticado",
        JSON.stringify(clienteAutenticado)
      );
      navigate("/Dashboard");
    } else {
      setClient("");
    }
  };

  return (
    <div className={styles.contenedorPrincipal}>
      <h1 className={styles.titulo}>Bienvenido de Nuevo</h1>
      <h3 className={styles.titulo2}>
        Inicia sesión para gestionar tu portafolio
      </h3>
      <div className={styles.contenedorForm}>
        <form action="">
          <input
            type="text"
            placeholder="Usuario"
            value={user}
            required
            onChange={(e) => setUser(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" onClick={handleLogin}>
            Iniciar sesión
          </button>
        </form>
      </div>
      {client === "" && <p>Usuario o contraseña incorrectos</p>}
    </div>
  );
}
