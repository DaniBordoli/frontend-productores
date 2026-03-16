import { useState } from 'react';
import { Eye, EyeOff, User, Phone, Mail, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const MiPerfil = () => {
  const { user, updateUser } = useAuth();

  const [profileForm, setProfileForm] = useState({
    nombre: user?.nombre || '',
    telefono: user?.telefono || '+54 ',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (name === 'telefono') {
      const prefix = '+54 ';
      const ensured = value.startsWith(prefix) ? value : prefix + value.replace(/^\+54\s?/, '');
      setProfileForm((prev) => ({ ...prev, telefono: ensured }));
      setProfileError('');
      setProfileSuccess('');
      return;
    }
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    setProfileError('');
    setProfileSuccess('');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileForm.nombre.trim()) {
      setProfileError('El nombre no puede estar vacío');
      return;
    }
    setProfileLoading(true);
    try {
      const response = await api.patch('/auth/profile', {
        nombre: profileForm.nombre,
        telefono: profileForm.telefono,
      });
      if (response.data.user) {
        updateUser(response.data.user);
      }
      setProfileSuccess('Perfil actualizado correctamente');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      setPasswordError('Ingresá tu contraseña actual');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }
    setPasswordLoading(true);
    try {
      await api.patch('/auth/profile', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordSuccess('Contraseña actualizada correctamente');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Mi perfil</h1>
        <p className="text-sm text-gray-500 mt-1">Administrá tu información personal y contraseña</p>
      </div>

      {/* Avatar + info */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#DEDEDE] p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#DEEDE0] flex items-center justify-center flex-shrink-0">
          <User className="w-8 h-8 text-[#45845C]" />
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-900">{user?.nombre || '—'}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-[#DEEDE0] text-[#45845C] capitalize">
            {user?.rol}
          </span>
        </div>
      </div>

      {/* Datos personales */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#DEDEDE] p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Datos personales</h2>

        <form onSubmit={handleProfileSubmit} className="space-y-4">

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <div className="flex items-center gap-3 bg-[#F6F6F6] rounded-full px-4 py-3">
              <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-500">{user?.email}</span>
            </div>
          </div>

          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo
            </label>
            <div className="flex items-center gap-3 bg-white rounded-full pl-4 pr-5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-transparent focus-within:border-[#DEDEDE]">
              <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={profileForm.nombre}
                onChange={handleProfileChange}
                className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
                placeholder="Tu nombre"
                required
              />
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <div className="flex items-center gap-3 bg-white rounded-full pl-4 pr-5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-transparent focus-within:border-[#DEDEDE]">
              <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                id="telefono"
                name="telefono"
                type="tel"
                value={profileForm.telefono}
                onChange={handleProfileChange}
                className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
                placeholder="Ej: +54 9 11 1234-5678"
              />
            </div>
          </div>

          {profileError && (
            <p className="text-xs text-[#F35F50] px-1">{profileError}</p>
          )}
          {profileSuccess && (
            <div className="flex items-center gap-2 text-xs text-[#45845C] px-1">
              <CheckCircle className="w-4 h-4" />
              <span>{profileSuccess}</span>
            </div>
          )}

          <div className="pt-1">
            <button
              type="submit"
              disabled={profileLoading}
              className="w-full text-white py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #37784C 0%, #5F9C73 100%)' }}
            >
              {profileLoading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>

      {/* Cambiar contraseña */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#DEDEDE] p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Cambiar contraseña</h2>
        <p className="text-xs text-gray-500 mb-5">Dejá los campos en blanco si no querés cambiar tu contraseña</p>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">

          {/* Contraseña actual */}
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña actual
            </label>
            <div className="flex items-center gap-3 bg-white rounded-full pl-4 pr-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-transparent focus-within:border-[#DEDEDE]">
              <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                id="currentPassword"
                name="currentPassword"
                type={showCurrent ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
                placeholder="Tu contraseña actual"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Nueva contraseña */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Nueva contraseña
            </label>
            <div className="flex items-center gap-3 bg-white rounded-full pl-4 pr-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-transparent focus-within:border-[#DEDEDE]">
              <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                id="newPassword"
                name="newPassword"
                type={showNew ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirmar nueva contraseña */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar nueva contraseña
            </label>
            <div className="flex items-center gap-3 bg-white rounded-full pl-4 pr-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-transparent focus-within:border-[#DEDEDE]">
              <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
                placeholder="Repetí la nueva contraseña"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {passwordError && (
            <p className="text-xs text-[#F35F50] px-1">{passwordError}</p>
          )}
          {passwordSuccess && (
            <div className="flex items-center gap-2 text-xs text-[#45845C] px-1">
              <CheckCircle className="w-4 h-4" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          <div className="pt-1">
            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full text-white py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #37784C 0%, #5F9C73 100%)' }}
            >
              {passwordLoading ? 'Actualizando...' : 'Cambiar contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
