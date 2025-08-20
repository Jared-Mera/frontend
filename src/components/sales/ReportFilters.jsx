import React from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

// pedro
const ReportFilters = ({ filters, onFilterChange, onGenerate }) => {
  return (
    <div className="bg-white p-4 rounded-md shadow mb-6">
      <h2 className="text-lg font-medium mb-4">Filtros de Reporte</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Input
            label="Fecha Inicio"
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange('startDate', e.target.value)}
          />
        </div>
        <div>
          <Input
            label="Fecha Fin"
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange('endDate', e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button 
            onClick={onGenerate}
            className="w-full"
          >
            Generar Reporte
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;
