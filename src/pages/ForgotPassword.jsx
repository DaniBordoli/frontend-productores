import { useReducer } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Truck } from 'lucide-react';
import api from '../services/api';

const initialState = { email: '', loading: false, error: '', success: false, resetToken: '' };
function reducer(state, action) {
  switch (action.type) {
    case 'SET_EMAIL': return { ...state, email: action.payload };
    case 'SUBMIT': return { ...state, loading: true, error: '' };
    case 'SUCCESS': return { ...state, loading: false, success: true, resetToken: action.payload };
    case 'ERROR': return { ...state, loading: false, error: action.payload };
    default: return state;
  }
}

export const ForgotPassword = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { email, loading, error, success, resetToken } = state;

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'SUBMIT' });
    try {
      const response = await api.post('/auth/forgot-password', { email });
      dispatch({ type: 'SUCCESS', payload: response.data.resetToken });
    } catch (err) {
      dispatch({ type: 'ERROR', payload: err.response?.data?.message || 'Error al solicitar recuperación' });
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Revisa tu Email</h2>
            <p className="text-gray-600">
              Hemos enviado las instrucciones para recuperar tu contraseña a <strong>{email}</strong>
            </p>
          </div>

          {resetToken && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-xs font-semibold text-yellow-800 mb-2">
                🔧 Modo Desarrollo - Token de recuperación:
              </p>
              <Link
                to={`/reset-password/${resetToken}`}
                className="text-sm text-blue-600 hover:text-blue-700 underline break-all"
              >
                Ir a resetear contraseña
              </Link>
            </div>
          )}

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">¿Olvidaste tu contraseña?</h1>
          <p className="text-gray-600">
            Ingresa tu email y te enviaremos instrucciones para recuperarla
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => dispatch({ type: 'SET_EMAIL', payload: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="tu@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Enviando...' : 'Enviar instrucciones'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
};
