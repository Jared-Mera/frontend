// src/pages/sales/SalesHistory.jsx
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
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Historial de Ventas</h1>
      </div>
      
      <SaleList onViewDetails={handleViewDetails} />
      
      <Modal
        isOpen={!!selectedSale}
        onClose={() => setSelectedSale(null)}
        title={`Detalle de Venta #${selectedSale}`}
        size="lg"
      >
        {loadingDetail ? (
          <p className="text-center py-4">Cargando detalle...</p>
        ) : saleDetail ? (
          <SaleItem sale={saleDetail} />
        ) : (
          <p>No se encontró la venta</p>
        )}
      </Modal>
    </div>
  );
};

export default SalesHistoryPage;