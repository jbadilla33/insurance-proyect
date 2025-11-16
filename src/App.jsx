import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login/login";
import Dashboard from "./components/dashboard/info";
import Registro from "./components/registrar/registro";
import { Layout } from "./components/layout/layout";
import { Footer } from "./components/footer/footer";
import FormPrincipal from "./components/formprincipal/formprincipal";
import SeleccionaPlanes from "./components/seleccionaplanes/seleccionaplane";

function App() {
  return (
    <BrowserRouter>
      <Layout />
      <Routes>
        <Route path="/" element={<FormPrincipal />} />
        <Route path="/Planes" element={<SeleccionaPlanes />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
