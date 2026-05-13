export const handleInputChange = (
  e,
  field,
  formData,
  setFormData
) => {
  setFormData({
    ...formData,
    [field]: e.target.value,
  });
};

export const handleAddProperty = (
  formData,
  properties,
  setProperties,
  setFormData,
  setShowForm
) => {
  if (!formData.title || !formData.location) {
    alert("Please fill all fields");
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
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  });

  setShowForm(false);
};