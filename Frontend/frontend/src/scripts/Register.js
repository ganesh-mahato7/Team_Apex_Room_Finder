// scripts/Register.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useRegisterLogic() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name:     "",
    email:    "",
    password: "",
    confirm:  "",
    role:     "user",
  });

  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [apiError, setApiError] = useState("");

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setApiError("");
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())     e.name     = "Name is required.";
    if (!form.email.trim())    e.email    = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password)        e.password = "Password is required.";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (!form.confirm)         e.confirm  = "Please confirm your password.";
    else if (form.confirm !== form.password) e.confirm = "Passwords do not match.";
    return e;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/users/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          name:     form.name,
          email:    form.email,
          password: form.password,
          role:     form.role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.message || "Registration failed.");
      } else {
        setSuccess(data.message);
      }
    } catch (err) {
      setApiError("Cannot connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goToSignIn  = () => navigate("/signin");
  const goToHome    = () => navigate("/");

  return {
    form,
    errors,
    loading,
    success,
    apiError,
    handleChange,
    handleSubmit,
    goToSignIn,
    goToHome,
  };
}