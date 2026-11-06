import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('shopsphere_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('shopsphere_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const res = await authService.getProfile();
          if (res.success) {
            setUser(res.data);
            localStorage.setItem('shopsphere_user', JSON.stringify(res.data));
          }
        } catch (error) {
          console.error('Failed to restore session:', error.message);
          logout();
        }
      }
      setIsLoading(false);
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.success) {
      setUser(res.data);
      setToken(res.data.token);
      localStorage.setItem('shopsphere_token', res.data.token);
      localStorage.setItem('shopsphere_user', JSON.stringify(res.data));
    }
    return res;
  };

  const register = async (name, email, password) => {
    const res = await authService.register({ name, email, password });
    if (res.success) {
      setUser(res.data);
      setToken(res.data.token);
      localStorage.setItem('shopsphere_token', res.data.token);
      localStorage.setItem('shopsphere_user', JSON.stringify(res.data));
    }
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('shopsphere_token');
    localStorage.removeItem('shopsphere_user');
  };

  const updateProfile = async (data) => {
    const res = await authService.updateProfile(data);
    if (res.success) {
      setUser(res.data);
      if (res.data.token) {
        setToken(res.data.token);
        localStorage.setItem('shopsphere_token', res.data.token);
      }
      localStorage.setItem('shopsphere_user', JSON.stringify(res.data));
    }
    return res;
  };

  const addAddress = async (addressData) => {
    const res = await authService.addAddress(addressData);
    if (res.success) {
      setUser((prev) => ({ ...prev, addresses: res.data }));
      const updated = { ...user, addresses: res.data };
      localStorage.setItem('shopsphere_user', JSON.stringify(updated));
    }
    return res;
  };

  const deleteAddress = async (addressId) => {
    const res = await authService.deleteAddress(addressId);
    if (res.success) {
      setUser((prev) => ({ ...prev, addresses: res.data }));
      const updated = { ...user, addresses: res.data };
      localStorage.setItem('shopsphere_user', JSON.stringify(updated));
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        deleteAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

