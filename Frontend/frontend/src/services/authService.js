// Frontend/src/services/authService.js
// All authentication API calls in one place

const BASE_URL = "http://localhost:5000/api/v1/users";

// ── Register ──
export const registerUser = async (name, email, password, role) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ name, email, password, role }),
  });
  return res.json();
};

// ── Login ──
export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ email, password }),
  });
  return res.json();
};

// ── Forgot Password ──
export const forgotPasswordRequest = async (email) => {
  const res = await fetch(`${BASE_URL}/forgot-password`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ email }),
  });
  return res.json();
};

// ── Reset Password ──
export const resetPasswordRequest = async (token, newPassword) => {
  const res = await fetch(`${BASE_URL}/reset-password/${token}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ newPassword }),
  });
  return res.json();
};

// ── Get Profile (protected) ──
export const getProfile = async (token) => {
  const res = await fetch(`${BASE_URL}/profile`, {
    method:  "GET",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  return res.json();
};