// src/pages/admin/Products.jsx
import React, { useState } from 'react';
import ProductList from '../../components/products/ProductList';
import ProductForm from '../../components/products/ProductForm';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { createProduct, updateProduct, deleteProduct } from '../../services/productService';
import Alert from '../../components/ui/Alert';

const ProductsPage = () => {
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
        // Cerrar alerta después de 3 segundos
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Productos</h1>
        <Button onClick={handleCreate}>Nuevo Producto</Button>
      </div>
      
      {alert.message && (
        <Alert variant={alert.type} className="mb-4">
          {alert.message}
        </Alert>
      )}

      <ProductList onEdit={handleEdit} onDelete={handleDelete} />
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentProduct ? 'Editar Producto' : 'Crear Producto'}
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