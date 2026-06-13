// pages/ResetPassword.jsx


import "../css/global.css";
import "../css/ResetPassword.css";

import { FiLock, FiCheck } from "react-icons/fi";

import { useResetPasswordLogic } from "../scripts/ResetPassword";

function ResetPassword() {
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
  } = useResetPasswordLogic();

  return (
    <div className="reset-page">
      <div className="reset-card">

        {/* LOGO */}
        <div className="reset-logo" onClick={goToHome}>
          <span className="logo-dot"></span>
          RoomFinder
        </div>

        {/* SUCCESS STATE */}
        {success ? (
          <div className="success-box">
            <div className="success-icon">
              <FiCheck size={28} />
            </div>
            <h3>Password Reset!</h3>
            <p>Your password has been reset successfully. You can now sign in with your new password.</p>
            <button
              className="btn-primary"
              style={{ width: "100%" }}
              onClick={goToSignIn}
            >
              Go to Sign In
            </button>
          </div>
        ) : (
          <>
            {/* ICON */}
            <div className="reset-icon">
              <FiLock size={28} />
            </div>

            <h2>Reset Password</h2>
            <p className="subtitle">
              Enter your new password below.
            </p>

            {/* API ERROR */}
            {apiError && <p className="api-error">{apiError}</p>}

            {/* FORM */}
            <div className="reset-form">

              {/* New Password */}
              <div className="form-field">
                <label className="field-label">New Password</label>
                <div className={`input-wrap ${errors.newPassword ? "error-border" : ""}`}>
                  <FiLock className="input-icon" />
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={form.newPassword}
                    onChange={(e) => handleChange("newPassword", e.target.value)}
                  />
                </div>
                {errors.newPassword && <p className="error">{errors.newPassword}</p>}
              </div>

              {/* Confirm Password */}
              <div className="form-field">
                <label className="field-label">Confirm New Password</label>
                <div className={`input-wrap ${errors.confirmPassword ? "error-border" : ""}`}>
                  <FiLock className="input-icon" />
                  <input
                    type="password"
                    placeholder="Repeat new password"
                    value={form.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  />
                </div>
                {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
              </div>

              {/* Submit */}
              <button
                className="btn-primary"
                style={{ width: "100%" }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;