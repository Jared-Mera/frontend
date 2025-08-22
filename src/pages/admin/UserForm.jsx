import React, { useState, useEffect } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { getRoles } from "../../services/roleService";
import {
  createUser,
  updateUser,
  updateUserPasswordByAdmin,
} from "../../services/userService";

const UserForm = ({ user, onSubmitSuccess, onCancel, isAdmin = false }) => {
  const [formData, setFormData] = useState({
    name: user ? user.name : "",
    email: user ? user.email : "",
    password: "",
    roleId: user ? user.role?._id : "",
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Estado para modal de cambio de contraseña por Admin
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await getRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error("Error al cargar roles:", error);
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Nombre es requerido";
    if (!formData.email) newErrors.email = "Email es requerido";
    // Solo es requerido al crear, no al editar
    if (!user && !formData.password)
      newErrors.password = "Contraseña es requerida";
    if (!formData.roleId) newErrors.roleId = "Rol es requerido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      if (user) {
        // Si contraseña vacía, no la incluimos al actualizar
        const { password, ...rest } = formData;
        const dataToSend = password ? formData : rest;
        await updateUser(user._id, dataToSend);
      } else {
        await createUser(formData);
      }
      onSubmitSuccess && onSubmitSuccess();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      setErrors({
        submit: error.response?.data?.error || "Error al guardar usuario",
      });
    } finally {
      setLoading(false);
    }
  };

  // --- Funciones para cambiar contraseña por Admin ---
  const openPwdModal = () => {
    setPwdError("");
    setPwdSuccess("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPwdModal(true);
  };

  const closePwdModal = () => {
    setShowPwdModal(false);
  };

  const handleAdminPasswordChange = async (e) => {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess("");

    if (!newPassword || newPassword.length < 6) {
      setPwdError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError("Las contraseñas no coinciden.");
      return;
    }
    if (!user || !user._id) {
      setPwdError("Usuario inválido.");
      return;
    }

    setPwdLoading(true);
    try {
      await updateUserPasswordByAdmin(user._id, newPassword);
      setPwdSuccess("Contraseña actualizada correctamente.");
      setPwdError("");
      setShowPwdModal(false);
      onSubmitSuccess && onSubmitSuccess();
    } catch (err) {
      console.error("Error actualizando contraseña por admin:", err);
      const message =
        err?.response?.data?.error || "Error actualizando la contraseña.";
      setPwdError(message);
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <>
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

        {/* Mostrar campo contraseña: obligatorio en creación, opcional en edición */}
        <Input
          label={user ? "Nueva Contraseña (opcional)" : "Contraseña"}
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required={!user}
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rol
          </label>
          <select
            name="roleId"
            value={formData.roleId}
            onChange={handleChange}
            className={`block w-full px-3 py-2 border ${
              errors.roleId ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          >
            <option value="">Seleccione un rol</option>
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.name}
              </option>
            ))}
          </select>
          {errors.roleId && (
            <p className="mt-1 text-sm text-red-600">{errors.roleId}</p>
          )}
        </div>

        {errors.submit && (
          <p className="text-red-500 text-sm mb-4">{errors.submit}</p>
        )}

        <div className="flex justify-between items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>

            {/* Botón para que Admin cambie contraseña de otro usuario (se muestra solo al editar) */}
            {user && isAdmin && (
              <Button type="button" variant="outline" onClick={openPwdModal}>
                Cambiar contraseña (Admin)
              </Button>
            )}
          </div>

          <div>
            <Button type="submit" loading={loading}>
              Guardar
            </Button>
          </div>
        </div>
      </form>

      {/* Modal simple para cambiar contraseña por Admin */}
      {showPwdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={closePwdModal}
          />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 z-10">
            <h3 className="text-lg font-medium mb-4">
              Cambiar contraseña (Admin)
            </h3>

            {pwdError && (
              <p className="text-sm text-red-600 mb-3">{pwdError}</p>
            )}
            {pwdSuccess && (
              <p className="text-sm text-green-600 mb-3">{pwdSuccess}</p>
            )}

            <form onSubmit={handleAdminPasswordChange}>
              <Input
                label="Nueva contraseña"
                id="newPassword"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={""}
                required
              />
              <Input
                label="Confirmar contraseña"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={""}
                required
              />
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closePwdModal}
                >
                  Cancelar
                </Button>
                <Button type="submit" loading={pwdLoading}>
                  Actualizar contraseña
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserForm;
