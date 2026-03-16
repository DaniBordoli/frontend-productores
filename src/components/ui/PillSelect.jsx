import { useState, useRef, useEffect, Children } from 'react';
import { ChevronDown } from 'lucide-react';

const SCROLLBAR_STYLE = `
.pill-select-list::-webkit-scrollbar { width: 6px; }
.pill-select-list::-webkit-scrollbar-track { background: transparent; }
.pill-select-list::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #37784C, #5F9C73);
  border-radius: 99px;
}
`;

function ScrollbarStyles() {
  return <style>{SCROLLBAR_STYLE}</style>;
}

export const PillSelect = ({ icon, error, children, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const options = Children.toArray(children)
    .filter(child => child.type === 'option')
    .map(child => ({ value: child.props.value, label: child.props.children }));

  const selectedLabel = options.find(o => o.value === value)?.label ?? '';

  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    onChange?.({ target: { value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger pill */}
      <button
        type="button"
        onClick={() => setIsOpen(v => !v)}
        className={`w-full flex items-center gap-3 bg-white rounded-full pl-[6px] pr-4 py-[6px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] border ${
          error ? 'border-[#F35F50]' : isOpen ? 'border-[#DEDEDE]' : 'border-transparent'
        }`}
      >
        <div className={`flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0 ${error ? 'bg-[#FDEFEE]' : 'bg-[#F6F6F6]'}`}>
          <span style={{ color: error ? '#F35F50' : '#888888' }}>{icon}</span>
        </div>
        <span className={`flex-1 text-left text-sm ${value ? 'text-gray-800' : 'text-gray-400'}`}>
          {selectedLabel || 'Seleccionar'}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown list */}
      {isOpen && (
        <>
          <ScrollbarStyles />
          <div
            className="pill-select-list absolute left-0 right-0 z-50 bg-white overflow-y-auto"
            style={{ borderRadius: '24px', marginTop: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.10)', maxHeight: '208px' }}
          >
          {options.map((option, i) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className="w-full text-left px-5 py-3.5 text-sm text-gray-800 transition-colors"
              style={{
                background: option.value === value ? '#F1F8F3' : 'transparent',
                borderBottom: i < options.length - 1 ? '1px solid #EFEBF1' : 'none',
              }}
            >
              {option.label}
            </button>
          ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PillSelect;
