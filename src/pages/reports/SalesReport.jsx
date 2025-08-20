import React, { useState, useEffect } from 'react';
import { getSalesReport } from '../../services/saleService';
import Table from '../../components/ui/Table';
import Alert from '../../components/ui/Alert';
import { formatCurrency } from '../../utils/helpers';
import ReportFilters from '../../components/sales/ReportFilters';

const SalesReportPage = () => {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: ''
  });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Establecer fechas por defecto (mes actual)
  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    setFilters({
      startDate: firstDay.toISOString().split('T')[0],
      endDate: lastDay.toISOString().split('T')[0]
    });
  }, []);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateReport = async () => {
    if (!filters.startDate || !filters.endDate) {
      setError('Por favor seleccione ambas fechas');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const data = await getSalesReport(filters.startDate, filters.endDate);
      setReportData(data);
    } catch (err) {
      setError(err.message || 'Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const headers = ['ID Venta', 'Fecha', 'Vendedor', 'Total'];

  const renderRow = (sale) => (
    <tr key={sale._id}>
      <td className="px-6 py-4 text-sm">{sale._id.substring(0, 8)}...</td>
      <td className="px-6 py-4 text-sm">
        {new Date(sale.fecha).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 text-sm">
        {sale.vendedor_id?.name || 'N/A'}
      </td>
      <td className="px-6 py-4 font-medium">
        {formatCurrency(sale.total)}
      </td>
    </tr>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Reporte de Ventas</h1>
      
      <ReportFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onGenerate={handleGenerateReport}
      />
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      {loading && <p className="text-center py-4">Generando reporte...</p>}
      
      {reportData && (
        <div>
          <div className="bg-white p-4 rounded-md shadow mb-6">
            <h2 className="text-lg font-medium mb-2">Resumen del Reporte</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Total Ventas</p>
                <p className="text-xl font-bold">{reportData.cantidadVentas}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Total Ingresos</p>
                <p className="text-xl font-bold">{formatCurrency(reportData.totalVentas)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Periodo</p>
                <p className="text-xl font-bold">
                  {new Date(filters.startDate).toLocaleDateString()} - {new Date(filters.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow">
            <h2 className="text-lg font-medium mb-4">Detalle de Ventas</h2>
            <Table 
              headers={headers} 
              data={reportData.ventas} 
              renderRow={renderRow}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesReportPage;