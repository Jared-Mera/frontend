import React, { useState } from 'react';
import SaleForm from '../../components/sales/SaleForm';
import { createSale } from '../../services/saleService';
import Alert from '../../components/ui/Alert';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

#hola
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Nueva Venta</h1>
            <p className="text-gray-600 mt-2">Registra una nueva venta en el sistema</p>
          </div>
          <div className="bg-white rounded-full px-4 py-2 shadow-sm">
            <span className="text-sm text-gray-600">Vendedor: </span>
            <span className="font-medium text-indigo-600">{user?.name}</span>
          </div>
        </div>
      </div>
      
      {alert.message && (
        <Alert variant={alert.type} className="mb-6 animate-fade-in">
          {alert.message}
        </Alert>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
        <SaleForm 
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard')}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default NewSalePage;
