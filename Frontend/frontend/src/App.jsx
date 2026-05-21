import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import AddProperty from "./pages/AddProperty";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-property" element={<AddProperty />} />
      </Routes>
    </Router>
  );
}

export default App;