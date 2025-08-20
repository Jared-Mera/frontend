import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSalesReport } from '../services/saleService';
import { getProducts } from '../services/productService';
import Card from '../components/ui/Card';
import { formatCurrency } from '../utils/helpers';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [todaySales, setTodaySales] = useState(0);
  const [monthSales, setMonthSales] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState(0);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        const report = await getSalesReport(
          startOfMonth.toISOString().split('T')[0],
          endOfMonth.toISOString().split('T')[0]
        );
        
        const todaySales = report.ventas.filter(sale => {
          const saleDate = new Date(sale.fecha);
          return saleDate.toDateString() === today.toDateString();
        });
        
        const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);
        setTodaySales(todayTotal);
        setMonthSales(report.totalVentas);
        setSalesData(report.ventas.slice(0, 5));

        const products = await getProducts(1, 1000);
        setTotalProducts(products.length);
        setLowStockProducts(products.filter(p => p.stock < 10).length);
        
      } catch (error) {
        console.error('Error cargando dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Bienvenido, <span className="font-semibold text-indigo-600">{user?.name}</span> ({user?.role})
        </p>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="p-4 md:p-6 flex items-center">
            <div className="rounded-full bg-indigo-100 p-3 md:p-4 mr-3 md:mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 01118 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h2 className="text-sm md:text-base font-semibold text-gray-600 truncate">Ventas Hoy</h2>
              <p className="text-xl md:text-2xl font-bold text-gray-800 truncate">{formatCurrency(todaySales)}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="p-4 md:p-6 flex items-center">
            <div className="rounded-full bg-green-100 p-3 md:p-4 mr-3 md:mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h2 className="text-sm md:text-base font-semibold text-gray-600 truncate">Ventas Mes</h2>
              <p className="text-xl md:text-2xl font-bold text-gray-800 truncate">{formatCurrency(monthSales)}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="p-4 md:p-6 flex items-center">
            <div className="rounded-full bg-blue-100 p-3 md:p-4 mr-3 md:mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="min-w-0">
              <h2 className="text-sm md:text-base font-semibold text-gray-600 truncate">Total Productos</h2>
              <p className="text-xl md:text-2xl font-bold text-gray-800 truncate">{totalProducts}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="p-4 md:p-6 flex items-center">
            <div className="rounded-full bg-red-100 p-3 md:p-4 mr-3 md:mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h2 className="text-sm md:text-base font-semibold text-gray-600 truncate">Bajo Stock</h2>
              <p className="text-xl md:text-2xl font-bold text-gray-800 truncate">{lowStockProducts}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Sección de últimas ventas y resumen mensual */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Últimas Ventas
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {salesData.map((sale, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 md:px-4 md:py-3 text-sm font-medium text-gray-900 truncate">{sale._id.substring(0, 8)}...</td>
                      <td className="px-3 py-2 md:px-4 md:py-3 text-sm text-gray-600">
                        {new Date(sale.fecha).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-2 md:px-4 md:py-3 text-sm font-semibold text-indigo-600">
                        {formatCurrency(sale.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {salesData.length === 0 && (
              <div className="text-center py-4 md:py-6 text-gray-500">
                No hay ventas registradas
              </div>
            )}
          </div>
        </Card>

        <Card className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Resumen Mensual
            </h2>
            <div className="space-y-3 md:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm md:text-base text-gray-600">Ventas totales:</span>
                <span className="font-bold text-base md:text-lg text-gray-800">{formatCurrency(monthSales)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm md:text-base text-gray-600">Promedio diario:</span>
                <span className="font-bold text-base md:text-lg text-gray-800">
                  {formatCurrency(monthSales / new Date().getDate())}
                </span>
              </div>
              <div className="pt-3 md:pt-4">
                <div className="flex justify-between text-xs md:text-sm text-gray-600 mb-1">
                  <span>Progreso del mes</span>
                  <span>{Math.round((todaySales / monthSales) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (todaySales / monthSales) * 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="pt-2 text-xs text-gray-500">
                Hoy: {formatCurrency(todaySales)} ({Math.round((todaySales / monthSales) * 100)}% del mes)
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
