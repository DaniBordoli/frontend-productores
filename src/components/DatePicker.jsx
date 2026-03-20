import { useState, useRef, useEffect } from 'react';
import CalendarIcon from '../assets/Calendar.svg';

const DatePicker = ({ label, value, onChange, placeholder = 'Seleccionar fecha', required, icon, name = 'licenseExpiry' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const dropdownRef = useRef(null);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    
    return days;
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateSelect = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    onChange({ target: { name: name, value: formattedDate } });
    setIsOpen(false);
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateSelected = (date) => {
    if (!value) return false;
    const [year, month, day] = value.split('-').map(Number);
    return date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day;
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-').map(Number);
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const days = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const emptyDays = Array(firstDay).fill(null);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 bg-white rounded-full pl-[6px] pr-4 py-[6px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-transparent focus:outline-none"
      >
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#F6F6F6] flex-shrink-0">
          <img src={CalendarIcon} alt="Calendar" className="w-4 h-4" />
        </div>
        <span className={`flex-1 text-left text-sm ${value ? 'text-gray-800' : 'text-gray-400'}`}>
          {formatDisplayDate(value) || placeholder}
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <path d="M6 9L12 15L18 9" stroke="#363636" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {isOpen && (
        <div 
          className="absolute top-full mt-2 bg-white rounded-3xl p-6 z-50 w-full"
          style={{ boxShadow: '0px 1px 34px 0px #10182814' }}
        >
          {/* Header con navegacion */}
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="#363636" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h3 className="text-lg font-semibold text-gray-900">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="#363636" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Dias de la semana */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-medium text-[#9B9B9B]">
                {day}
              </div>
            ))}
          </div>

          {/* Grid de dias */}
          <div className="grid grid-cols-7 gap-2">
            {emptyDays.map((_, index) => (
              <div key={`empty-${index}`} />
            ))}
            {days.map((date, index) => {
              const disabled = isDateDisabled(date);
              const selected = isDateSelected(date);
              
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => !disabled && handleDateSelect(date)}
                  disabled={disabled}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                    ${disabled ? 'text-[#7D7D7D] cursor-not-allowed' : 'text-[#363636] hover:bg-gray-100 cursor-pointer'}
                    ${selected ? 'bg-[#EDF8F0] text-[#45845C]' : ''}
                  `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
