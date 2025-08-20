// src/pages/sales/NewSale.jsx
import React, { useState } from 'react';
import SaleForm from '../../components/sales/SaleForm';
import { createSale } from '../../services/saleService';
import Alert from '../../components/ui/Alert';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NewSalePage = () => {
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (saleData) => {
    setLoading(true);
    try {
      await createSale(saleData);
      setAlert({ 
        type: 'success', 
        message: 'Venta registrada exitosamente' 
      });
      
      // Redirigir después de 2 segundos
      setTimeout(() => navigate('/sales/history'), 2000);
    } catch (error) {
      setAlert({ 
        type: 'danger', 
        message: error.message || 'Error al registrar la venta' 
      });
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nueva Venta</h1>
        <div className="text-sm text-gray-600">
          Vendedor: <span className="font-medium">{user?.name}</span>
        </div>
      </div>
      
      {alert.message && (
        <Alert variant={alert.type} className="mb-4">
          {alert.message}
        </Alert>
      )}

      <SaleForm 
        onSubmit={handleSubmit}
        onCancel={() => navigate('/dashboard')}
        loading={loading}
      />
    </div>
  );
};

export default NewSalePage;