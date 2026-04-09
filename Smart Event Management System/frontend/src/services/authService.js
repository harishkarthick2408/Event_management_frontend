const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const authService = {
  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }
    return data; // { user, token }
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    return data; // { user, token }
  },

  logout: async () => {
    // If you later add a backend logout/blacklist, call it here
    return true;
  },

  getCurrentUser: () => {
    try {
      const saved = localStorage.getItem('eventpro_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  },

  forgotPassword: async () => {
    throw new Error('Password reset not implemented yet');
  },
};

export default authService;
