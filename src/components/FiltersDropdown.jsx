import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import Sliders from '../assets/Sliders.svg';
import CheckCircleIcon from '../assets/CheckCircle.svg';

export const FiltersDropdown = ({ sections = [], values = {}, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const activeCount = sections.filter((s) => values[s.key] && values[s.key] !== '').length;

  const activeChips = sections.flatMap((section) => {
    const activeValue = values[section.key];
    if (!activeValue) return [];
    const option = section.options.find((o) => o.value === activeValue);
    if (!option) return [];
    return [{ sectionKey: section.key, label: option.label }];
  });

  return (
    <>
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center gap-2 border bg-white text-gray-700 font-medium w-12 md:w-[140px]"
        style={{
          borderRadius: 80,
          height: 48,
          borderColor: '#DEDEDE',
        }}
      >
        <img src={Sliders} alt="Filtros" className="w-5 h-5" />
        <span className="hidden md:inline">Filtros</span>
        {activeCount > 0 && (
          <span
            className="hidden md:inline-flex"
            style={{
              minWidth: 20,
              height: 20,
              borderRadius: '50%',
              background: '#DEEDE0',
              color: '#326947',
              fontSize: 11,
              fontWeight: 700,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: -2,
              padding: '0 4px',
            }}
          >
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 md:left-0 md:right-auto top-[56px] z-50 bg-white rounded-2xl shadow-lg border border-[#EBEBEB] w-[calc(100vw-32px)] md:w-auto md:min-w-[360px]"
          style={{ padding: '20px 24px' }}
        >
          {sections.map((section, idx) => (
            <div key={section.key}>
              {idx > 0 && <hr className="my-4 border-[#F0F0F0]" />}
              <p className="text-sm font-semibold text-gray-900 mb-3">{section.label}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {section.options.map((opt) => {
                  const checked = (values[section.key] ?? '') === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 select-none"
                    >
                      <span
                        onClick={() => onChange(section.key, checked ? '' : opt.value)}
                        style={{
                          width: 20,
                          height: 20,
                          flexShrink: 0,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {checked ? (
                          <img src={CheckCircleIcon} alt="selected" style={{ width: 20, height: 20 }} />
                        ) : (
                          <span style={{
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            border: '2px solid #CCCCCC',
                            display: 'inline-block',
                          }} />
                        )}
                      </span>
                      <span onClick={() => onChange(section.key, checked ? '' : opt.value)}>
                        {opt.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    {activeChips.length > 0 && (
      <div className="flex flex-wrap gap-2 w-full md:hidden">
        {activeChips.map((chip) => (
          <button
            key={chip.sectionKey}
            onClick={() => onChange(chip.sectionKey, '')}
            className="flex items-center gap-1.5 text-sm font-medium"
            style={{ background: '#FDFDFD', color: '#888888', borderRadius: 16, padding: '7px 12px' }}
          >
            <X size={14} />
            {chip.label}
          </button>
        ))}
      </div>
    )}
    </>
  );
};

export default FiltersDropdown;
