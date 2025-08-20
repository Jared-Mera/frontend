// src/components/sales/SaleForm.jsx
import React, { useState } from 'react';
import ProductSelector from './ProductSelector';
import TotalCalculator from './TotalCalculator';
import Table from '../ui/Table';
import Button from '../ui/Button';

const SaleForm = ({ onSubmit, onCancel, loading }) => {
  const [saleItems, setSaleItems] = useState([]);

  const handleAddProduct = (product) => {
    // Verificar si el producto ya está en la venta
    const existingIndex = saleItems.findIndex(item => item.producto_id === product.id);
    
    if (existingIndex >= 0) {
      // Actualizar cantidad si ya existe
      const updatedItems = [...saleItems];
      updatedItems[existingIndex].cantidad += product.quantity;
      setSaleItems(updatedItems);
    } else {
      // Agregar nuevo producto
      setSaleItems([
        ...saleItems,
        {
          producto_id: product.id,
          nombre: product.nombre,
          precio_unitario: product.precio,
          cantidad: product.quantity,
          imagen_url: product.imagen_url
        }
      ]);
    }
  };

  const handleRemoveItem = (index) => {
    const newItems = [...saleItems];
    newItems.splice(index, 1);
    setSaleItems(newItems);
  };

  const handleSubmit = () => {
    const saleData = {
      productos: saleItems.map(item => ({
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario
      }))
    };
    onSubmit(saleData);
  };

  const headers = ['Producto', 'Precio Unitario', 'Cantidad', 'Subtotal', 'Acciones'];

  const renderRow = (item, index) => (
    <tr key={index}>
      <td className="px-4 py-3">
        <div className="flex items-center">
          {item.imagen_url && (
            <img 
              src={item.imagen_url} 
              alt={item.nombre}
              className="w-10 h-10 object-contain mr-3"
            />
          )}
          {item.nombre}
        </div>
      </td>
      <td className="px-4 py-3">${item.precio_unitario.toFixed(2)}</td>
      <td className="px-4 py-3">{item.cantidad}</td>
      <td className="px-4 py-3">
        ${(item.precio_unitario * item.cantidad).toFixed(2)}
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() => handleRemoveItem(index)}
          className="text-red-600 hover:text-red-800"
        >
          Eliminar
        </button>
      </td>
    </tr>
  );

  return (
    <div>
      <ProductSelector onSelectProduct={handleAddProduct} />
      
      {saleItems.length > 0 ? (
        <>
          <Table 
            headers={headers} 
            data={saleItems} 
            renderRow={renderRow}
            className="mb-4"
          />
          
          <TotalCalculator items={saleItems} />
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button 
              variant="secondary" 
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              loading={loading}
            >
              Finalizar Venta
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No hay productos en la venta</p>
          <p className="text-sm mt-2">Busque y agregue productos usando el selector superior</p>
        </div>
      )}
    </div>
  );
};

export default SaleForm;