// src/services/saleService.js
import { nodeAPI } from './api';
import { pythonAPI } from './api';

export const createSale = async (saleData) => {
  const response = await nodeAPI.post('/api/sales', saleData);
  return response.data;
};

export const getSales = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const response = await nodeAPI.get(`/api/sales?skip=${skip}&limit=${limit}`);
  return response.data;
};

export const getSaleById = async (id) => {
  const response = await nodeAPI.get(`/api/sales/${id}`);
  return response.data;
};

export const getSalesReport = async (startDate, endDate) => {
  const response = await nodeAPI.get('/api/sales/report', {
    params: { 
      startDate: startDate,
      endDate: endDate
    }
  });
  return response.data;
};

export const getProductsForSale = async () => {
  // Este servicio debe obtener productos del backend Python
  const response = await pythonAPI.get('/api/products?limit=1000');
  return response.data;
};