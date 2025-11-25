import { Routes, Route } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import { Layout } from "./components/layout/layout";
import { Footer } from "./components/footer/footer";
const FormPrincipal = lazy(() =>
  import("./components/formprincipal/formprincipal")
);
const SeleccionaPlanes = lazy(() =>
  import("./components/seleccionaplanes/seleccionaplane")
);
const DatosTitular = lazy(() => import("./components/titular/datostitular"));

function App() {
  return (
    <>
      <Layout />
      <Suspense fallback={<div>Cargando...</div>}>
        <Routes>
          <Route path="/" element={<FormPrincipal />} />
          <Route path="/Planes/:budgetId" element={<SeleccionaPlanes />} />
          <Route path="/Titular/:budgetId" element={<DatosTitular />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

export default App;
