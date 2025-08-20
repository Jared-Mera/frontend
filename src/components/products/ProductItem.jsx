// src/components/products/ProductItem.jsx
import React from 'react';
import Card from '../ui/Card';

const ProductItem = ({ product, onEdit, onDelete }) => {
  return (
    <Card className="mb-4">
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.nombre}</h3>
        <p className="text-gray-600">${product.precio.toFixed(2)}</p>
        <p className="text-gray-600">Stock: {product.stock}</p>
        {product.imagen_url && (
          <img 
            src={product.imagen_url} 
            alt={product.nombre} 
            className="mt-2 h-32 object-contain"
          />
        )}
        <div className="mt-4">
          <button 
            onClick={() => onEdit(product)}
            className="text-blue-600 hover:text-blue-800 mr-2"
          >
            Editar
          </button>
          <button 
            onClick={() => onDelete(product.id)}
            className="text-red-600 hover:text-red-800"
          >
            Eliminar
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ProductItem;