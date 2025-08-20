// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ userRole }) => {
  // Definir menú según el rol del usuario
  const menuItems = {
    Administrador: [
      { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
      { path: '/admin/products', label: 'Productos', icon: 'inventory' },
      { path: '/admin/users', label: 'Usuarios', icon: 'people' },
      { path: '/admin/roles', label: 'Roles', icon: 'admin_panel_settings' },
      { path: '/sales', label: 'Ventas', icon: 'point_of_sale' },
      { path: '/sales/history', label: 'Historial', icon: 'history' },
      { path: '/reports', label: 'Reportes', icon: 'bar_chart' },
    ],
    Vendedor: [
      { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
      { path: '/sales', label: 'Ventas', icon: 'point_of_sale' },
      { path: '/sales/history', label: 'Historial', icon: 'history' },
    ],
    Consultor: [
      { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
      { path: '/sales/history', label: 'Historial', icon: 'history' },
      { path: '/reports', label: 'Reportes', icon: 'bar_chart' },
    ],
  };

  // Obtener menú según el rol
  const items = menuItems[userRole] || [];

  return (
    <aside className="w-64 bg-gray-100 min-h-screen">
      <nav>
        <ul className="p-2">
          {items.map((item) => (
            <li key={item.path} className="mb-1">
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center p-2 rounded-md ${
                    isActive 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`
                }
              >
                <span className="material-icons mr-2">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;