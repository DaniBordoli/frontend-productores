import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/rutaycampoLogo.svg';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [inactiveError, setInactiveError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === 'email') setEmailError('');
    if (name === 'password') setPasswordError('');
    setInactiveError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    
    // Validaciones simples de front
    let hasClientError = false;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email || !emailPattern.test(formData.email)) {
      setEmailError('Tu correo es inválido, intentalo nuevamente');
      hasClientError = true;
    }

    if (!formData.password) {
      setPasswordError('Tu contraseña es inválida, intentalo nuevamente');
      hasClientError = true;
    }

    if (hasClientError) {
      return;
    }

    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      if (err.response?.status === 403) {
        setInactiveError(err.response.data.message);
      } else {
        setEmailError('Tu correo es inválido, intentalo nuevamente');
        setPasswordError('Tu contraseña es inválida, intentalo nuevamente');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-300 lg:bg-white lg:flex-row lg:items-center lg:justify-center lg:p-8">
      <div className="flex flex-col flex-1 w-full lg:flex-row lg:flex-none lg:max-w-6xl lg:items-center lg:gap-14 xl:gap-20">

        {/* Top — placeholder image (mobile/tablet) */}
        <div className="flex-1 lg:flex-none w-full lg:w-[520px] xl:w-[580px] lg:h-[660px] xl:h-[720px] lg:rounded-3xl overflow-hidden lg:shadow-lg bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
          <div className="text-gray-600 text-center">
            <p className="text-lg font-semibold">Imagen Placeholder</p>
            <p className="text-sm opacity-75 mt-2">Video o Imagen</p>
          </div>
        </div>

        {/* Bottom/Right — form card */}
        <div className="mt-auto lg:mt-0 h-[428px] lg:h-auto lg:flex-none w-full lg:max-w-lg lg:mx-0 bg-white rounded-t-[24px] lg:rounded-none px-4 py-8 lg:px-0 lg:py-0">

          {/* Logo + heading */}
          <div className="mb-8 lg:mb-10">
            <img src={logo} alt="Ruta y Campo" className="hidden lg:block w-20 h-20 mb-7" />
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">¡Bienvenido!</h1>
            <p className="text-sm lg:text-base text-gray-500">Por favor, inicie sesión para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5 pb-4 lg:pb-0">

            {/* Cuenta inactiva */}
            {inactiveError && (
              <div className="bg-amber-50 border border-amber-300 text-amber-800 px-4 py-3 rounded-2xl text-sm">
                {inactiveError}
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3 lg:gap-4 bg-white rounded-full pl-2 lg:pl-[8px] pr-4 lg:pr-5 py-2 lg:py-[6.5px] shadow-[0_8px_30px_rgba(0,0,0,0.10)] border border-transparent focus-within:border-[#DEDEDE]">
                <div
                  className={`flex items-center justify-center w-10 lg:w-[51px] h-10 lg:h-[51px] rounded-full flex-shrink-0 ${
                    emailError ? 'bg-[#FDEFEE]' : 'bg-[#F6F6F6]'
                  }`}
                >
                  <svg
                    width="16"
                    height="12"
                    viewBox="0 0 20 16"
                    className="lg:w-5 lg:h-4"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.33333 0C1.49238 0 0 1.53502 0 3.42857V12.5714C0 14.465 1.49238 16 3.33333 16H16.6667C18.5076 16 20 14.465 20 12.5714V3.42857C20 1.53502 18.5076 0 16.6667 0H3.33333ZM5.62469 4.21913C5.19343 3.87412 4.56414 3.94404 4.21913 4.37531C3.87412 4.80657 3.94404 5.43586 4.37531 5.78087L9.37531 9.78087L10 10.2806L10.6247 9.78087L15.6247 5.78087C16.056 5.43586 16.1259 4.80657 15.7809 4.37531C15.4359 3.94404 14.8066 3.87412 14.3753 4.21913L10 7.71938L5.62469 4.21913Z"
                      fill={emailError ? '#F35F50' : '#888888'}
                    />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="flex-1 bg-transparent outline-none text-sm lg:text-base text-gray-800 placeholder:text-gray-400"
                  placeholder="Ingresá tu correo"
                />
              </div>
              {emailError && (
                <p className="text-xs text-[#F35F50] px-2">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3 lg:gap-4 bg-white rounded-full pl-2 lg:pl-[8px] pr-4 lg:pr-5 py-2 lg:py-[6.5px] shadow-[0_8px_30px_rgba(0,0,0,0.10)] border border-transparent focus-within:border-[#DEDEDE]">
                <div
                  className={`flex items-center justify-center w-10 lg:w-[51px] h-10 lg:h-[51px] rounded-full flex-shrink-0 ${
                    passwordError ? 'bg-[#FDEFEE]' : 'bg-[#F6F6F6]'
                  }`}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    className="lg:w-6 lg:h-6"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8 6C8 3.79086 9.79086 2 12 2C14.2091 2 16 3.79086 16 6V10H14V6C14 4.89543 13.1046 4 12 4C10.8954 4 10 4.89543 10 6V10H8V6Z"
                      fill={passwordError ? '#F35F50' : '#888888'}
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8 9C5.79086 9 4 10.7909 4 13V18C4 20.2091 5.79086 22 8 22H16C18.2091 22 20 20.2091 20 18V13C20 10.7909 18.2091 9 16 9H8Z"
                      fill={passwordError ? '#F35F50' : '#888888'}
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="flex-1 bg-transparent outline-none text-sm lg:text-base text-gray-800 placeholder:text-gray-400"
                  placeholder="Ingresá tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex items-center justify-center w-8 lg:w-10 h-8 lg:h-10 text-gray-600 hover:text-gray-800 flex-shrink-0 transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 lg:w-5 h-4 lg:h-5" /> : <Eye className="w-4 lg:w-5 h-4 lg:h-5" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-xs text-[#F35F50] px-2">{passwordError}</p>
              )}
            </div>

            {/* Remember me + forgot password */}
            <div className="flex items-center justify-between pt-1">
              <label className="inline-flex items-center gap-2 text-xs lg:text-sm text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                />
                <span>Recuérdame</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-xs lg:text-sm font-medium text-[#45845C] underline hover:text-[#45845C] transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#37784C] to-[#5F9C73] hover:opacity-90 active:opacity-95 text-white py-3 lg:py-4 rounded-full text-sm lg:text-base font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
