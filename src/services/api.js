import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Update to your backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mitr-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const login = async (data) => {
  try {
    const response = await api.post('/auth/login', data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const signupInitiate = async (data) => {
  try {
    const response = await api.post('/auth/signup/initiate', data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Signup initiation failed');
  }
};

export const signupComplete = async (data) => {
  try {
    const response = await api.post('/auth/signup/complete', data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Signup completion failed');
  }
};

export const forgotPassword = async (data) => {
  try {
    const response = await api.post('/auth/forgot-password', data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send OTP');
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await api.post('/auth/reset-password', data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Password reset failed');
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Logout failed');
  }
};

export const logoutAll = async () => {
  try {
    const response = await api.post('/auth/logout-all');
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Logout all failed');
  }
};

// User endpoints
export const getProfile = async () => {
  try {
    const response = await api.get('/user/profile');
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch profile');
  }
};

export const changePassword = async (data) => {
  try {
    const response = await api.put('/user/change-password', data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to change password');
  }
};

export const deleteAccount = async () => {
  try {
    const response = await api.delete('/user/account');
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete account');
  }
};

// Device endpoints
export const linkDevice = async (data) => {
  try {
    const response = await api.post('/device/link', data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to link device');
  }
};

export const getDevice = async (deviceId) => {
  try {
    const response = await api.get(`/device/${deviceId}`);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch device');
  }
};

export const startTrigger = async (data, apiKey) => {
  try {
    const response = await api.post('/device/trigger/start', data, {
      headers: { 'x-api-key': apiKey },
    });
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to start trigger');
  }
};

export const updateEmergencyContacts = async (data) => {
  try {
    const response = await api.put('/device/emergency-contacts', data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update emergency contacts');
  }
};

export const updateTriggerWords = async (data) => {
  try {
    const response = await api.put('/device/trigger-words', data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update trigger words');
  }
};

// Session endpoints
export const stopTrigger = async (data) => {
  try {
    const response = await api.post('/sessions/stop', data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to stop trigger');
  }
};

export const getSessionDetails = async (sessionId) => {
  try {
    const response = await api.get(`/sessions/${sessionId}`);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch session details');
  }
};

export const getSessionHistory = async (deviceId) => {
  try {
    const response = await api.get('/sessions/history', {
      params: { deviceId },
    });
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch session history');
  }
};

export const updateUserInfo = async (data) => {
  try {
    const response = await api.put('/user/update', data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update user information');
  }
};