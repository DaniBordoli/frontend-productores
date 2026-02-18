import { useReducer } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Truck, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const initialState = { showPassword: false, showConfirmPassword: false, newPassword: '', confirmPassword: '', loading: false, error: '', success: false };
function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_SHOW_PASSWORD': return { ...state, showPassword: !state.showPassword };
    case 'TOGGLE_SHOW_CONFIRM': return { ...state, showConfirmPassword: !state.showConfirmPassword };
    case 'SET_FIELD': return { ...state, [action.field]: action.payload };
    case 'SUBMIT': return { ...state, loading: true, error: '' };
    case 'SUCCESS': return { ...state, loading: false, success: true };
    case 'ERROR': return { ...state, loading: false, error: action.payload };
    default: return state;
  }
}

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { showPassword, showConfirmPassword, newPassword, confirmPassword, loading, error, success } = state;
  const formData = { newPassword, confirmPassword };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      dispatch({ type: 'ERROR', payload: 'Las contraseñas no coinciden' });
      return;
    }

    if (formData.newPassword.length < 6) {
      dispatch({ type: 'ERROR', payload: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    dispatch({ type: 'SUBMIT' });
    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword: formData.newPassword
      });
      dispatch({ type: 'SUCCESS' });
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      dispatch({ type: 'ERROR', payload: err.response?.data?.message || 'Error al restablecer la contraseña' });
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Contraseña actualizada!</h2>
          <p className="text-gray-600 mb-6">
            Tu contraseña ha sido actualizada exitosamente. Serás redirigido al inicio de sesión...
          </p>
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Ir al inicio de sesión
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Restablecer Contraseña</h1>
          <p className="text-gray-600">
            Ingresa tu nueva contraseña
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="reset-new-password" className="block text-sm font-medium text-gray-700 mb-2">
              Nueva Contraseña
            </label>
            <div className="relative">
              <input
                id="reset-new-password"
                type={showPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'newPassword', payload: e.target.value })}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                onClick={() => dispatch({ type: 'TOGGLE_SHOW_PASSWORD' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="reset-confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <input
                id="reset-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'confirmPassword', payload: e.target.value })}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Repite la contraseña"
              />
              <button
                type="button"
                onClick={() => dispatch({ type: 'TOGGLE_SHOW_CONFIRM' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
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
