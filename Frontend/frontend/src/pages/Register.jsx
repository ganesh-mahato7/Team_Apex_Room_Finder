// pages/Register.jsx

import React from "react";
import "../css/global.css";
import "../css/Register.css";

import { FiUser, FiMail, FiLock, FiHome, FiArrowLeft } from "react-icons/fi";
import { MdApartment } from "react-icons/md";

import { useRegisterLogic } from "../scripts/Register";

function Register() {
  const {
    form,
    errors,
    loading,
    success,
    apiError,
    handleChange,
    handleSubmit,
    goToSignIn,
    goToHome,
  } = useRegisterLogic();

  return (
    <div className="register-page">
      <div className="register-card">

        {/* LOGO */}
        <div className="register-logo" onClick={goToHome}>
          <span className="logo-dot"></span>
          RoomFinder
        </div>

        <h2>Create Account</h2>
        <p className="subtitle">Join RoomFinder and find your perfect space</p>

        {/* SUCCESS STATE */}
        {success ? (
          <div className="success-box">
            <h3>🎉 Registration Successful!</h3>
            <p>{success}</p>
            <p>Check your email inbox and click the activation link.</p>
            <button
              className="btn-primary"
              style={{ marginTop: 16, width: "100%" }}
              onClick={goToSignIn}
            >
              Go to Sign In
            </button>
          </div>
        ) : (
          <>
            {/* ROLE SELECTOR */}
            <p className="role-label">I am a</p>
            <div className="role-selector">
              <button
                className={`role-btn ${form.role === "user" ? "active" : ""}`}
                onClick={() => handleChange("role", "user")}
              >
                <FiUser size={24} />
                Tenant / User
              </button>
              <button
                className={`role-btn ${form.role === "landlord" ? "active" : ""}`}
                onClick={() => handleChange("role", "landlord")}
              >
                <MdApartment size={24} />
                Landlord
              </button>
            </div>

            {/* API ERROR */}
            {apiError && <p className="api-error">{apiError}</p>}

            {/* FORM */}
            <div className="register-form">

              {/* Name */}
              <div className="form-field">
                <label className="field-label">Full Name</label>
                <div className={`input-wrap ${errors.name ? "error-border" : ""}`}>
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
                {errors.name && <p className="error">{errors.name}</p>}
              </div>

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
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                  />
                </div>
                {errors.password && <p className="error">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="form-field">
                <label className="field-label">Confirm Password</label>
                <div className={`input-wrap ${errors.confirm ? "error-border" : ""}`}>
                  <FiLock className="input-icon" />
                  <input
                    type="password"
                    placeholder="Repeat your password"
                    value={form.confirm}
                    onChange={(e) => handleChange("confirm", e.target.value)}
                  />
                </div>
                {errors.confirm && <p className="error">{errors.confirm}</p>}
              </div>

              {/* Submit */}
              <button
                className="btn-primary"
                style={{ width: "100%", marginTop: 4 }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Creating account..." : `Register as ${form.role === "landlord" ? "Landlord" : "User"}`}
              </button>

            </div>
          </>
        )}

        {/* BOTTOM LINK */}
        {!success && (
          <p className="register-bottom">
            Already have an account?{" "}
            <span onClick={goToSignIn}>Sign In</span>
          </p>
        )}

      </div>
    </div>
  );
}

export default Register;