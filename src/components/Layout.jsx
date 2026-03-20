import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { X, LogOut, ChevronRight } from 'lucide-react';
import UserSidebarIcon from '../assets/UserSidebar.svg';
import SidebarIcon from '../assets/SidebarIcon.svg';
import logo from '../assets/Logo.svg';
import MenuIcon from '../assets/Menu.svg';
import rutaycampoLogo from '../assets/rutaycampoLogo.svg';

const menuItems = [
  { path: '/', icon: 'dashboard', label: 'Dashboard' },
  { path: '/viajes', icon: 'viajes', label: 'Viajes' },
];

export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderIcon = (icon, isActive) => {
    const color = isActive ? '#45845C' : '#888888';

    switch (icon) {
      case 'dashboard':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M13 9C10.7909 9 9 10.7909 9 13V18C9 20.2091 10.7909 22 13 22H18C20.2091 22 22 20.2091 22 18V13C22 10.7909 20.2091 9 18 9H13Z" fill={color} />
            <path fillRule="evenodd" clipRule="evenodd" d="M6 2C3.79086 2 2 3.79086 2 6V11C2 13.3689 3.7613 15 6 15C6.55228 15 7 14.5523 7 14V13C7 9.68629 9.68629 7 13 7H14C14.5523 7 15 6.55228 15 6C15 3.7613 13.3689 2 11 2H6Z" fill={color} />
          </svg>
        );
      case 'perfil':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4ZM6 8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8C18 11.3137 15.3137 14 12 14C8.68629 14 6 11.3137 6 8Z" fill={color} />
            <path fillRule="evenodd" clipRule="evenodd" d="M4 20C4 17.2386 6.23858 15 9 15H15C17.7614 15 20 17.2386 20 20V22H18V20C18 18.3431 16.6569 17 15 17H9C7.34315 17 6 18.3431 6 20V22H4V20Z" fill={color} />
          </svg>
        );
      case 'viajes':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M12.5742 21.8187C12.2295 22.0604 11.7699 22.0601 11.4253 21.8184L11.4228 21.8166L11.4172 21.8127L11.3986 21.7994C11.3829 21.7882 11.3607 21.7722 11.3325 21.7517C11.2762 21.7106 11.1956 21.6511 11.0943 21.5741C10.8917 21.4203 10.6058 21.1962 10.2641 20.9101C9.58227 20.3389 8.67111 19.5139 7.75692 18.4988C5.96368 16.5076 4 13.6105 4 10.3636C4 8.16134 4.83118 6.0397 6.32548 4.46777C7.82141 2.89413 9.86146 2 12 2C14.1385 2 16.1786 2.89413 17.6745 4.46777C19.1688 6.0397 20 8.16134 20 10.3636C20 13.6105 18.0363 16.5076 16.2431 18.4988C15.3289 19.5139 14.4177 20.3389 13.7359 20.9101C13.3942 21.1962 13.1083 21.4203 12.9057 21.5741C12.8044 21.6511 12.7238 21.7106 12.6675 21.7517C12.6393 21.7722 12.6171 21.7882 12.6014 21.7994L12.5828 21.8127L12.5772 21.8166L12.5754 21.8179L12.5742 21.8187ZM9 10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10C15 11.6569 13.6569 13 12 13C10.3431 13 9 11.6569 9 10Z" fill={color} />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6]">
      {/* Sidebar */}
      <aside
        className={`fixed top-[72px] md:top-0 left-0 z-[60] h-[calc(100vh-72px)] md:h-screen transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white border-r border-gray-200 w-[85%] md:w-64`}
      >
        <div className="h-full flex flex-col">
          {/* Logo - desktop only */}
          <div className="hidden md:flex p-4 items-center justify-between">
            <img src={logo} alt="Ruta y Campo" className="h-10 w-auto" />
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 mx-4 px-4 py-4 rounded-[16px] transition-colors font-medium ${
                    isActive
                      ? 'bg-[#DEEDE0] text-[#45845C]'
                      : 'text-[#7A7A7A] hover:bg-gray-50'
                  }`}
                >
                  {renderIcon(item.icon, isActive)}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200">
            <Link
              to="/perfil"
              className="flex items-center gap-3 mb-3 group cursor-pointer"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <img src={UserSidebarIcon} alt="Usuario" className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.nombre || user?.email}
                  </p>
                  <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-gray-500 capitalize">{user?.rol}</p>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`${sidebarOpen ? 'md:ml-64' : ''} transition-all`}>
        {/* Header */}
        <header className="bg-[#FDFDFD] border-b border-[#DEDEDE] relative z-50">
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {/* Mobile: X cuando abierto, Menu cuando cerrado */}
              {sidebarOpen
                ? <X className="w-6 h-6 text-gray-600 md:hidden" />
                : <img src={MenuIcon} alt="Abrir menú" className="w-6 h-6 md:hidden" />
              }
              {/* Desktop: siempre SidebarIcon */}
              <img src={SidebarIcon} alt="Toggle sidebar" className="w-5 h-5 hidden md:block" />
            </button>

            <div className="flex items-center gap-4">
              {/* Desktop: date */}
              <span className="hidden md:block text-sm text-gray-600">
                {(() => {
                  const d = new Date().toLocaleDateString('es-AR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  });
                  return d.charAt(0).toUpperCase() + d.slice(1);
                })()}
              </span>
              {/* Mobile: logo on the right */}
              <img src={rutaycampoLogo} alt="Ruta y Campo" className="h-10 w-auto md:hidden" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6 bg-[#F6F6F6]">{children}</main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          role="presentation"
          className="fixed top-[72px] md:top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
