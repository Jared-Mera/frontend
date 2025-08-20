import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '../../services/userService';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import UserForm from './UserForm';
import Alert from '../../components/ui/Alert';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      setAlert({ type: 'danger', message: 'Error al cargar usuarios' });
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await deleteUser(id);
        setAlert({ type: 'success', message: 'Usuario eliminado correctamente' });
        loadUsers();
      } catch (error) {
        setAlert({ type: 'danger', message: 'Error al eliminar usuario' });
      }
    }
  };

  const handleSubmitSuccess = () => {
    setIsModalOpen(false);
    setAlert({ type: 'success', message: 'Usuario guardado correctamente' });
    loadUsers();
  };

  const headers = ['Nombre', 'Email', 'Rol', 'Acciones'];

  const renderRow = (user) => (
    <tr key={user._id}>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role?.name || 'Sin rol'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>Editar</Button>
        <Button variant="danger" size="sm" onClick={() => handleDelete(user._id)} className="ml-2">
          Eliminar
        </Button>
      </td>
    </tr>
  );

  if (loading) {
    return <p>Cargando usuarios...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <Button onClick={handleCreate}>Nuevo Usuario</Button>
      </div>

      {alert.message && (
        <Alert variant={alert.type} className="mb-4">
          {alert.message}
        </Alert>
      )}

      <Table headers={headers} data={users} renderRow={renderRow} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentUser ? 'Editar Usuario' : 'Crear Usuario'}
      >
        <UserForm 
          user={currentUser} 
          onSubmitSuccess={handleSubmitSuccess} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
};

export default UsersPage;