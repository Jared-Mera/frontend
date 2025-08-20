// src/services/productService.js
import { pythonAPI } from './api';

export const getProducts = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const response = await pythonAPI.get(`/api/products?skip=${skip}&limit=${limit}`);
  return response.data;
};

export const getProduct = async (id) => {
  const response = await pythonAPI.get(`/api/products/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await pythonAPI.post('/api/products', productData);//Creacion Procucto
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await pythonAPI.put(`/api/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  await pythonAPI.delete(`/api/products/${id}`);
};

export const getProductsByCategory = async (categoryId) => {
  const response = await pythonAPI.get(`/api/products/category/${categoryId}`);
  return response.data;
};

export const uploadProductImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await pythonAPI.post('/api/upload/upload', formData, { // Linea Corregida
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.image_url;
};

export const searchProducts = async (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const response = await pythonAPI.get(`/api/products/search?query=${encodeURIComponent(query)}&skip=${skip}&limit=${limit}`);
  return response.data;
};