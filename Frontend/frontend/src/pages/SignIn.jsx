import { useState, useEffect } from "react";
import "../css/global.css";
import "../css/SignIn.css";
import { FiMail, FiLock } from "react-icons/fi";
import { useSignInLogic } from "../scripts/SignIn";

function SignIn() {
  const {
    form, errors, loading, apiError,
    handleChange, handleSubmit,
    goToRegister, goToForgotPassword, goToHome,
  } = useSignInLogic();

  const [logo, setLogo] = useState(localStorage.getItem('adminLogo') || null);

  useEffect(() => {
    const handleLogoChange = () => setLogo(localStorage.getItem('adminLogo'));
    window.addEventListener('logo-updated', handleLogoChange);
    return () => window.removeEventListener('logo-updated', handleLogoChange);
  }, []);

  return (
    <div className="signin-page">
      <div className="signin-card">

        {/* LOGO */}
        <div className="signin-logo" onClick={goToHome}>
          {logo
            ? <img src={logo} alt="RoomFinder" style={{ height: 28, objectFit: 'contain', borderRadius: 4, marginRight: 6 }} />
            : <span className="logo-dot"></span>
          }
          RoomFinder
        </div>

        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to your RoomFinder account</p>

        {apiError && <p className="api-error">{apiError}</p>}

        <div className="signin-form">
          <div className="form-field">
            <label className="field-label">Email Address</label>
            <div className={`input-wrap ${errors.email ? "error-border" : ""}`}>
              <FiMail className="input-icon" />
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => handleChange("email", e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
              />
            </div>
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-field">
            <label className="field-label">Password</label>
            <div className={`input-wrap ${errors.password ? "error-border" : ""}`}>
              <FiLock className="input-icon" />
              <input
                type="password"
                placeholder="Your password"
                value={form.password}
                onChange={e => handleChange("password", e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
              />
            </div>
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <p className="forgot-link" onClick={goToForgotPassword}>Forgot password?</p>

          <button className="btn-primary" style={{ width: "100%" }} onClick={handleSubmit} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        <p className="signin-bottom">
          Don't have an account?{" "}
          <span onClick={goToRegister}>Create one</span>
        </p>
      </div>
    </div>
  );
}

export default SignIn;