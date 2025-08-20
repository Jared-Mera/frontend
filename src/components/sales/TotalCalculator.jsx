// src/components/sales/TotalCalculator.jsx
import React from 'react';

const TotalCalculator = ({ items }) => {
  const subtotal = items.reduce((total, item) => 
    total + (item.precio_unitario * item.cantidad), 0);
  
  const taxRate = 0.12; // 12% de impuesto
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Impuestos (12%):</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold border-t pt-2 mt-2">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default TotalCalculator;