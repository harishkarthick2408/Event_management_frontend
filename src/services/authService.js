import { mockUsers } from '../utils/constants';

// Mock auth service functions

export const authService = {
  login: async (email, password) => {
    await new Promise((res) => setTimeout(res, 500));
    const user = mockUsers.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid email or password. Try: admin@zoho.com / admin123');
    const { password: _pwd, ...safeUser } = user;
    return safeUser;
  },

  register: async (userData) => {
    await new Promise((res) => setTimeout(res, 600));
    // Basic validation
    if (!userData.email || !userData.name) throw new Error('Name and email are required');
    return {
      id: `u${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'attendee',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=E8441A&color=fff`,
    };
  },

  logout: async () => {
    await new Promise((res) => setTimeout(res, 100));
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

  forgotPassword: async (email) => {
    await new Promise((res) => setTimeout(res, 800));
    const user = mockUsers.find((u) => u.email === email);
    if (!user) throw new Error('No account found with that email');
    return { message: 'Password reset link sent to ' + email };
  },
};

export default authService;
