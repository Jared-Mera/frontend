import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const Sidebar = ({ userRole }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { sidebarOpen, toggleSidebar } = useApp();

  const menuItems = {
    Administrador: [
      { path: '/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/admin/products', label: 'Productos', icon: '📦' },
      { path: '/admin/users', label: 'Usuarios', icon: '👥' },
      { path: '/admin/roles', label: 'Roles', icon: '🔐' },
      { path: '/sales', label: 'Ventas', icon: '💳' },
      { path: '/sales/history', label: 'Historial', icon: '📋' },
      { path: '/reports', label: 'Reportes', icon: '📈' },
    ],
    Vendedor: [
      { path: '/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/sales', label: 'Ventas', icon: '💳' },
      { path: '/sales/history', label: 'Historial', icon: '📋' },
    ],
    Consultor: [
      { path: '/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/sales/history', label: 'Historial', icon: '📋' },
      { path: '/reports', label: 'Reportes', icon: '📈' },
    ],
  };

  const items = menuItems[userRole] || [];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-md"
      >
        ☰
      </button>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gradient-to-b from-indigo-800 to-indigo-900 text-white transform transition-transform duration-300 ease-in-out z-50 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-indigo-700">
          <h2 className="text-xl font-bold">Menú Principal</h2>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-white text-indigo-800 shadow-lg'
                        : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
                    }`
                  }
                >
                  <span className="text-xl mr-3">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>


      </aside>
    </>
  );
};

export default Sidebar;