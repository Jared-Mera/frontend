// src/pages/admin/Products.jsx
import React, { useState } from 'react';
import ProductList from '../../components/products/ProductList';
import ProductForm from '../../components/products/ProductForm';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { getProducts, searchProducts } from '../../services/productService'; // Agregar searchProducts
import { createProduct, updateProduct, deleteProduct } from '../../services/productService';
import Alert from '../../components/ui/Alert';
import { PlusIcon } from '@heroicons/react/24/outline';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  // Agregar estado de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const handleCreate = () => {
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await deleteProduct(id);
        setAlert({ type: 'success', message: 'Producto eliminado correctamente' });
        // Cerraramos alerta después de 3 segundos
        setTimeout(() => setAlert({ type: '', message: '' }), 3000);
      } catch (error) {
        setAlert({ type: 'danger', message: 'Error al eliminar el producto' });
      }
    }
  };

  const handleSubmit = async (productData) => {
    try {
      if (currentProduct) {
        // Actualizar
        await updateProduct(currentProduct.id, productData);
        setAlert({ type: 'success', message: 'Producto actualizado correctamente' });
      } else {
        // Crear
        await createProduct(productData);
        setAlert({ type: 'success', message: 'Producto creado correctamente' });
      }
      setIsModalOpen(false);
      // Cerrar alerta después de 3 segundos
      setTimeout(() => setAlert({ type: '', message: '' }), 3000);
    } catch (error) {
      setAlert({ type: 'danger', message: error.message || 'Error al guardar el producto' });
    }
  };

  // Modificar la función loadProducts para aceptar búsqueda
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
    setTotalPages(Math.ceil(100 / limit));
  } catch (error) {
    console.error('Error al cargar productos:', error);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Productos</h1>
          <p className="text-sm text-gray-600 mt-1">Administra los productos de tu inventario</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          Nuevo Producto
        </Button>
      </div>
      
      {alert.message && (
        <Alert variant={alert.type} className="mb-6 animate-fadeIn">
          {alert.message}
        </Alert>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <ProductList onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentProduct ? 'Editar Producto' : 'Crear Producto'}
        size="lg"
      >
        <ProductForm 
          product={currentProduct}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ProductsPage;