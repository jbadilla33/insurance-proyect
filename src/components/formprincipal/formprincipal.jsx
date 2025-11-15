import { useState } from "react";
import Styles from "./formprincipal.module.css";
// Nota: Necesitarás implementar los iconos (✓ y el lápiz) usando SVG o librerías de iconos.

// --- Componentes Individuales (Simulados para el ejemplo) ---

const Paso1 = ({ data, handleChange }) => (
  // Estructura del formulario de Cédula de Identidad (como en la imagen image_fbbcc9.png)
  <div className={Styles.formCardWrapper}>
    <div className={Styles.inputGroup}>
      {/* Solo un input de ejemplo para el Paso 1 */}
      <input
        type="text"
        name="tipoIdentificacion"
        placeholder="Tipo de identificación *"
        value={data.tipoIdentificacion || ""}
        onChange={handleChange}
        className={Styles.inputField}
      />
      {/* Icono de verificación (si ya se validó) */}
      {data.tipoIdentificacion && <span className={Styles.checkIcon}>✓</span>}
    </div>
    {/* ... más inputs del Paso 1 ... */}
  </div>
);

const Paso2 = ({ data, handleChange }) => (
  // Estructura del formulario de Datos de Contacto (como en la imagen image_fbbced.png)
  <div className={Styles.formCardWrapper}>
    <div className={Styles.inputGroup}>
      <input
        type="email"
        name="correoContacto"
        placeholder="Correo (opcional)"
        value={data.correoContacto || ""}
        onChange={handleChange}
        className={Styles.inputField}
      />
    </div>
    {/* ... más inputs del Paso 2 ... */}
  </div>
);

// --- Componente de Revisión Final (image_fbbd28.png) ---
const Revision = ({ data, handleEditStep }) => (
  <div className={Styles.reviewContainer}>
    <h2 className={Styles.reviewTitle}>¡Casi listo! Revisa tu información</h2>
    <p className={Styles.reviewSubtitle}>
      Para editar cualquiera de los pasos, haga clic en el icono del lápiz.
    </p>

    <div className={Styles.reviewStepItem}>
      <span className={Styles.reviewStepIcon}>📖</span>{" "}
      {/* Icono de libro/documento */}
      <span className={Styles.reviewStepLabel}>Cédula de Identidad - RIF.</span>
      <button className={Styles.editButton} onClick={() => handleEditStep(1)}>
        ✏️ {/* Icono de lápiz */}
      </button>
    </div>

    <div className={Styles.reviewStepItem}>
      <span className={Styles.reviewStepIcon}>📱</span>{" "}
      {/* Icono de contacto */}
      <span className={Styles.reviewStepLabel}>
        Datos de Contacto (Opcional).
      </span>
      <button className={Styles.editButton} onClick={() => handleEditStep(2)}>
        ✏️
      </button>
    </div>
  </div>
);

// --- Componente Principal (MultiStepForm) ---

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [completedSteps, setCompletedSteps] = useState([]);

  // Lógica genérica para actualizar los datos en cualquier paso
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Lógica para avanzar de paso
  const handleNext = () => {
    // Validación básica antes de avanzar
    if (currentStep === 1 && !formData.tipoIdentificacion) {
      alert("Por favor, completa la identificación.");
      return;
    }

    setCompletedSteps((prev) => [...new Set([...prev, currentStep])]); // Marca el paso como completo
    setCurrentStep((prev) => prev + 1); // Avanza al siguiente paso
  };

  // Lógica para retroceder o editar desde la revisión
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleEditStep = (step) => {
    setCurrentStep(step);
  };

  // Renderizado condicional del contenido de cada paso
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Paso1 data={formData} handleChange={handleChange} />;
      case 2:
        return <Paso2 data={formData} handleChange={handleChange} />;
      case 3:
        return <Revision data={formData} handleEditStep={handleEditStep} />;
      default:
        return <div>Paso finalizado o error.</div>;
    }
  };

  // Nombres y estado de los pasos para la línea de tiempo
  const steps = [
    { id: 1, title: "Cédula de Identidad - RIF." },
    { id: 2, title: "Datos de Contacto (Opcional)." },
  ];

  return (
    <main className={Styles.main}>
      {/* Header y Botón Volver (Estáticos) */}
      <section className={Styles.headerStatic}>
        <img
          src="/imgformprincipal.png"
          alt="Icono de Formulario Digital"
          className={Styles.icon}
        />
        <div className={Styles.titleGroup}>
          <h1>Formulario Digital</h1>
          <p>
            Registra tus datos manualmente con precisión y avanza en tu proceso
            sin demoras.
          </p>
        </div>
      </section>
      <div className={Styles.backButtonContainer}>
        <button className={Styles.backButton} onClick={handleBack}>
          ← Volver
        </button>
      </div>

      {/* LÍNEA DE TIEMPO Y CONTENIDO */}
      <div className={Styles.timelineContainer}>
        {steps.map((step) => (
          <div key={step.id} className={Styles.timelineItem}>
            {/* Indicador de Paso (Círculo) */}
            <span
              className={`${Styles.stepIndicator} 
                            ${
                              completedSteps.includes(step.id)
                                ? Styles.completed
                                : ""
                            }
                            ${currentStep === step.id ? Styles.active : ""}
                            ${
                              currentStep > step.id &&
                              !completedSteps.includes(step.id)
                                ? Styles.inactive
                                : ""
                            }
                            `}
            >
              {completedSteps.includes(step.id) ? "✓" : step.id}
            </span>

            {/* Título del Paso */}
            <p
              className={`${Styles.stepTitle} 
                            ${currentStep === step.id ? Styles.titleActive : ""}
                            ${
                              completedSteps.includes(step.id)
                                ? Styles.titleCompleted
                                : ""
                            }
                            `}
            >
              {step.title}
            </p>
          </div>
        ))}

        {/* Línea vertical de conexión */}
        <div
          className={Styles.timelineConnector}
          style={{ height: `${(steps.length - 1) * 65}px` }}
        ></div>

        {/* Renderizado del contenido del paso activo */}
        <div className={Styles.contentArea}>{renderStepContent()}</div>
      </div>

      {/* Botones de navegación (solo si no es el último paso) */}
      {currentStep < 3 && (
        <div className={Styles.navigationButtons}>
          {currentStep > 1 && (
            <button
              type="button"
              className={Styles.prevButton}
              onClick={handleBack}
            >
              Ver paso anterior
            </button>
          )}
          <button
            type="button"
            className={Styles.nextButton}
            onClick={handleNext}
          >
            {currentStep === 2 ? "Revisar" : "Siguiente"}
          </button>
        </div>
      )}

      {/* Botón de Siguiente/Finalizar en la pantalla de revisión */}
      {currentStep === 3 && (
        <div className={Styles.navigationButtons}>
          <button
            type="button"
            className={Styles.finalButton}
            onClick={() => console.log("Finalizando registro", formData)}
          >
            Finalizar
          </button>
        </div>
      )}
    </main>
  );
}

/*import Styles from "./formprincipal.module.css";

export default function FormularioPrincipal() {
  return (
    <main className={Styles.main}>
      <section className={Styles.sectionTittle}>
        <img src="/imgformprincipal.png" alt="" />
        <div className={Styles.divTittle}>
          <h1>Formulario Digital</h1>
          <p>
            Registra tus datos manualmente con precisión y avanza en tu proceso
            sin demoras.
          </p>
        </div>
      </section>
      <div className={Styles.divButton}>
        <button type="button" className={Styles.buttonVolver}>
          Volver
        </button>
      </div>
      <section className={Styles.sectionForm}>
        <h2>Cédula de Identidad - RIF.</h2>
        <div className={Styles.divForm}>
          <form action="">
            <input type="text" placeholder="Tipo de Identificacion" />
            <input type="text" placeholder="No. de Identificacion" />
            <input type="text" placeholder="Nombres" />
            <input type="text" placeholder="Apellidos" />
            <input type="text" placeholder="Fecha de Nacimiento" />
            <button type="button">Siguiente</button>
          </form>
        </div>
      </section>
    </main>
  );
}
*/
