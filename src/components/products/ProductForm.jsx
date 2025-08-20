// src/components/products/ProductForm.jsx
import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import CategorySelect from './CategorySelect';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: product ? product.nombre : '',
    descripcion: product ? product.descripcion : '',
    precio: product ? product.precio : 0,
    stock: product ? product.stock : 0,
    categoria_id: product ? product.categoria_id : '',
    sku: product ? product.sku : '',
    imagen_url: product ? product.imagen_url : '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'Nombre es requerido';
    if (formData.precio <= 0) newErrors.precio = 'Precio debe ser mayor a 0';
    if (formData.stock < 0) newErrors.stock = 'Stock no puede ser negativo';
    if (!formData.categoria_id) newErrors.categoria_id = 'Categoría es requerida';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      // Primero subir la imagen si hay
      if (imageFile) {
        // Aquí implementar la subida de la imagen
        // formData.imagen_url = await uploadImage(imageFile);
      }

      // Llamar a onSubmit con los datos del formulario
      await onSubmit(formData);
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      setErrors({ submit: 'Error al guardar el producto' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Nombre"
        id="nombre"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        error={errors.nombre}
        required
      />
      <Input
        label="Descripción"
        id="descripcion"
        name="descripcion"
        value={formData.descripcion}
        onChange={handleChange}
        as="textarea"
        rows={3}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Precio"
          id="precio"
          name="precio"
          type="number"
          step="0.01"
          min="0"
          value={formData.precio}
          onChange={handleChange}
          error={errors.precio}
          required
        />
        <Input
          label="Stock"
          id="stock"
          name="stock"
          type="number"
          min="0"
          value={formData.stock}
          onChange={handleChange}
          error={errors.stock}
          required
        />
      </div>
      <Input
        label="SKU"
        id="sku"
        name="sku"
        value={formData.sku}
        onChange={handleChange}
      />
      <CategorySelect
        value={formData.categoria_id}
        onChange={(value) => setFormData(prev => ({ ...prev, categoria_id: value }))}
        error={errors.categoria_id}
      />
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {formData.imagen_url && !imageFile && (
          <div className="mt-2">
            <img src={formData.imagen_url} alt="Producto" className="h-20" />
          </div>
        )}
      </div>
      {errors.submit && <p className="text-red-500 text-sm mb-4">{errors.submit}</p>}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" loading={loading}>Guardar</Button>
      </div>
    </form>
  );
};

export default ProductForm;