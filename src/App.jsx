import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/layout";
import { Footer } from "./components/footer/footer";
import FormPrincipal from "./components/formprincipal/formprincipal";
import SeleccionaPlanes from "./components/seleccionaplanes/seleccionaplane";
import DatosTitular from "./components/titular/datostitular";

function App() {
  return (
    <BrowserRouter>
      <Layout />
      <Routes>
        <Route path="/" element={<FormPrincipal />} />
        <Route path="/Planes" element={<SeleccionaPlanes />} />
        <Route path="/Titular" element={<DatosTitular />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
