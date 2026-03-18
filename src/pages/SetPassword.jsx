import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import logo from '../assets/rutaycampoLogo.svg';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const LockIcon = ({ error }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" className="lg:w-6 lg:h-6" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M8 6C8 3.79086 9.79086 2 12 2C14.2091 2 16 3.79086 16 6V10H14V6C14 4.89543 13.1046 4 12 4C10.8954 4 10 4.89543 10 6V10H8V6Z" fill={error ? '#F35F50' : '#888888'} />
    <path fillRule="evenodd" clipRule="evenodd" d="M8 9C5.79086 9 4 10.7909 4 13V18C4 20.2091 5.79086 22 8 22H16C18.2091 22 20 20.2091 20 18V13C20 10.7909 18.2091 9 16 9H8Z" fill={error ? '#F35F50' : '#888888'} />
  </svg>
);

export function SetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenStatus, setTokenStatus] = useState('validating'); // 'validating' | 'valid' | 'invalid'
  const [tokenError, setTokenError] = useState('');

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenStatus('invalid');
        setTokenError('El enlace no contiene un token válido.');
        return;
      }
      try {
        await axios.get(`${API_URL}/auth/validate-invitation/${token}`);
        setTokenStatus('valid');
      } catch (err) {
        setTokenStatus('invalid');
        if (!err.response) {
          setTokenError('No se pudo conectar con el servidor. Intentá de nuevo en unos minutos.');
        } else {
          setTokenError(err.response?.data?.message || 'El enlace de invitación es inválido o ya expiró.');
        }
      }
    };
    validateToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setConfirmError('');

    let hasError = false;
    if (!password || password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      hasError = true;
    }
    if (!confirmPassword) {
      setConfirmError('Confirmá tu contraseña');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmError('Las contraseñas no coinciden');
      hasError = true;
    }
    if (hasError) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/set-password`, { token, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Error al configurar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (tokenStatus === 'validating') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-300 lg:bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#45845C]" />
          <p className="text-sm text-gray-500">Verificando enlace...</p>
        </div>
      </div>
    );
  }

  if (tokenStatus === 'invalid') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-300 lg:bg-white lg:flex-row lg:items-center lg:justify-center lg:p-8">
        <div className="flex flex-col flex-1 w-full lg:flex-row lg:flex-none lg:max-w-6xl lg:items-center lg:gap-14 xl:gap-20">
          <div className="flex-1 lg:flex-none w-full lg:w-[520px] xl:w-[580px] lg:h-[660px] xl:h-[720px] lg:rounded-3xl overflow-hidden lg:shadow-lg bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
            <div className="text-gray-600 text-center">
              <p className="text-lg font-semibold">Imagen Placeholder</p>
              <p className="text-sm opacity-75 mt-2">Video o Imagen</p>
            </div>
          </div>
          <div className="mt-auto lg:mt-0 lg:h-auto lg:flex-none w-full lg:max-w-lg lg:mx-0 bg-white rounded-t-[24px] lg:rounded-none px-4 py-8 lg:px-0 lg:py-0">
            <div className="mb-8 lg:mb-10">
              <img src={logo} alt="Ruta y Campo" className="hidden lg:block w-20 h-20 mb-7" />
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Enlace inválido</h1>
              <p className="text-sm lg:text-base text-gray-500">{tokenError}</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="w-full bg-[#FDEFEE] rounded-2xl px-4 py-4 flex items-start gap-3">
                <svg className="w-5 h-5 text-[#F35F50] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <p className="text-sm text-[#F35F50]">Los enlaces de invitación expiran a los 7 días. Contactá al administrador para recibir uno nuevo.</p>
              </div>
              <Link
                to="/login"
                className="w-full text-center bg-gradient-to-r from-[#37784C] to-[#5F9C73] hover:opacity-90 text-white py-3 lg:py-4 rounded-full text-sm lg:text-base font-semibold tracking-wide transition-opacity"
              >
                Ir al inicio de sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-300 lg:bg-white lg:flex-row lg:items-center lg:justify-center lg:p-8">
      <div className="flex flex-col flex-1 w-full lg:flex-row lg:flex-none lg:max-w-6xl lg:items-center lg:gap-14 xl:gap-20">

        {/* Left — placeholder image */}
        <div className="flex-1 lg:flex-none w-full lg:w-[520px] xl:w-[580px] lg:h-[660px] xl:h-[720px] lg:rounded-3xl overflow-hidden lg:shadow-lg bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
          <div className="text-gray-600 text-center">
            <p className="text-lg font-semibold">Imagen Placeholder</p>
            <p className="text-sm opacity-75 mt-2">Video o Imagen</p>
          </div>
        </div>

        {/* Right — form card */}
        <div className="mt-auto lg:mt-0 lg:h-auto lg:flex-none w-full lg:max-w-lg lg:mx-0 bg-white rounded-t-[24px] lg:rounded-none px-4 py-8 lg:px-0 lg:py-0">

          {/* Logo + heading */}
          <div className="mb-8 lg:mb-10">
            <img src={logo} alt="Ruta y Campo" className="hidden lg:block w-20 h-20 mb-7" />
            {success ? (
              <>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">¡Contraseña configurada!</h1>
                <p className="text-sm lg:text-base text-gray-500">Tu cuenta fue activada. Redirigiendo al inicio...</p>
              </>
            ) : (
              <>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Configurá tu contraseña</h1>
                <p className="text-sm lg:text-base text-gray-500">Bienvenido a Ruta y Campo. Elegí una contraseña para acceder al portal.</p>
              </>
            )}
          </div>

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5 pb-4 lg:pb-0">

              {/* Nueva contraseña */}
              <div className="flex flex-col gap-1">
                <div className={`flex items-center gap-3 lg:gap-4 bg-white rounded-full pl-2 lg:pl-[8px] pr-4 lg:pr-5 py-2 lg:py-[6.5px] shadow-[0_8px_30px_rgba(0,0,0,0.10)] border border-transparent focus-within:border-[#DEDEDE]`}>
                  <div className={`flex items-center justify-center w-10 lg:w-[51px] h-10 lg:h-[51px] rounded-full flex-shrink-0 ${passwordError ? 'bg-[#FDEFEE]' : 'bg-[#F6F6F6]'}`}>
                    <LockIcon error={passwordError} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                    className="flex-1 bg-transparent outline-none text-sm lg:text-base text-gray-800 placeholder:text-gray-400"
                    placeholder="Nueva contraseña"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex items-center justify-center w-8 lg:w-10 h-8 lg:h-10 text-gray-600 hover:text-gray-800 flex-shrink-0 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 lg:w-5 h-4 lg:h-5" /> : <Eye className="w-4 lg:w-5 h-4 lg:h-5" />}
                  </button>
                </div>
                {passwordError && <p className="text-xs text-[#F35F50] px-2">{passwordError}</p>}
              </div>

              {/* Confirmar contraseña */}
              <div className="flex flex-col gap-1">
                <div className={`flex items-center gap-3 lg:gap-4 bg-white rounded-full pl-2 lg:pl-[8px] pr-4 lg:pr-5 py-2 lg:py-[6.5px] shadow-[0_8px_30px_rgba(0,0,0,0.10)] border border-transparent focus-within:border-[#DEDEDE]`}>
                  <div className={`flex items-center justify-center w-10 lg:w-[51px] h-10 lg:h-[51px] rounded-full flex-shrink-0 ${confirmError ? 'bg-[#FDEFEE]' : 'bg-[#F6F6F6]'}`}>
                    <LockIcon error={confirmError} />
                  </div>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setConfirmError(''); }}
                    className="flex-1 bg-transparent outline-none text-sm lg:text-base text-gray-800 placeholder:text-gray-400"
                    placeholder="Repetí tu contraseña"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="flex items-center justify-center w-8 lg:w-10 h-8 lg:h-10 text-gray-600 hover:text-gray-800 flex-shrink-0 transition-colors focus:outline-none"
                  >
                    {showConfirm ? <EyeOff className="w-4 lg:w-5 h-4 lg:h-5" /> : <Eye className="w-4 lg:w-5 h-4 lg:h-5" />}
                  </button>
                </div>
                {confirmError && <p className="text-xs text-[#F35F50] px-2">{confirmError}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#37784C] to-[#5F9C73] hover:opacity-90 active:opacity-95 text-white py-3 lg:py-4 rounded-full text-sm lg:text-base font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? 'Configurando...' : 'Configurar contraseña'}
              </button>

              <div className="text-center pt-1">
                <Link to="/login" className="text-xs lg:text-sm font-medium text-[#45845C] underline hover:text-[#45845C] transition-colors">
                  ¿Ya tenés una cuenta? Iniciá sesión
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
