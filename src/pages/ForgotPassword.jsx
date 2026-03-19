import { useReducer } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import zoomInIcon from '../assets/zoomIn.svg';
import MailFilledIcon from '../assets/MailFilled.svg';

// ── PillInput helper (consistent with other modals) ────────────────────────────
const PillInput = ({ label, icon, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      <span className="absolute left-[8px] top-1/2 -translate-y-1/2 flex items-center justify-center bg-[#F6F6F6] rounded-full w-[51px] h-[51px] z-10 pointer-events-none">
        {icon}
      </span>
      {children}
    </div>
  </div>
);

const pillClass = "w-full pl-[67px] pr-4 h-16 border border-transparent rounded-full bg-white focus:outline-none focus:border-[#DEDEDE] text-base text-gray-700 placeholder-[#B0B0B0]";
const pillStyle = { boxShadow: '0px 1px 34px 0px #10182814' };

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
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F1F8F3' }}>
        <div className="bg-white w-full max-w-md px-6 py-8" style={{ width: 472, borderRadius: 20, boxShadow: '0px 1px 34px 0px #10182814' }}>
          <div className="text-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full mb-4 mx-auto" style={{ background: '#F6F6F6' }}>
              <img src={MailFilledIcon} alt="" className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Revisá tu mail</h2>
            <p className="text-gray-600">
              Hemos enviado las instrucciones para recuperar tu contraseña a {email}
            </p>
          </div>

          {resetToken && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-xs font-semibold text-yellow-800 mb-2">
                🔧 Modo Desarrollo - Token de recuperación:
              </p>
              <Link
                to={`/reset-password/${resetToken}`}
                className="text-sm text-green-600 hover:text-green-700 underline break-all"
              >
                Ir a resetear contraseña
              </Link>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full px-6 font-medium text-sm text-white hover:opacity-90 transition-opacity"
              style={{ height: 48, background: 'linear-gradient(135deg, #37784C 0%, #5F9C73 100%)', borderRadius: 80, boxShadow: '0px 1px 34px 0px #10182814' }}
            >
              {loading ? 'Enviando...' : 'Reenviar mail'}
            </button>

            <Link
              to="/login"
              className="flex items-center justify-center w-full px-6 font-medium text-sm text-gray-700 bg-white border border-[#DEDEDE] hover:bg-gray-50 transition-colors"
              style={{ height: 48, borderRadius: 80, boxShadow: '0px 1px 34px 0px #10182814' }}
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F1F8F3' }}>
      <div className="bg-white w-full max-w-md px-6 py-8" style={{ width: 472, borderRadius: 20, boxShadow: '0px 1px 34px 0px #10182814' }}>
        <div className="text-center mb-6">
          <div className="flex items-center justify-center w-20 h-20 rounded-full mb-4 mx-auto" style={{ background: '#F6F6F6' }}>
            <img src={zoomInIcon} alt="" className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">¿Olvidaste tu contraseña?</h1>
          <p className="text-gray-600 mb-6">
            Ingresá tu mail y te enviaremos las instrucciones para recuperarla
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <PillInput
            label="Mail"
            icon={<img src={MailFilledIcon} alt="" className="w-5 h-5" />}
          >
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => dispatch({ type: 'SET_EMAIL', payload: e.target.value })}
              required
              className={pillClass}
              style={pillStyle}
              placeholder="rutaycampo@gmail.com"
            />
          </PillInput>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 font-medium text-sm text-white hover:opacity-90 transition-opacity"
            style={{ height: 48, background: 'linear-gradient(135deg, #37784C 0%, #5F9C73 100%)', borderRadius: 80, boxShadow: '0px 1px 34px 0px #10182814' }}
          >
            {loading ? 'Enviando...' : 'Enviar instrucciones'}
          </button>
        </form>

        <div className="mt-4">
          <Link
            to="/login"
            className="flex items-center justify-center w-full px-6 font-medium text-sm text-gray-700 bg-white border border-[#DEDEDE] hover:bg-gray-50 transition-colors"
            style={{ height: 48, borderRadius: 80, boxShadow: '0px 1px 34px 0px #10182814' }}
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
};
