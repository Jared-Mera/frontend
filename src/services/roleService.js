import { nodeAPI } from './api';

export const getRoles = async () => {
  const response = await nodeAPI.get('/api/roles');
  return response.data;
};

export const getRole = async (id) => {
  const response = await nodeAPI.get(`/api/roles/${id}`);
  return response.data;
};

export const createRole = async (roleData) => {
  const response = await nodeAPI.post('/api/roles', roleData);
  return response.data;
};

export const updateRolePermissions = async (id, permissions) => {
  const response = await nodeAPI.put(`/api/roles/${id}/permissions`, { permissions });
  return response.data;
};

export const deleteRole = async (id) => {
  await nodeAPI.delete(`/api/roles/${id}`);
};

export const getAvailablePermissions = async () => {
  const response = await nodeAPI.get('/api/roles/permissions');
  return response.data;
};