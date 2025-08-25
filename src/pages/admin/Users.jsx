// src/pages/admin/Users.jsx
import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser, searchUsers } from '../../services/userService'; // Agregar searchUsers
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import UserForm from './UserForm';
import Alert from '../../components/ui/Alert';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para búsqueda

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (searchQuery = '') => {
    setLoading(true);
    try {
      let data;
      if (searchQuery) {
        data = await searchUsers(searchQuery);
      } else {
        data = await getUsers();
      }
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

  const handleSearch = (e) => {
    e.preventDefault();
    loadUsers(searchTerm);
  };

  const headers = ['Nombre', 'Email', 'Rol', 'Acciones'];

  const renderRow = (user) => (
    <tr key={user._id} className="even:bg-gray-50 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-4 text-sm font-medium text-gray-900">{user.name}</td>
      <td className="px-4 py-4 text-sm text-gray-700">{user.email}</td>
      <td className="px-4 py-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
          {user.role?.name || 'Sin rol'}
        </span>
      </td>
      <td className="px-4 py-4 text-sm font-medium">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleEdit(user)} className="flex items-center">
            <PencilIcon className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(user._id)} className="flex items-center">
            <TrashIcon className="h-4 w-4 mr-1" />
            Eliminar
          </Button>
        </div>
      </td>
    </tr>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center h-64">
        <div className="animate-pulse text-gray-500">Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
          <p className="text-sm text-gray-600 mt-1">Administra los usuarios del sistema</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar usuarios por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Buscar
          </button>
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                loadUsers();
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Limpiar
            </button>
          )}
        </form>
      </div>

      {alert.message && (
        <Alert variant={alert.type} className="mb-6 animate-fadeIn">
          {alert.message}
        </Alert>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <Table headers={headers} data={users} renderRow={renderRow} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentUser ? 'Editar Usuario' : 'Crear Usuario'}
        size="lg"
      >
        <UserForm
          user={currentUser}
          onSubmitSuccess={handleSubmitSuccess}
          onCancel={() => setIsModalOpen(false)}
          isAdmin={true}   // <- temporal para probar
        />

      </Modal>
    </div>
  );
};

export default UsersPage;