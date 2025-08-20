// src/pages/sales/EditSale.jsx
import React, { useState, useEffect } from 'react';
import SaleForm from '../../components/sales/SaleForm';
import { getSaleById, updateSale } from '../../services/saleService';
import Alert from '../../components/ui/Alert';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const EditSalePage = () => {
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [saleData, setSaleData] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const loadSale = async () => {
      try {
        const sale = await getSaleById(id);
        setSaleData(sale);
      } catch (error) {
        setAlert({ 
          type: 'danger', 
          message: 'Error al cargar la venta' 
        });
      }
    };
    
    loadSale();
  }, [id]);

  const handleSubmit = async (updatedSaleData) => {
    setLoading(true);
    try {
      await updateSale(id, updatedSaleData);
      setAlert({ 
        type: 'success', 
        message: 'Venta actualizada exitosamente' 
      });
      
      setTimeout(() => navigate('/sales/history'), 2000);
    } catch (error) {
      setAlert({ 
        type: 'danger', 
        message: error.message || 'Error al actualizar la venta' 
      });
      setLoading(false);
    }
  };

  if (!saleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Editar Venta</h1>
            <p className="text-gray-600 mt-2">Editando venta #{id.substring(0, 8)}</p>
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
          initialData={saleData}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/sales/history')}
          loading={loading}
          isEdit={true}
        />
      </div>
    </div>
  );
};

export default EditSalePage;