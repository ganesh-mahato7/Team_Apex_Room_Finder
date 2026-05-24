// scripts/ForgotPassword.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useForgotPasswordLogic() {
  const navigate = useNavigate();

  const [email,    setEmail]    = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (value) => {
    setEmail(value);
    setError("");
    setApiError("");
  };

  const validate = () => {
    if (!email.trim())             return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Enter a valid email.";
    return "";
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/users/forgot-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.message || "Something went wrong.");
      } else {
        setSuccess(true);
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
    email,
    error,
    loading,
    success,
    apiError,
    handleChange,
    handleSubmit,
    goToSignIn,
    goToHome,
  };
}