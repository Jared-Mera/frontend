import React, { useState, useEffect } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { getAvailablePermissions, createRole, updateRolePermissions } from '../../services/roleService';

const RoleForm = ({ role, onSubmitSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: role ? role.name : '',
    permissions: role ? role.permissions : [],
  });
  const [permissionsList, setPermissionsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const permissions = await getAvailablePermissions();
        setPermissionsList(permissions);
      } catch (error) {
        console.error('Error al cargar permisos:', error);
      }
    };
    fetchPermissions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const newPermissions = checked
        ? [...prev.permissions, value]
        : prev.permissions.filter(p => p !== value);
      return { ...prev, permissions: newPermissions };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nombre es requerido';
    if (formData.permissions.length === 0) newErrors.permissions = 'Seleccione al menos un permiso';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      if (role) {
        await updateRolePermissions(role._id, formData.permissions);
      } else {
        await createRole(formData);
      }
      onSubmitSuccess();
    } catch (error) {
      console.error('Error al guardar rol:', error);
      setErrors({ submit: error.response?.data?.error || 'Error al guardar rol' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Nombre"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
        disabled={role && ['Administrador', 'Vendedor', 'Consultor'].includes(role.name)}
      />
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Permisos</label>
        {permissionsList.length === 0 ? (
          <p>Cargando permisos...</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {permissionsList.map(permission => (
              <div key={permission} className="flex items-center">
                <input
                  type="checkbox"
                  id={`perm-${permission}`}
                  value={permission}
                  checked={formData.permissions.includes(permission)}
                  onChange={handlePermissionChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={role && ['Administrador', 'Vendedor', 'Consultor'].includes(role.name)}
                />
                <label htmlFor={`perm-${permission}`} className="ml-2 text-sm text-gray-700">
                  {permission}
                </label>
              </div>
            ))}
          </div>
        )}
        {errors.permissions && <p className="mt-1 text-sm text-red-600">{errors.permissions}</p>}
      </div>
      {errors.submit && <p className="text-red-500 text-sm mb-4">{errors.submit}</p>}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" loading={loading}>Guardar</Button>
      </div>
    </form>
  );
};

export default RoleForm;