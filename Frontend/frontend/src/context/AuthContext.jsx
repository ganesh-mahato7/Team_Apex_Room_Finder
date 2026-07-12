import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, logout as logoutApi } from '../services/authService.js';
import { connectSocket, disconnectSocket } from '../socket/socket.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) { setLoading(false); return; }
    try {
      const res = await getMe();
      setUser(res.data.data.user);
      connectSocket(token);
    } catch { localStorage.removeItem('accessToken'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = (userData, token) => {
    localStorage.setItem('accessToken', token);
    setUser(userData);
    connectSocket(token);
  };

  const logout = async () => {
    try { await logoutApi(); } catch {}
    localStorage.removeItem('accessToken');
    disconnectSocket();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};