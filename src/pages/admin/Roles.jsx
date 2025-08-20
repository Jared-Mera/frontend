import React, { useState, useEffect } from 'react';
import { getRoles, deleteRole } from '../../services/roleService';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import RoleForm from './RoleForm';
import Alert from '../../components/ui/Alert';

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
    <tr key={role._id}>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{role.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {role.permissions.join(', ')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        {!['Administrador', 'Vendedor', 'Consultor'].includes(role.name) && (
          <>
            <Button variant="outline" size="sm" onClick={() => handleEdit(role)}>Editar</Button>
            <Button variant="danger" size="sm" onClick={() => handleDelete(role._id)} className="ml-2">
              Eliminar
            </Button>
          </>
        )}
      </td>
    </tr>
  );

  if (loading) {
    return <p>Cargando roles...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Roles</h1>
        <Button onClick={handleCreate}>Nuevo Rol</Button>
      </div>

      {alert.message && (
        <Alert variant={alert.type} className="mb-4">
          {alert.message}
        </Alert>
      )}

      <Table headers={headers} data={roles} renderRow={renderRow} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentRole ? 'Editar Rol' : 'Crear Rol'}
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