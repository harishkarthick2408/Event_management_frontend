import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('eventpro_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('eventpro_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { user, token } = await authService.login(email, password);
    const safeUser = user;
    setCurrentUser(safeUser);
    setIsAuthenticated(true);
    localStorage.setItem('eventpro_user', JSON.stringify(safeUser));
    localStorage.setItem('eventpro_token', token);
    return safeUser;
  };

  const register = async (userData) => {
    const { user, token } = await authService.register(userData);
    const newUser = user;
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('eventpro_user', JSON.stringify(newUser));
    localStorage.setItem('eventpro_token', token);
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('eventpro_user');
    localStorage.removeItem('eventpro_token');
  };

  const userRole = currentUser?.role || null;

  return (
    <AuthContext.Provider
      value={{ currentUser, isAuthenticated, userRole, login, logout, register, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
