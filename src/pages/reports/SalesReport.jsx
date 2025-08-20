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
    <tr key={sale._id} className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm text-gray-900">{sale._id.substring(0, 8)}...</td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {new Date(sale.fecha).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {sale.vendedor_id?.name || 'N/A'}
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-indigo-600">
        {formatCurrency(sale.total)}
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Reporte de Ventas</h1>
        <p className="text-gray-600 mt-2">Genera reportes detallados de ventas por período</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6">
        <ReportFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onGenerate={handleGenerateReport}
        />
      </div>
      
      {error && (
        <Alert variant="danger" className="mb-6 animate-fade-in">
          {error}
        </Alert>
      )}
      
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      )}
      
      {reportData && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Resumen del Reporte
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
                <p className="text-sm font-medium text-indigo-600">Total Ventas</p>
                <p className="text-2xl md:text-3xl font-bold text-indigo-800">{reportData.cantidadVentas}</p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                <p className="text-sm font-medium text-green-600">Total Ingresos</p>
                <p className="text-2xl md:text-3xl font-bold text-green-800">{formatCurrency(reportData.totalVentas)}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                <p className="text-sm font-medium text-blue-600">Período</p>
                <p className="text-sm font-bold text-blue-800">
                  {new Date(filters.startDate).toLocaleDateString()} - {new Date(filters.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Detalle de Ventas
              </h2>
            </div>
            <Table 
              headers={headers} 
              data={reportData.ventas} 
              renderRow={renderRow}
              className="min-w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesReportPage;