import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, ArrowLeft, PlusCircle, Calendar, Clock, Truck, AlignLeft, Info } from 'lucide-react';
import logo from '../assets/rutaycampoLogo.svg';
import PlacesAutocomplete from '../components/PlacesAutocomplete';

import { Button, PillInput, PillSelect, FormField } from '../components/ui';

const TOTAL_STEPS = 3;


const CARGO_TYPES = [
  { value: 'soja', label: 'Soja' },
  { value: 'maiz', label: 'Maíz' },
  { value: 'trigo', label: 'Trigo' },
  { value: 'girasol', label: 'Girasol' },
  { value: 'sorgo', label: 'Sorgo' },
  { value: 'otro', label: 'Otro' },
];

const HORA_OPTIONS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00',
];



function Step1({ data, onChange, errors, mapsLoaded }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Completá el recorrido del viaje</h2>
      <p className="text-sm text-gray-500 mt-1 mb-6">Indicanos el origen y destino de tu pedido.</p>

      <p className="text-lg font-bold text-gray-900 mb-3">Origen</p>
      <div className="mb-3">
        {mapsLoaded ? (
          <PlacesAutocomplete
            label="Dirección de origen*"
            required
            placeholder="Ej: Ruta 9 Km 123, Pergamino"
            onPlaceSelect={(place) => {
              onChange('origen', 'direccion', place.direccion);
              onChange('origen', 'ciudad', place.ciudad);
              onChange('origen', 'provincia', place.provincia);
              onChange('origen', 'coordenadas', place.coordenadas);
            }}
          />
        ) : (
          <p className="text-sm text-gray-400">Cargando buscador de direcciones...</p>
        )}
        {errors['origen.direccion'] && (
          <p className="mt-1 text-xs text-red-600">{errors['origen.direccion']}</p>
        )}
        {data.origen.ciudad && (
          <p className="mt-1 text-xs text-emerald-600">📍 {data.origen.ciudad}, {data.origen.provincia}</p>
        )}
      </div>

      <p className="text-lg font-bold text-gray-900 mb-3 mt-5">Destino</p>
      <div className="mb-3">
        {mapsLoaded ? (
          <PlacesAutocomplete
            label="Dirección de destino*"
            required
            placeholder="Ej: Puerto de Rosario, Santa Fe"
            onPlaceSelect={(place) => {
              onChange('destino', 'direccion', place.direccion);
              onChange('destino', 'ciudad', place.ciudad);
              onChange('destino', 'provincia', place.provincia);
              onChange('destino', 'coordenadas', place.coordenadas);
            }}
          />
        ) : (
          <p className="text-sm text-gray-400">Cargando buscador de direcciones...</p>
        )}
        {errors['destino.direccion'] && (
          <p className="mt-1 text-xs text-red-600">{errors['destino.direccion']}</p>
        )}
        {data.destino.ciudad && (
          <p className="mt-1 text-xs text-emerald-600">📍 {data.destino.ciudad}, {data.destino.provincia}</p>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label="Puerto/Acopio*" error={errors['tipoDestino']}>
          <PillSelect
            icon={<PlusCircle className="w-4 h-4" />}
            value={data.tipoDestino}
            onChange={e => onChange(null, 'tipoDestino', e.target.value)}
            error={errors['tipoDestino']}
          >
            <option value="">Seleccionar</option>
            <option value="puerto">Puerto</option>
            <option value="acopio">Acopio</option>
          </PillSelect>
        </FormField>
      </div>
    </div>
  );
}

function Step2({ data, onChange, errors }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Elegí fecha</h2>
      <p className="text-sm text-gray-500 mt-1 mb-6">Indicanos qué momento se adapta mejor a tu operación</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label="Fecha*" error={errors['fecha']}>
          <PillInput
            icon={<Calendar className="w-4 h-4" />}
            type="date"
            value={data.fecha}
            onChange={e => onChange(null, 'fecha', e.target.value)}
            error={errors['fecha']}
          />
        </FormField>
        <FormField label="Hora*" error={errors['hora']}>
          <PillSelect
            icon={<Clock className="w-4 h-4" />}
            value={data.hora}
            onChange={e => onChange(null, 'hora', e.target.value)}
            error={errors['hora']}
          >
            <option value="">Seleccionar</option>
            {HORA_OPTIONS.map(h => <option key={h} value={h}>{h}</option>)}
          </PillSelect>
        </FormField>
      </div>
    </div>
  );
}

function Step3({ data, onChange, errors }) {
  const notasMax = 140;
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Completá el detalle de la carga</h2>
      <p className="text-sm text-gray-500 mt-1 mb-5">Indicanos el tipo de grano y cantidad de camiones</p>

      {/* Info banner */}
      <div className="flex items-center gap-2 bg-blue-50 text-blue-700 text-sm px-4 py-3 rounded-xl mb-5">
        <Info className="w-4 h-4 flex-shrink-0" />
        <span>El valor del viaje se basará en la cantidad de camiones que solicites.</span>
      </div>

      {/* Grano - full width */}
      <div className="mb-3">
        <FormField label="Grano*" error={errors['grano']}>
          <PillSelect
            icon={<PlusCircle className="w-4 h-4" />}
            value={data.grano}
            onChange={e => onChange(null, 'grano', e.target.value)}
            error={errors['grano']}
          >
            <option value="">Seleccionar</option>
            {CARGO_TYPES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </PillSelect>
        </FormField>
      </div>

      {/* Camiones side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <FormField label="Camiones comunes*" error={errors['camionesComunes']}>
          <PillInput
            icon={<Truck className="w-4 h-4" />}
            type="number"
            min="0"
            placeholder="0"
            value={data.camionesComunes}
            onChange={e => onChange(null, 'camionesComunes', e.target.value)}
            error={errors['camionesComunes']}
          />
        </FormField>
        <FormField label="Camiones escalables*" error={errors['camionesEscalables']}>
          <PillInput
            icon={<Truck className="w-4 h-4" />}
            type="number"
            min="0"
            placeholder="0"
            value={data.camionesEscalables}
            onChange={e => onChange(null, 'camionesEscalables', e.target.value)}
            error={errors['camionesEscalables']}
          />
        </FormField>
      </div>

      {/* Notas con contador */}
      <FormField label="Notas adicionales (opcional)">
        <div className="flex items-start gap-3 bg-white rounded-2xl pl-[6px] pr-4 pt-[6px] pb-3 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-transparent focus-within:border-[#DEDEDE]">
          <div className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0 bg-[#F6F6F6] mt-0.5">
            <AlignLeft className="w-4 h-4" style={{ color: '#888888' }} />
          </div>
          <div className="flex-1">
            <textarea
              rows={4}
              maxLength={notasMax}
              placeholder="Escribe tu mensaje aquí..."
              value={data.notas}
              onChange={e => onChange(null, 'notas', e.target.value)}
              className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400 resize-none py-2"
            />
            <p className="text-xs text-gray-400 text-right">{data.notas.length}/{notasMax}</p>
          </div>
        </div>
      </FormField>
    </div>
  );
}



const EMPTY_FORM = {
  origen: { direccion: '', ciudad: '', provincia: '', codigoPostal: '' },
  destino: { direccion: '', ciudad: '', provincia: '', codigoPostal: '' },
  tipoDestino: '',
  fecha: '',
  hora: '',
  grano: '',
  camionesComunes: '',
  camionesEscalables: '',
  notas: '',
};

export const SolicitarViaje = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(location.state?.step ?? 1);
  const [calculating, setCalculating] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(location.state?.formData ?? EMPTY_FORM);
  const [mapsLoaded, setMapsLoaded] = useState(!!window.google?.maps);

  useEffect(() => {
    if (window.google?.maps) return;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places,directions`;
    script.async = true;
    script.onload = () => setMapsLoaded(true);
    document.head.appendChild(script);
  }, []);

  const handleChange = (section, field, value) => {
    setErrors(prev => {
      const next = { ...prev };
      delete next[section ? `${section}.${field}` : field];
      return next;
    });
    if (!section) {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
    }
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!formData.origen.direccion) e['origen.direccion'] = 'Seleccioná una dirección de origen';
      if (!formData.destino.direccion) e['destino.direccion'] = 'Seleccioná una dirección de destino';
      if (!formData.tipoDestino) e['tipoDestino'] = 'Campo requerido';
    }
    if (s === 2) {
      if (!formData.fecha) e['fecha'] = 'Campo requerido';
      if (!formData.hora) e['hora'] = 'Campo requerido';
    }
    if (s === 3) {
      if (!formData.grano) e['grano'] = 'Campo requerido';
      if (!formData.camionesComunes && !formData.camionesEscalables) {
        e['camionesComunes'] = 'Ingresá al menos un tipo de camión';
      }
    }
    return e;
  };

  const handleNext = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step === 1) navigate(-1);
    else setStep(s => s - 1);
  };

  const handleCalculate = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setCalculating(true);
    setTimeout(() => {
      navigate('/solicitar-viaje/resumen', { state: { formData } });
    }, 3000);
  };

  if (calculating) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-3 px-4">
        <h2 className="text-xl font-bold text-gray-900 text-center">Estamos calculando tu tarifa</h2>
        <p className="text-sm text-gray-500 text-center">Analizando distancia, peso y disponibilidad</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Mobile header */}
      <div className="lg:hidden">
        <div className="flex items-center gap-2 px-4 pt-4 pb-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i + 1 <= step ? 'bg-[#45845C]' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <button
            type="button"
            onClick={handleBack}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center focus:outline-none"
            style={{ border: '1px solid #DEDEDE' }}
            aria-label="Atrás"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-gray-600" />
          </button>
          <button
            type="button"
            onClick={() => navigate('/viajes')}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center focus:outline-none"
            style={{ border: '1px solid #DEDEDE' }}
            aria-label="Cerrar"
          >
            <X className="w-3.5 h-3.5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden lg:flex items-center px-4 py-4 gap-4">
        <button type="button" onClick={() => navigate('/')} className="focus:outline-none flex-shrink-0">
          <img src={logo} alt="Ruta y Campo" className="w-10 h-10" />
        </button>
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-2xl flex items-center gap-2">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i + 1 <= step ? 'bg-[#45845C]' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/viajes')}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors focus:outline-none flex-shrink-0"
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
          aria-label="Cerrar"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 flex items-start justify-center px-4 pb-28 sm:pb-8 overflow-y-auto">
        <div className="w-full max-w-2xl py-2 sm:bg-white sm:rounded-2xl sm:p-8 sm:shadow-[0_8px_40px_rgba(0,0,0,0.10)]">
          {errors.submit && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errors.submit}
            </div>
          )}

          {step === 1 && <Step1 data={formData} onChange={handleChange} errors={errors} mapsLoaded={mapsLoaded} />}
          {step === 2 && <Step2 data={formData} onChange={handleChange} errors={errors} />}
          {step === 3 && <Step3 data={formData} onChange={handleChange} errors={errors} />}

          {/* Navigation buttons */}
          <div className="hidden sm:flex gap-3 mt-8">
            <Button variant="secondary" size="lg" onClick={handleBack}>
              Atrás
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={step === TOTAL_STEPS ? handleCalculate : handleNext}
              className="flex-1"
            >
              {step === TOTAL_STEPS ? 'Calcular tarifa' : 'Continuar'}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom button */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3 bg-white">
        <Button
          variant="primary"
          size="lg"
          onClick={step === TOTAL_STEPS ? handleCalculate : handleNext}
          className="w-full"
        >
          {step === TOTAL_STEPS ? 'Calcular tarifa' : 'Continuar'}
        </Button>
      </div>
    </div>
  );
};



