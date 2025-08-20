// src/components/ui/Card.jsx
import React from 'react';

const Card = ({ 
  children, 
  title,
  footer,
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow overflow-hidden ${className}`}
      {...props}
    >
      {title && (
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-4 sm:p-6">
        {children}
      </div>
      {footer && (
        <div className="px-4 py-4 bg-gray-50 sm:px-6">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;