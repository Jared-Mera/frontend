import React, { useState, useEffect } from 'react';
import { getRoles, deleteRole } from '../../services/roleService';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import RoleForm from './RoleForm';
import Alert from '../../components/ui/Alert';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const data = await getRoles();
      setRoles(data);
      setLoading(false);
    } catch (error) {
      setAlert({ type: 'danger', message: 'Error al cargar roles' });
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setCurrentRole(null);
    setIsModalOpen(true);
  };

  const handleEdit = (role) => {
    setCurrentRole(role);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este rol?')) {
      try {
        await deleteRole(id);
        setAlert({ type: 'success', message: 'Rol eliminado correctamente' });
        loadRoles();
      } catch (error) {
        setAlert({ type: 'danger', message: 'Error al eliminar rol' });
      }
    }
  };

  const handleSubmitSuccess = () => {
    setIsModalOpen(false);
    setAlert({ type: 'success', message: 'Rol guardado correctamente' });
    loadRoles();
  };

  const headers = ['Nombre', 'Permisos', 'Acciones'];

  const renderRow = (role) => (
    <tr key={role._id} className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-4 text-sm font-medium text-gray-900">{role.name}</td>
      <td className="px-4 py-4 text-sm text-gray-600">
        <div className="flex flex-wrap gap-1">
          {role.permissions.slice(0, 3).map(permission => (
            <span 
              key={permission}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize"
            >
              {permission.replace(/_/g, ' ')}
            </span>
          ))}
          {role.permissions.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              +{role.permissions.length - 3} más
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-4 text-sm font-medium">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleEdit(role)}
            className="flex items-center"
            disabled={['Administrador', 'Vendedor', 'Consultor'].includes(role.name)}
          >
            <PencilIcon className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => handleDelete(role._id)}
            className="flex items-center"
            disabled={['Administrador', 'Vendedor', 'Consultor'].includes(role.name)}
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            Eliminar
          </Button>
        </div>
      </td>
    </tr>
  );

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Gestión de Roles</h1>
            <p className="text-gray-600 mt-2">Administra los roles y permisos del sistema</p>
          </div>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            Nuevo Rol
          </Button>
        </div>
      </div>

      {alert.message && (
        <Alert variant={alert.type} className="mb-6 animate-fadeIn">
          {alert.message}
        </Alert>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table 
            headers={headers} 
            data={roles} 
            renderRow={renderRow}
            emptyMessage="No hay roles registrados"
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="lg"
      >
        <RoleForm 
          role={currentRole} 
          onSubmitSuccess={handleSubmitSuccess} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
};

export default RolesPage;