import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login/login";
import Dashboard from "./components/dashboard/info";
import Registro from "./components/registrar/registro";
import { Layout } from "./components/layout/layout";
import { Footer } from "./components/footer/footer";
import FormPrincipal from "./components/formprincipal/formprincipal";

function App() {
  return (
    <BrowserRouter>
      <Layout />
      <Routes>
        <Route path="/" element={<FormPrincipal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Registro" element={<Registro />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
