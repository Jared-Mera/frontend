// src/components/layout/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-800 to-indigo-900 text-white p-4 text-center shadow-inner">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm mb-2 md:mb-0">Sistema de Punto de Venta &copy; {new Date().getFullYear()}</p>
        <div className="flex space-x-4">
          <a href="#" className="text-indigo-200 hover:text-white transition-colors duration-200 text-sm">
            Términos y Condiciones
          </a>
          <a href="#" className="text-indigo-200 hover:text-white transition-colors duration-200 text-sm">
            Política de Privacidad
          </a>
          <a href="#" className="text-indigo-200 hover:text-white transition-colors duration-200 text-sm">
            Soporte
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
