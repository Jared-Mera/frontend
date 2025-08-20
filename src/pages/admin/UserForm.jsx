import React, { useState, useEffect } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { getRoles } from '../../services/roleService';
import { createUser, updateUser } from '../../services/userService';

const UserForm = ({ user, onSubmitSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user ? user.name : '',
    email: user ? user.email : '',
    password: '',
    roleId: user ? user.role?._id : '',
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await getRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error('Error al cargar roles:', error);
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nombre es requerido';
    if (!formData.email) newErrors.email = 'Email es requerido';
    if (!user && !formData.password) newErrors.password = 'Contraseña es requerida';
    if (!formData.roleId) newErrors.roleId = 'Rol es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      if (user) {
        await updateUser(user._id, formData);
      } else {
        await createUser(formData);
      }
      onSubmitSuccess();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      setErrors({ submit: error.response?.data?.error || 'Error al guardar usuario' });
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
      />
      <Input
        label="Email"
        id="email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required
        disabled={!!user}
      />
      {!user && (
        <Input
          label="Contraseña"
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />
      )}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
        <select
          name="roleId"
          value={formData.roleId}
          onChange={handleChange}
          className={`block w-full px-3 py-2 border ${errors.roleId ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
        >
          <option value="">Seleccione un rol</option>
          {roles.map(role => (
            <option key={role._id} value={role._id}>{role.name}</option>
          ))}
        </select>
        {errors.roleId && <p className="mt-1 text-sm text-red-600">{errors.roleId}</p>}
      </div>
      {errors.submit && <p className="text-red-500 text-sm mb-4">{errors.submit}</p>}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" loading={loading}>Guardar</Button>
      </div>
    </form>
  );
};

export default UserForm;