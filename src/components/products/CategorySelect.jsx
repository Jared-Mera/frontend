// src/components/products/CategorySelect.jsx
import React, { useEffect, useState } from 'react';
import { getCategories } from '../../services/categoryService';

const CategorySelect = ({ value, onChange, error }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <p>Cargando categorías...</p>;
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
      >
        <option value="">Seleccione una categoría</option>
        {categories.map(category => (
          <option key={category.id} value={category.id}>
            {category.nombre}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default CategorySelect;