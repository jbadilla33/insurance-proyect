import { useLocation } from "react-router-dom";
import SearchBudget from "../../hook/searchbudgets";
import { useEffect, useState, useRef } from "react";
import SearchClient from "../../hook/searchclient";

export default function DatosTitular() {
  const location = useLocation();
  const budgetId = location.state?.data?.budgetId;
  const effectRan = useRef(false);

  // Estados de datos (Ajustado datosBudgetInfo a null/objeto)
  const [datosBudget, setDatosBudget] = useState(null);
  const [datosBudgetPlan, setDatosBudgetPlan] = useState([]);
  const [datosBudgetInfo, setDatosBudgetInfo] = useState(null); // INICIALIZADO COMO NULL

  // Datos del Cliente
  const [datos, setDatos] = useState({
    tipoid: "",
    numid: "",
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
  });

  // Estado de Carga UNIFICADO (Controla la carga de la API 1 y API 2)
  const [cargandoGeneral, setCargandoGeneral] = useState(true);

  // --- EFECTO 1: CARGA INICIAL (Budget) ---
  useEffect(() => {
    if (!budgetId) {
      setCargandoGeneral(false);
      return;
    }

    setCargandoGeneral(true); // Se inicia la carga de la API 1

    async function fetchBudgetData() {
      try {
        const result = await SearchBudget({ budgets: budgetId });

        setDatosBudget(result.data?.[0] || null);
        // dataBudgetInfo es objeto, si no viene, usamos null
        setDatosBudgetInfo(result.dataBudgetInfo || null);
        setDatosBudgetPlan(
          result.dataBudgetPlan?.plans || result.dataBudgetPlan || []
        );

        // Ya no es necesario el console.log aquí
      } catch (error) {
        console.error("Error al cargar los datos del presupuesto:", error);
      } finally {
        // NO ponemos setCargandoGeneral(false) aquí, porque la carga continúa con la API 2.
      }
    }
    fetchBudgetData();
  }, [budgetId]);

  // --- EFECTO 2: CARGA DEPENDIENTE (Cliente) ---
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && effectRan.current === false) {
      effectRan.current = true;
      return;
    }
    // 1. Condición de Guardia
    // El efecto solo se dispara cuando datosBudgetInfo es un OBJETO con propiedades.
    if (!datosBudgetInfo || Object.keys(datosBudgetInfo).length === 0) {
      // Si el primer fetch terminó (cargandoGeneral es false) y NO hay datos para el cliente,
      // terminamos la carga general. Si es NULL, esperamos al final del primer effect.
      if (!budgetId) {
        setCargandoGeneral(false);
      }
      return;
    }

    // 2. Asignación de Parámetros
    const tipoid = datosBudgetInfo.p_tipoid;
    const numid = datosBudgetInfo.p_numid;

    async function fetchdatostitular() {
      // 3. Control de Carga de la API 2 (Inicia)
      setCargandoGeneral(true);

      try {
        const cliente = await SearchClient({ tipoid, numid });

        console.log("Cliente encontrado:", cliente);
        if (cliente && cliente.length > 0) {
          const data = cliente[0];
          setDatos((prevDatos) => ({
            ...prevDatos,
            // Asigna los valores del cliente
            tipoid: tipoid,
            numid: numid,
            nombre: data.NOMTER || "",
            apellido: data.APETER || "",
            fechaNacimiento: datosBudgetInfo.p_fechanac || "", // Deberías tomar la fecha de donde venga
          }));
        }
      } catch (error) {
        console.error("Error al cargar los datos del cliente:", error);
      } finally {
        // 4. Control de Carga de la API 2 (Finaliza)
        setCargandoGeneral(false);
      }
    }
    fetchdatostitular();
  }, [datosBudgetInfo]); // Se dispara cuando datosBudgetInfo (objeto) cambia

  // --- RENDERIZADO ---
  return (
    <div>
      {/* Usamos cargandoGeneral para controlar ambas etapas */}
      {cargandoGeneral && <p>Cargando datos del presupuesto y titular...</p>}

      {!cargandoGeneral && (
        <div>
          <h2>Datos del Titular</h2>

          {/* Mostramos los datos de las dos APIs */}
          <p>Tipo de Identificación: {datosBudgetInfo?.p_tipoid || "N/A"}</p>
          <p>Número de Identificación: {datosBudgetInfo?.p_numid || "N/A"}</p>
          <p>Nombre: {datos.nombre}</p>
          <p>Apellido: {datos.apellido}</p>
          <p>Fecha de Nacimiento: {datosBudgetInfo?.p_fechanac || "N/A"}</p>

          {/* Muestra datos del plan para verificar */}
          <p>Planes Encontrados: {datosBudgetPlan.length}</p>
        </div>
      )}
    </div>
  );
}
