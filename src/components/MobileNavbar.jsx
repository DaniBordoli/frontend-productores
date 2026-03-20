import { useState } from 'react';
import { X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '../assets/Menu.svg';
import SidebarIcon from '../assets/SidebarIcon.svg';
import rutaycampoLogo from '../assets/rutaycampoLogo.svg';
import UserSidebarIcon from '../assets/UserSidebar.svg';
import { useAuth } from '../context/AuthContext';

export const MobileNavbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: 'dashboard', label: 'Dashboard' },
    { path: '/viajes', icon: 'viajes', label: 'Viajes' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-[#DEDEDE] transform transition-transform z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <img src={rutaycampoLogo} alt="Ruta y Campo" className="h-10 w-auto" />
          </div>

          <nav className="flex-1 px-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                  isActive(item.path)
                    ? 'bg-[#DEEDE0] text-[#45845C]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-[#DEDEDE]">
            <Link
              to="/perfil"
              className="flex items-center gap-3 mb-3 group cursor-pointer"
              onClick={() => setSidebarOpen(false)}
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <img src={UserSidebarIcon} alt="Usuario" className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.nombre || user?.email}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.rol}</p>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Header - Mobile only */}
      <header className="md:hidden bg-[#FDFDFD] border-b border-[#DEDEDE] relative z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {sidebarOpen
              ? <X className="w-6 h-6 text-gray-600" />
              : <img src={MenuIcon} alt="Abrir menú" className="w-6 h-6" />
            }
          </button>

          <div className="flex items-center gap-4">
            <img src={rutaycampoLogo} alt="Ruta y Campo" className="h-10 w-auto" />
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          role="presentation"
          className="fixed top-[72px] left-0 right-0 bottom-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};
