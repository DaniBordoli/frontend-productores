import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = authService.getCurrentUser();
    if (stored && stored.activo === false) {
      authService.logout();
      return null;
    }
    return stored;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/auth/profile');
        const serverUser = response.data.user;
        if (!serverUser || serverUser.activo === false) {
          authService.logout();
          setUser(null);
        } else {
          setUser(serverUser);
          localStorage.setItem('user', JSON.stringify(serverUser));
        }
      } catch {
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifySession();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
