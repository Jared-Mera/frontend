// src/components/sales/ProductSelector.jsx
import React, { useState, useEffect } from 'react';
import { getProductsForSale } from '../../services/saleService';
import Input from '../ui/Input';

const ProductSelector = ({ onSelectProduct }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
// juanito
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await getProductsForSale();
        setProducts(data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    if (selectedProduct && quantity > 0) {
      onSelectProduct({
        ...selectedProduct,
        quantity,
        precio_unitario: selectedProduct.precio
      });
      setSelectedProduct(null);
      setQuantity(1);
    }
  };

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            label="Buscar producto"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Nombre o SKU"
          />
          
          {loading && <p className="text-gray-500 mt-2">Cargando productos...</p>}
          
          {filteredProducts.length > 0 && !loading && (
            <div className="mt-2 max-h-60 overflow-y-auto border rounded-md">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className={`p-3 hover:bg-gray-100 cursor-pointer ${
                    selectedProduct?.id === product.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{product.nombre}</h4>
                      <p className="text-sm text-gray-600">
                        ${product.precio.toFixed(2)} | Stock: {product.stock} | {product.sku}
                      </p>
                    </div>
                    {product.imagen_url && (
                      <img 
                        src={product.imagen_url} 
                        alt={product.nombre}
                        className="w-12 h-12 object-contain"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          {selectedProduct ? (
            <>
              <h3 className="font-medium mb-2">{selectedProduct.nombre}</h3>
              <Input
                label="Cantidad"
                type="number"
                min="1"
                max={selectedProduct.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
              <div className="mt-4">
                <button
                  onClick={handleAddProduct}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
                >
                  Agregar al carrito
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Seleccione un producto
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSelector;
