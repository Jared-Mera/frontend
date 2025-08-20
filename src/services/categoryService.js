// src/services/categoryService.js
import { pythonAPI } from './api';

export const getCategories = async () => {
  const response = await pythonAPI.get('/api/categories');
  return response.data;
};

export const getCategory = async (id) => {
  const response = await pythonAPI.get(`/api/categories/${id}`);
  return response.data;
};