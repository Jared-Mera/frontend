// src/components/layout/Layout.jsx
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../../context/AuthContext';
import { Outlet } from 'react-router-dom'; // Importa Outlet

const Layout = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        {user && <Sidebar userRole={user.role} />}
        <main className="flex-1 p-4 overflow-hidden">
          <Outlet /> {/* Esto renderiza el contenido de la ruta actual */}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
