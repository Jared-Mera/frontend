import React, { useState, useEffect } from "react";
import { getSalesReport } from "../../services/saleService";
import Table from "../../components/ui/Table";
import Alert from "../../components/ui/Alert";
import { formatCurrency } from "../../utils/helpers";
import ReportFilters from "../../components/sales/ReportFilters";

import jsPDF from "jspdf";
import "jspdf-autotable";

// Componente Modal simple
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-11/12 md:w-1/2 p-6 relative">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="max-h-96 overflow-y-auto">{children}</div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

const SalesReportPage = () => {
  const [filters, setFilters] = useState({ startDate: "", endDate: "" });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSale, setSelectedSale] = useState(null); // Para el modal

  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    setFilters({
      startDate: firstDay.toISOString().split("T")[0],
      endDate: lastDay.toISOString().split("T")[0],
    });
  }, []);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateReport = async () => {
    if (!filters.startDate || !filters.endDate) {
      setError("Por favor seleccione ambas fechas");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getSalesReport(filters.startDate, filters.endDate);
      setReportData(data);
    } catch (err) {
      setError(err.message || "Error al generar el reporte");
    } finally {
      setLoading(false);
    }
  };

  // PDF funcional con los datos de detalle de ventas
  const handleDownloadPDF = () => {
    if (!reportData) return;

    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.text("Reporte de Ventas", 14, 20);

    // Resumen
    doc.setFontSize(12);
    doc.text(`Total Ventas: ${reportData.cantidadVentas || 0}`, 14, 30);
    doc.text(
      `Total Ingresos: ${formatCurrency(reportData.totalVentas || 0)}`,
      14,
      37
    );
    doc.text(
      `Periodo: ${new Date(
        filters.startDate
      ).toLocaleDateString()} - ${new Date(
        filters.endDate
      ).toLocaleDateString()}`,
      14,
      44
    );

    // Datos de las ventas
    const ventas = Array.isArray(reportData.ventas) ? reportData.ventas : [];

    const tableData = ventas.map((sale) => [
      sale._id?.substring(0, 8) + "..." || "N/A",
      sale.fecha ? new Date(sale.fecha).toLocaleDateString() : "N/A",
      sale.vendedor_id?.name || "N/A",
      formatCurrency(sale.total || 0),
    ]);

    // Tabla de detalle de ventas
    doc.autoTable({
      head: [["ID Venta", "Fecha", "Vendedor", "Total"]],
      body: tableData,
      startY: 55,
    });

    doc.save("reporte_ventas.pdf");
  };

  const headers = ["ID Venta", "Fecha", "Vendedor", "Total", "Acciones"];

  const renderRow = (sale) => (
    <tr key={sale._id} className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm text-gray-900">
        {sale._id?.substring(0, 8) + "..."}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {sale.fecha ? new Date(sale.fecha).toLocaleDateString() : "N/A"}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {sale.vendedor_id?.name || "N/A"}
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-indigo-600">
        {formatCurrency(sale.total || 0)}
      </td>
      <td className="px-4 py-3 text-sm">
        <button
          onClick={() => setSelectedSale(sale)}
          className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
        >
          Ver Detalle
        </button>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="mb-6 md:mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Reporte de Ventas
          </h1>
          <p className="text-gray-600 mt-2">
            Genera reportes detallados de ventas por período
          </p>
        </div>
        {reportData && (
          <button
            onClick={handleDownloadPDF}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Descargar PDF
          </button>
        )}
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
              Resumen del Reporte
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
                <p className="text-sm font-medium text-indigo-600">
                  Total Ventas
                </p>
                <p className="text-2xl md:text-3xl font-bold text-indigo-800">
                  {reportData.cantidadVentas}
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                <p className="text-sm font-medium text-green-600">
                  Total Ingresos
                </p>
                <p className="text-2xl md:text-3xl font-bold text-green-800">
                  {formatCurrency(reportData.totalVentas)}
                </p>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                <p className="text-sm font-medium text-blue-600">Período</p>
                <p className="text-sm font-bold text-blue-800">
                  {new Date(filters.startDate).toLocaleDateString()} -{" "}
                  {new Date(filters.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                Detalle de Ventas
              </h2>
            </div>
            <Table
              headers={headers}
              data={reportData.ventas || []}
              renderRow={renderRow}
              className="min-w-full"
            />
          </div>
        </div>
      )}

      {/* Modal de detalle de venta */}
      <Modal
        isOpen={!!selectedSale}
        onClose={() => setSelectedSale(null)}
        title="Detalle de Venta"
      >
        {selectedSale && (
          <div>
            <p>
              <strong>Cliente:</strong> {selectedSale.cliente || "N/A"}
            </p>
            <p>
              <strong>Vendedor:</strong>{" "}
              {selectedSale.vendedor_id?.name || "N/A"}
            </p>
            <p>
              <strong>Fecha:</strong>{" "}
              {new Date(selectedSale.fecha).toLocaleDateString()}
            </p>
            <p className="mt-2 font-semibold">Productos:</p>
            <ul className="list-disc list-inside">
              {selectedSale.productos?.map((p, idx) => (
                <li key={idx}>
                  {p.nombre} x {p.cantidad} ({formatCurrency(p.precio)})
                </li>
              )) || <li>No hay productos</li>}
            </ul>
            <p className="mt-2 font-semibold">
              Total: {formatCurrency(selectedSale.total)}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SalesReportPage;
