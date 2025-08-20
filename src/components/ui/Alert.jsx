// src/components/ui/Alert.jsx
import React from 'react';

const Alert = ({ 
  children, 
  variant = 'info', 
  onClose,
  className = ''
}) => {
  // Estilos base
  const baseStyles = 'p-4 rounded-md flex items-start';
  
  // Variantes de color
  const variants = {
    info: 'bg-blue-50 text-blue-800',
    success: 'bg-green-50 text-green-800',
    warning: 'bg-yellow-50 text-yellow-800',
    danger: 'bg-red-50 text-red-800',
  };
  
  // Iconos (puedes reemplazar con iconos de tu librería preferida)
  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    danger: '❌',
  };
  
  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} role="alert">
      <span className="mr-2">{icons[variant]}</span>
      <div className="flex-1">{children}</div>
      {onClose && (
        <button 
          onClick={onClose} 
          className="ml-2 text-xl leading-none opacity-50 hover:opacity-100 focus:outline-none"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;