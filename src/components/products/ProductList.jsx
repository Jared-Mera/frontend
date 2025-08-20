// src/components/products/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { getProducts } from '../../services/productService';
import ProductItem from './ProductItem';
import Table from '../ui/Table';
import Button from '../ui/Button';

const ProductList = ({ onEdit, onDelete }) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const limit = 10;

  const loadProducts = async (page) => {
    setLoading(true);
    try {
      const data = await getProducts(page, limit);
      setProducts(data);
      // Suponiendo que el backend devuelve el total de productos
      // En un caso real, esto debería venir en la respuesta
      setTotalPages(Math.ceil(100 / limit)); // Ejemplo, ajustar según backend
      setError(null);
    } catch (err) {
      setError('Error al cargar productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(page);
  }, [page]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const headers = ['ID', 'Nombre', 'Precio', 'Stock', 'Categoría', 'Acciones'];

  const renderRow = (product) => (
    <tr key={product.id}>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.nombre}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.precio.toFixed(2)}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.categoria_id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <Button variant="outline" size="sm" onClick={() => onEdit(product)}>Editar</Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(product.id)} className="ml-2">
          Eliminar
        </Button>
      </td>
    </tr>
  );

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Table headers={headers} data={products} renderRow={renderRow} />
      <div className="flex justify-between items-center mt-4">
        <Button onClick={handlePrevPage} disabled={page === 1}>Anterior</Button>
        <span>Página {page} de {totalPages}</span>
        <Button onClick={handleNextPage} disabled={page === totalPages}>Siguiente</Button>
      </div>
    </div>
  );
};

export default ProductList;