import { useState } from "react";
import Home from "./pages/Home";

function App() {

  const [properties, setProperties] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    type: "Apartment",
    image: "",
  });

  const handleAddProperty = () => {

    if (!formData.title || !formData.location) {
      alert("Please Fill All Fields");
      return;
    }

    const newProperty = {
      ...formData,
      id: Date.now(),
    };

    setProperties([...properties, newProperty]);

    setFormData({
      title: "",
      location: "",
      type: "Apartment",
      image: "",
    });

    setShowForm(false);

  };

  return (
    <Home
      properties={properties}
      showForm={showForm}
      setShowForm={setShowForm}
      formData={formData}
      setFormData={setFormData}
      handleAddProperty={handleAddProperty}
    />
  );
}

export default App;