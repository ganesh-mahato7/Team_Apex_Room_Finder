// scripts/AddProperty.js
// All JavaScript logic for AddProperty.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Static Data ──
export const propertyTypes = [
  { value: "room",      label: "Room"      },
  { value: "apartment", label: "Apartment" },
  { value: "flat",      label: "Flat"      },
];

export const facilityOptions = [
  { value: "wifi",    label: "WiFi"    },
  { value: "parking", label: "Parking" },
  { value: "water",   label: "Water"   },
  { value: "kitchen", label: "Kitchen" },
];

export const initialFormState = {
  type:        "",
  facilities:  [],
  location:    "",
  title:       "",
  description: "",
  mobile:      "",
  rent:        "",
  email:       "",
};

// ── Validation ──
export function validateForm(form, images) {
  const errors = {};
  if (!form.type)               errors.type        = "Please select a property type.";
  if (!form.location.trim())    errors.location    = "Location is required.";
  if (!form.title.trim())       errors.title       = "Title is required.";
  if (!form.description.trim()) errors.description = "Description is required.";
  if (!form.mobile.trim())      errors.mobile      = "Mobile number is required.";
  else if (!/^\d{10}$/.test(form.mobile)) errors.mobile = "Enter a valid 10-digit number.";
  if (!form.rent.trim())        errors.rent        = "Rent amount is required.";
  if (!form.email.trim())       errors.email       = "Email is required.";
  else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "Enter a valid email address.";
  if (images.length === 0)      errors.images      = "Please upload at least one image.";
  return errors;
}

// ── Image Processing ──
export function processImageFiles(e, currentCount) {
  const files = Array.from(e.target.files);
  if (!files.length) return null;
  if (currentCount + files.length > 5) {
    alert("Maximum 5 images allowed.");
    return null;
  }
  return files.map((file) => ({
    file,
    url:  URL.createObjectURL(file),
    name: file.name,
  }));
}

// ── Custom Hook ──
export function useAddPropertyLogic() {
  const navigate = useNavigate();

  const [form,      setForm]      = useState(initialFormState);
  const [images,    setImages]    = useState([]);
  const [errors,    setErrors]    = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev)   => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const toggleFacility = (value) => {
    setForm((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(value)
        ? prev.facilities.filter((f) => f !== value)
        : [...prev.facilities, value],
    }));
  };

  const handleImageUpload = (e) => {
    const newPreviews = processImageFiles(e, images.length);
    if (newPreviews) {
      setImages((prev) => [...prev, ...newPreviews]);
      setErrors((prev) => ({ ...prev, images: "" }));
    }
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const newErrors = validateForm(form, images);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // TODO: send to backend API
    setSubmitted(true);
  };

  const resetForm = () => {
    setForm(initialFormState);
    setImages([]);
    setErrors({});
    setSubmitted(false);
  };

  const goHome   = () => navigate("/");
  const goBack   = () => navigate(-1);
  const goSignIn = () => navigate("/signin");
  const goRooms  = () => navigate("/rooms");

  return {
    form,
    images,
    errors,
    submitted,
    handleChange,
    toggleFacility,
    handleImageUpload,
    removeImage,
    handleSubmit,
    resetForm,
    goHome,
    goBack,
    goSignIn,
    goRooms,
  };
}