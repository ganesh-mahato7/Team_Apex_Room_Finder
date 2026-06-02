// Frontend/src/scripts/ForgotPassword.js

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPasswordRequest } from "../services/authService";

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
    if (!email.trim())               return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Enter a valid email.";
    return "";
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    try {
      const data = await forgotPasswordRequest(email);
      // Always show success — backend never reveals if email exists
      setSuccess(true);
    } catch (err) {
      setApiError("Cannot connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    email, error, loading, success, apiError,
    handleChange, handleSubmit,
    goToSignIn: () => navigate("/signin"),
    goToHome:   () => navigate("/"),
  };
}