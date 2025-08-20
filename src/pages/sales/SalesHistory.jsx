import React, { useState } from 'react';
import SaleList from '../../components/sales/SaleList';
import { getSaleById } from '../../services/saleService';
import Modal from '../../components/ui/Modal';
import SaleItem from '../../components/sales/SaleItem';

const SalesHistoryPage = () => {
  const [selectedSale, setSelectedSale] = useState(null);
  const [saleDetail, setSaleDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const handleViewDetails = async (saleId) => {
    setLoadingDetail(true);
    try {
      const sale = await getSaleById(saleId);
      setSaleDetail(sale);
      setSelectedSale(saleId);
    } catch (error) {
      console.error('Error al cargar detalle de venta:', error);
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Historial de Ventas</h1>
        <p className="text-gray-600 mt-2">Consulta el registro completo de ventas realizadas</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
        <SaleList onViewDetails={handleViewDetails} />
      </div>
      
      <Modal
        isOpen={!!selectedSale}
        onClose={() => setSelectedSale(null)}
        title={`Detalle de Venta #${selectedSale}`}
        size="lg"
      >
        {loadingDetail ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : saleDetail ? (
          <SaleItem sale={saleDetail} />
        ) : (
          <p className="text-center py-4 text-gray-500">No se encontró la venta</p>
        )}
      </Modal>
    </div>
  );
};

export default SalesHistoryPage;