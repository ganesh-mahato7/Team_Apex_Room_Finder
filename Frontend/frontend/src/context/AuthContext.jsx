// Frontend/src/context/AuthContext.jsx
// Global authentication state — wrap App with this

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// ── Helper: get valid user from localStorage ──
function getStoredUser() {
  try {
    const user = localStorage.getItem("user");
    return user && user !== "null" ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

function getStoredToken() {
  const token = localStorage.getItem("token");
  return token && token !== "null" ? token : null;
}

// ── Provider ──
export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(getStoredUser);
  const [token, setToken] = useState(getStoredToken);

  // Sync to localStorage whenever user/token changes
  useEffect(() => {
    if (user)  localStorage.setItem("user",  JSON.stringify(user));
    else       localStorage.removeItem("user");
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else       localStorage.removeItem("token");
  }, [token]);

  // ── Login: save user and token ──
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("role",  userData.role);
    localStorage.setItem("user",  JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  };

  // ── Logout: clear everything ──
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  // ── Check if logged in ──
  const isLoggedIn = !!user && !!token;

  // ── Role checks ──
  const isAdmin    = user?.role === "admin";
  const isLandlord = user?.role === "landlord";
  const isUser     = user?.role === "user";

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoggedIn,
      isAdmin,
      isLandlord,
      isUser,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook to use auth anywhere ──
export function useAuth() {
  return useContext(AuthContext);
}