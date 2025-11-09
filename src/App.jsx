import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login/login";
import Dashboard from "./components/dashboard/info";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
/*import { useState } from "react";
import Login from "./components/login/login";
import Dashboard from "./components/dashboard/info";
function App() {
  return (
    <>
      <Login />
      <Dashboard />
    </>
  );
}

export default App;
*/
