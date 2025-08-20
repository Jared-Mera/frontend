// src/components/sales/SaleItem.jsx
import React from 'react';
import Card from '../ui/Card';

const SaleItem = ({ sale }) => {
  return (
    <Card className="mb-4">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">Venta #{sale._id.substring(0, 8)}</h3>
            <p className="text-gray-600">
              {new Date(sale.fecha).toLocaleDateString()} - {new Date(sale.fecha).toLocaleTimeString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">${sale.total.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Vendedor: {sale.vendedor_id?.name || 'N/A'}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="font-medium mb-2">Productos:</h4>
          <ul className="border rounded-md divide-y">
            {sale.productos.map((item, index) => (
              <li key={index} className="p-3 flex justify-between">
                <div>
                  <p>{item.producto_id?.nombre || 'Producto eliminado'}</p>
                  <p className="text-sm text-gray-600">
                    ${item.precio_unitario} x {item.cantidad}
                  </p>
                </div>
                <p className="font-medium">
                  ${(item.precio_unitario * item.cantidad).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default SaleItem;