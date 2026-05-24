// scripts/SignIn.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useSignInLogic() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email:    "",
    password: "",
  });

  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setApiError("");
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim())    e.email    = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password)        e.password = "Password is required.";
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
      const res = await fetch("http://localhost:5000/api/v1/users/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          email:    form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.message || "Login failed.");
      } else {
        // Save token and role to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("role",  data.user.role);
        localStorage.setItem("user",  JSON.stringify(data.user));

        // Redirect based on role
        if (data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (data.user.role === "landlord") {
          navigate("/landlord/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (err) {
      setApiError("Cannot connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goToRegister     = () => navigate("/register");
  const goToForgotPassword = () => navigate("/forgot-password");
  const goToHome         = () => navigate("/");

  return {
    form,
    errors,
    loading,
    apiError,
    handleChange,
    handleSubmit,
    goToRegister,
    goToForgotPassword,
    goToHome,
  };
}