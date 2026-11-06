import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  addAddress: async (addressData) => {
    const response = await api.post('/auth/address', addressData);
    return response.data;
  },

  deleteAddress: async (addressId) => {
    const response = await api.delete(`/auth/address/${addressId}`);
    return response.data;
  }
};

