import { useReducer } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const initialState = { password: '', confirmPassword: '', showPassword: false, showConfirmPassword: false, loading: false, error: '', success: false };
function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD': return { ...state, [action.field]: action.payload };
    case 'TOGGLE_SHOW_PASSWORD': return { ...state, showPassword: !state.showPassword };
    case 'TOGGLE_SHOW_CONFIRM': return { ...state, showConfirmPassword: !state.showConfirmPassword };
    case 'SUBMIT': return { ...state, loading: true, error: '' };
    case 'SUCCESS': return { ...state, loading: false, success: true };
    case 'ERROR': return { ...state, loading: false, error: action.payload };
    default: return state;
  }
}

export function SetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { password, confirmPassword, showPassword, showConfirmPassword, loading, error, success } = state;

  const validatePassword = () => {
    if (password.length < 6) {
      dispatch({ type: 'ERROR', payload: 'La contraseña debe tener al menos 6 caracteres' });
      return false;
    }
    if (password !== confirmPassword) {
      dispatch({ type: 'ERROR', payload: 'Las contraseñas no coinciden' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    dispatch({ type: 'SUBMIT' });
    try {
      const response = await axios.post(`${API_URL}/auth/set-password`, {
        token,
        password
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      dispatch({ type: 'SUCCESS' });
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      dispatch({ type: 'ERROR', payload: err.response?.data?.message || 'Error al configurar la contraseña' });
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Contraseña configurada!
          </h2>
          <p className="text-gray-600 mb-4">
            Tu cuenta ha sido activada exitosamente. Serás redirigido al dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configura tu Contraseña
          </h1>
          <p className="text-gray-600">
            Bienvenido a Ruta y Campo. Por favor, configura tu contraseña para acceder a la plataforma.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Nueva Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'password', payload: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
                placeholder="Mínimo 6 caracteres"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => dispatch({ type: 'TOGGLE_SHOW_PASSWORD' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Debe tener al menos 6 caracteres
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'confirmPassword', payload: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
                placeholder="Repite tu contraseña"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => dispatch({ type: 'TOGGLE_SHOW_CONFIRM' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Configurando...' : 'Configurar Contraseña'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tenés una cuenta?{' '}
            <a href="/login" className="text-green-600 hover:text-green-700 font-medium">
              Iniciar Sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
