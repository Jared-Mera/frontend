// Roles de usuario
export const ROLES = {
  ADMIN: 'Administrador',
  SELLER: 'Vendedor',
  CONSULTANT: 'Consultor'
};

// Permisos
export const PERMISSIONS = {
  MANAGE_USERS: 'gestion_usuarios',
  MANAGE_PRODUCTS: 'gestion_productos',
  MANAGE_SALES: 'gestion_ventas',
  VIEW_REPORTS: 'ver_reportes',
  MANAGE_ROLES: 'gestion_roles'
};

// Rutas de API
export const API_ENDPOINTS = {
  // Backend Node
  LOGIN: '/api/auth/login',
  USERS: '/api/users',
  ROLES: '/api/roles',
  SALES: '/api/sales',
  // Backend Python
  PRODUCTS: '/api/products',
  CATEGORIES: '/api/categories',
  UPLOAD: '/api/upload'
};

// Configuración paginación
export const PAGINATION_CONFIG = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};