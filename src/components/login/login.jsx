import { useState } from "react";
import SearchClient from "./search-client";
import { useNavigate, Link } from "react-router-dom";
import styles from "./login.module.css";

export default function Login() {
  const [user, setUser] = useState("sguzman");
  const [password, setPassword] = useState("Aranza103.");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!user || !password) {
      setError("Faltan datos de inicio de sesión");
      return;
    }

    const cliente = await SearchClient({
      username: user,
      password: password,
    });

    if (cliente) {
      const dataUser = cliente?.user;

      const clienteAutenticado = {
        p_client_code: dataUser.p_client_code,
        P_PORTAL_USER_ID: dataUser.P_PORTAL_USER_ID,
      };
      localStorage.setItem(
        "clienteAutenticado",
        JSON.stringify(clienteAutenticado)
      );
      navigate("/Dashboard");
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };
  return (
    <div className={styles.contenedorPrincipal}>
      <h1 className={styles.titulo}>Acceda a su panel de control</h1>
      <h3 className={styles.titulo2}>Plataforma para corredores de seguros</h3>
      <div className={styles.contenedorForm}>
        <form onSubmit={handleLogin}>
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
          <Link className={styles["link-sin-raya"]} to="/Registro">
            Registrarse
          </Link>
          <button type="submit">Iniciar sesión</button>
        </form>
      </div>
      {error && <p>{error}</p>}
    </div>
  );
}
