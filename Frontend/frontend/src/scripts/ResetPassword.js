// Frontend/src/scripts/ResetPassword.js

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resetPasswordRequest } from "../services/authService";

export function useResetPasswordLogic() {
  const navigate  = useNavigate();
  const { token } = useParams();

  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (field, value) => {
    setForm((prev)   => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setApiError("");
  };

  const validate = () => {
    const e = {};
    if (!form.newPassword)     e.newPassword     = "Password is required.";
    else if (form.newPassword.length < 6) e.newPassword = "Min 6 characters.";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password.";
    else if (form.confirmPassword !== form.newPassword) e.confirmPassword = "Passwords do not match.";
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
      const data = await resetPasswordRequest(token, form.newPassword);

      if (data.message?.includes("successful")) {
        setSuccess(true);
      } else {
        setApiError(data.message || "Something went wrong.");
      }
    } catch (err) {
      setApiError("Cannot connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    form, errors, loading, success, apiError,
    handleChange, handleSubmit,
    goToSignIn: () => navigate("/signin"),
    goToHome:   () => navigate("/"),
  };
}