import { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../utils/constants';

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
    // Mock authentication — find user in constants
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const { password: _pwd, ...safeUser } = user;
    setCurrentUser(safeUser);
    setIsAuthenticated(true);
    localStorage.setItem('eventpro_user', JSON.stringify(safeUser));
    return safeUser;
  };

  const register = async (userData) => {
    // Mock: just store user and log them in
    const newUser = {
      id: `u${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'attendee',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=E8441A&color=fff`,
    };
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('eventpro_user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('eventpro_user');
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
