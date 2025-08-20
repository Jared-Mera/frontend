// src/components/layout/Header.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-indigo-700 to-indigo-800 text-white p-4 flex justify-between items-center shadow-lg">
      <div className="flex items-center">
        <h1 className="text-xl font-bold">Sistema de Punto de Venta</h1>
      </div>
      {user && (
        <div className="flex items-center space-x-4">
          <span className="text-sm bg-indigo-600 py-1 px-3 rounded-full">
            Hola, {user.name} <span className="font-semibold">({user.role})</span>
          </span>
          <button 
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
