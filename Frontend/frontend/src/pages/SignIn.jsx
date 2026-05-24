// pages/SignIn.jsx

import React from "react";
import "../css/global.css";
import "../css/SignIn.css";

import { FiMail, FiLock } from "react-icons/fi";

import { useSignInLogic } from "../scripts/SignIn";

function SignIn() {
  const {
    form,
    errors,
    loading,
    apiError,
    handleChange,
    handleSubmit,
    goToRegister,
    goToForgotPassword,
    goToHome,
  } = useSignInLogic();

  return (
    <div className="signin-page">
      <div className="signin-card">

        {/* LOGO */}
        <div className="signin-logo" onClick={goToHome}>
          <span className="logo-dot"></span>
          RoomFinder
        </div>

        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to your RoomFinder account</p>

        {/* API ERROR */}
        {apiError && <p className="api-error">{apiError}</p>}

        {/* FORM */}
        <div className="signin-form">

          {/* Email */}
          <div className="form-field">
            <label className="field-label">Email Address</label>
            <div className={`input-wrap ${errors.email ? "error-border" : ""}`}>
              <FiMail className="input-icon" />
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="form-field">
            <label className="field-label">Password</label>
            <div className={`input-wrap ${errors.password ? "error-border" : ""}`}>
              <FiLock className="input-icon" />
              <input
                type="password"
                placeholder="Your password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          {/* Forgot Password */}
          <p className="forgot-link" onClick={goToForgotPassword}>
            Forgot password?
          </p>

          {/* Submit */}
          <button
            className="btn-primary"
            style={{ width: "100%" }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </div>

        {/* BOTTOM LINK */}
        <p className="signin-bottom">
          Don't have an account?{" "}
          <span onClick={goToRegister}>Create one</span>
        </p>

      </div>
    </div>
  );
}

export default SignIn;