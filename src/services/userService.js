import { nodeAPI } from './api';

export const getUsers = async () => {
  const response = await nodeAPI.get('/api/users');
  return response.data;
};

export const getUser = async (id) => {
  const response = await nodeAPI.get(`/api/users/${id}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await nodeAPI.post('/api/users', userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await nodeAPI.put(`/api/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  await nodeAPI.delete(`/api/users/${id}`);
};