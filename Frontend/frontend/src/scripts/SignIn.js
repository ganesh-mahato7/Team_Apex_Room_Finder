// Frontend/src/scripts/SignIn.js

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";

export function useSignInLogic() {
  const navigate      = useNavigate();
  const { login }     = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (field, value) => {
    setForm((prev)   => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setApiError("");
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim())   e.email    = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password)       e.password = "Password is required.";
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
      const data = await loginUser(form.email, form.password);

      if (data.token) {
        // Save to AuthContext (also saves to localStorage)
        login(data.user, data.token);

        // Redirect based on role
        if (data.user.role === "admin")    navigate("/admin/dashboard");
        else if (data.user.role === "landlord") navigate("/landlord/dashboard");
        else navigate("/user/dashboard");

      } else {
        setApiError(data.message || "Login failed.");
      }
    } catch (err) {
      setApiError("Cannot connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goToRegister       = () => navigate("/register");
  const goToForgotPassword = () => navigate("/forgot-password");
  const goToHome           = () => navigate("/");

  return {
    form,
    errors,
    loading,
    apiError,
    handleChange,
    handleSubmit,
    goToRegister:        () => navigate("/register"),
    goToForgotPassword:  () => navigate("/forgot-password"),
    goToHome:            () => navigate("/"),
  };
}