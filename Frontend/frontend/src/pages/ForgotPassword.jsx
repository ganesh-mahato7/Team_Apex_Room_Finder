// pages/ForgotPassword.jsx

import React from "react";
import "../css/global.css";
import "../css/ForgotPassword.css";

import { FiMail, FiArrowLeft, FiCheck } from "react-icons/fi";

import { useForgotPasswordLogic } from "../scripts/ForgotPassword";

function ForgotPassword() {
  const {
    email,
    error,
    loading,
    success,
    apiError,
    handleChange,
    handleSubmit,
    goToSignIn,
    goToHome,
  } = useForgotPasswordLogic();

  return (
    <div className="forgot-page">
      <div className="forgot-card">

        {/* LOGO */}
        <div className="forgot-logo" onClick={goToHome}>
          <span className="logo-dot"></span>
          RoomFinder
        </div>

        {/* SUCCESS STATE */}
        {success ? (
          <div className="success-box">
            <div className="success-icon">
              <FiCheck size={28} />
            </div>
            <h3>Email Sent!</h3>
            <p>
              We sent a password reset link to <strong>{email}</strong>.
              Check your inbox and follow the instructions.
            </p>
            <button
              className="btn-primary"
              style={{ width: "100%" }}
              onClick={goToSignIn}
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <>
            {/* ICON */}
            <div className="forgot-icon">
              <FiMail size={28} />
            </div>

            <h2>Forgot Password?</h2>
            <p className="subtitle">
              Enter your email and we'll send you a link to reset your password.
            </p>

            {/* API ERROR */}
            {apiError && <p className="api-error">{apiError}</p>}

            {/* FORM */}
            <div className="forgot-form">

              <div className="form-field">
                <label className="field-label">Email Address</label>
                <div className={`input-wrap ${error ? "error-border" : ""}`}>
                  <FiMail className="input-icon" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => handleChange(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  />
                </div>
                {error && <p className="error">{error}</p>}
              </div>

              <button
                className="btn-primary"
                style={{ width: "100%" }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

            </div>
          </>
        )}

        {/* BACK TO SIGN IN */}
        {!success && (
          <p className="back-to-signin">
            Remember your password?{" "}
            <span onClick={goToSignIn}>Sign In</span>
          </p>
        )}

      </div>
    </div>
  );
}

export default ForgotPassword;