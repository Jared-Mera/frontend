// src/components/layout/Header.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-xl font-bold">Sistema de Punto de Venta</h1>
      </div>
      {user && (
        <div className="flex items-center">
          <span className="mr-4">Hola, {user.name} ({user.role})</span>
          <button 
            onClick={logout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;