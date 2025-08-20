// src/components/products/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { getProducts, searchProducts } from '../../services/productService';
import ProductItem from './ProductItem';
import Table from '../ui/Table';
import Button from '../ui/Button';

const ProductList = ({ onEdit, onDelete }) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para búsqueda

  const limit = 10;

  const loadProducts = async (page, searchQuery = '') => {
    setLoading(true);
    try {
      let data;
      if (searchQuery) {
        data = await searchProducts(searchQuery, page, limit);
      } else {
        data = await getProducts(page, limit);
      }
      setProducts(data);
      // Suponiendo que el backend devuelve el total de productos
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
    loadProducts(page, searchTerm);
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadProducts(1, searchTerm);
  };

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
      {/* Barra de búsqueda */}
      <div className="mb-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Buscar
          </button>
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setPage(1);
                loadProducts(1);
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Limpiar
            </button>
          )}
        </form>
      </div>
      <div>
        <Table headers={headers} data={products} renderRow={renderRow} />
        <div className="flex justify-between items-center mt-4">
          <Button onClick={handlePrevPage} disabled={page === 1}>Anterior</Button>
          <span>Página {page} de {totalPages}</span>
          <Button onClick={handleNextPage} disabled={page === totalPages}>Siguiente</Button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;