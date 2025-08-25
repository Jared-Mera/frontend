// src/components/ui/Button.jsx
import React from 'react';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  onClick, 
  disabled = false,
  className = '',
  loading = false,        // <-- consumir loading aquí
  ...props                // resto de props (no contendrá loading)
}) => {
  // Estilos base
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Variantes de color
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    outline: 'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  };
  
  // Estilos para estado deshabilitado
  const disabledStyles = 'opacity-50 cursor-not-allowed';
  
  // Si loading true, forzamos disabled
  const isDisabled = disabled || loading;

  // Combinar estilos
  const buttonStyles = `${baseStyles} ${variants[variant]} ${isDisabled ? disabledStyles : ''} ${className}`;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={buttonStyles}
      aria-busy={loading ? 'true' : undefined}
      {...props} // safe: loading ya fue removido de props
    >
      {loading && (
        // spinner pequeño
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      )}
      <span>{children}</span>
    </button>
  );
};

export default Button;
