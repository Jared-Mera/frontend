// src/services/authService.js
import { nodeAPI, setAuthToken, pythonAPI } from './api';

export const login = async (email, password) => {
  try {
    const response = await nodeAPI.post('/api/auth/login', { email, password });
    const { token, user } = response.data;
    
    // Guardar token en localStorage
    localStorage.setItem('token', token);
    
    // Configurar token en headers Axios
    setAuthToken(token);
    
    return user;
  } catch (error) {
    throw new Error(error.message || 'Error en el inicio de sesión');
  }
};

export const logout = () => {
  // Eliminar token de localStorage
  localStorage.removeItem('token');
  
  // Eliminar token de headers Axios
  setAuthToken(null);
  
  // Redirigir a login
  window.location = '/login';
};

// Verificar si hay token guardado al iniciar la app
export const checkAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
    return true;
  }
  return false;
};