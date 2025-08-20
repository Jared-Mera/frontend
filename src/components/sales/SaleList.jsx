// src/components/sales/SaleList.jsx
import React, { useState, useEffect } from 'react';
import { getSales } from '../../services/saleService';
import SaleItem from '../sales/SaleItem';
import Table from '../ui/Table';
import Button from '../ui/Button';

const SaleList = ({ onViewDetails }) => {
  const [sales, setSales] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const limit = 10;
// sales
  const loadSales = async () => {
    setLoading(true);
    try {
      const data = await getSales(page, limit);
      setSales(data);
      // En un caso real, esto debería venir del backend
      setTotalPages(Math.ceil(100 / limit)); 
      setError('');
    } catch (err) {
      setError('Error al cargar ventas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, [page]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const headers = ['ID', 'Fecha', 'Vendedor', 'Total', 'Acciones'];

  const renderRow = (sale) => (
    <tr key={sale._id}>
      <td className="px-4 py-3 text-sm">{sale._id.substring(0, 8)}...</td>
      <td className="px-4 py-3 text-sm">
        {new Date(sale.fecha).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 text-sm">
        {sale.vendedor_id?.name || 'N/A'}
      </td>
      <td className="px-4 py-3 font-medium">
        ${sale.total.toFixed(2)}
      </td>
      <td className="px-4 py-3">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onViewDetails(sale._id)}
        >
          Ver Detalle
        </Button>
      </td>
    </tr>
  );

  if (loading) return <p className="text-center py-4">Cargando ventas...</p>;
  if (error) return <p className="text-red-500 text-center py-4">{error}</p>;

  return (
    <div>
      <Table 
        headers={headers} 
        data={sales} 
        renderRow={renderRow}
      />
      
      <div className="flex justify-between items-center mt-4">
        <Button 
          onClick={handlePrevPage} 
          disabled={page === 1}
        >
          Anterior
        </Button>
        <span>Página {page} de {totalPages}</span>
        <Button 
          onClick={handleNextPage} 
          disabled={page === totalPages}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};

export default SaleList;
