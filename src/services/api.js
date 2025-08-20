// src/services/api.js
import axios from 'axios';

// Instancia para backend Node.js (usuarios/ventas)
export const nodeAPI = axios.create({
  baseURL: import.meta.env.VITE_NODE_BACKEND_URL,
});

// Instancia para backend Python (productos/categorías)
export const pythonAPI = axios.create({
  baseURL: import.meta.env.VITE_PYTHON_BACKEND_URL,
});

// Función para configurar token de autenticación
export const setAuthToken = (token) => {
  if (token) {
    nodeAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    pythonAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete nodeAPI.defaults.headers.common['Authorization'];
    delete pythonAPI.defaults.headers.common['Authorization'];
  }
};

// Interceptor para manejar errores
[nodeAPI, pythonAPI].forEach(instance => {
  instance.interceptors.response.use(
    response => response,
    error => {
      if (error.response) {
        const { status, config } = error.response;
        
        if (status === 401) {
          // Evitar redirección si es una solicitud de login
          if (config.url.includes('/api/auth/login')) {
            return Promise.reject({
              message: error.response.data?.error || 'Credenciales inválidas',
              status
            });
          }
          
          // Redirigir solo para otros casos de 401 (token expirado)
          localStorage.removeItem('token');
          window.location = '/login';
        }
        
        return Promise.reject({
          message: error.response.data?.error || 'Error en la solicitud',
          status
        });
      }
      return Promise.reject(error);
    }
  );
});