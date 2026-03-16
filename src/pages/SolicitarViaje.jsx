import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Package, Truck, AlertTriangle } from 'lucide-react';
import tripService from '../services/trip.service';
import { useAuth } from '../context/AuthContext';
import PlacesAutocomplete from '../components/PlacesAutocomplete';

export const SolicitarViaje = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mapsLoaded, setMapsLoaded] = useState(!!window.google?.maps);

  useEffect(() => {
    if (window.google?.maps) return;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => setMapsLoaded(true);
    document.head.appendChild(script);
    return () => {};
  }, []);

  const [formData, setFormData] = useState({
    origen: {
      direccion: '',
      ciudad: '',
      provincia: '',
      coordenadas: { latitud: null, longitud: null }
    },
    destino: {
      direccion: '',
      ciudad: '',
      provincia: '',
      coordenadas: { latitud: null, longitud: null }
    },
    tipoDestino: 'puerto',
    fechaProgramada: '',
    tipoCarga: 'grano',
    peso: '',
    camionesSolicitados: '',
    notas: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceSelect = (section) => (placeData) => {
    setFormData(prev => ({ ...prev, [section]: placeData }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user?.activo === false) return;
    setError('');
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        peso: parseFloat(formData.peso),
        camionesSolicitados: parseInt(formData.camionesSolicitados),
        camionesRecomendados: parseInt(formData.camionesSolicitados)
      };

      await tripService.create(submitData);
      navigate('/viajes');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la solicitud');
    } finally {
      setLoading(false);
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

        {user?.activo === false && (
          <div className="m-6 flex items-start gap-3 bg-amber-50 border border-amber-300 text-amber-800 px-4 py-4 rounded-xl">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Tu cuenta no está activa</p>
              <p className="text-sm mt-0.5">No podés crear pedidos hasta que tu cuenta sea activada. Contactá a tu operador.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Origen */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">Origen</h2>
            </div>
            {mapsLoaded ? (
              <PlacesAutocomplete
                label="Dirección de origen"
                required
                placeholder="Ej: Ruta 9 Km 123, Pergamino"
                onPlaceSelect={handlePlaceSelect('origen')}
              />
            ) : (
              <p className="text-sm text-gray-400">Cargando buscador de direcciones...</p>
            )}
            {formData.origen.ciudad && (
              <div className="mt-2 flex gap-4 text-sm text-gray-500">
                <span>📍 {formData.origen.ciudad}, {formData.origen.provincia}</span>
                {formData.origen.coordenadas?.latitud && (
                  <span className="text-emerald-600">✓ Coordenadas obtenidas</span>
                )}
              </div>
            )}
          </div>

          {/* Destino */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">Destino</h2>
            </div>
            {mapsLoaded ? (
              <PlacesAutocomplete
                label="Dirección de destino"
                required
                placeholder="Ej: Puerto de Rosario, Santa Fe"
                onPlaceSelect={handlePlaceSelect('destino')}
              />
            ) : (
              <p className="text-sm text-gray-400">Cargando buscador de direcciones...</p>
            )}
            {formData.destino.ciudad && (
              <div className="mt-2 flex gap-4 text-sm text-gray-500">
                <span>📍 {formData.destino.ciudad}, {formData.destino.provincia}</span>
                {formData.destino.coordenadas?.latitud && (
                  <span className="text-emerald-600">✓ Coordenadas obtenidas</span>
                )}
              </div>
            )}
            <div className="mt-4">
              <label htmlFor="tipo-destino" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Destino *
              </label>
              <select
                id="tipo-destino"
                name="tipoDestino"
                value={formData.tipoDestino}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="puerto">Puerto</option>
                <option value="acopio">Acopio</option>
              </select>
            </div>
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

          {/* Detalles del Viaje */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">Detalles del Viaje</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fecha-programada" className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Fecha Programada *
                </label>
                <input
                  id="fecha-programada"
                  type="datetime-local"
                  name="fechaProgramada"
                  value={formData.fechaProgramada}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="tipo-carga" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Carga
                </label>
                <input
                  id="tipo-carga"
                  type="text"
                  name="tipoCarga"
                  value={formData.tipoCarga}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ej: Soja, Maíz, Trigo"
                />
              </div>
              <div>
                <label htmlFor="peso" className="block text-sm font-medium text-gray-700 mb-1">
                  Peso (toneladas) *
                </label>
                <input
                  id="peso"
                  type="number"
                  name="peso"
                  value={formData.peso}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ej: 30"
                />
              </div>
              <div>
                <label htmlFor="camiones-solicitados" className="block text-sm font-medium text-gray-700 mb-1">
                  <Truck className="w-4 h-4 inline mr-1" />
                  Camiones Solicitados *
                </label>
                <input
                  id="camiones-solicitados"
                  type="number"
                  name="camionesSolicitados"
                  value={formData.camionesSolicitados}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ej: 1"
                />
              </div>
            </div>
          )}

          {/* Notas */}
          <div>
            <label htmlFor="notas" className="block text-sm font-medium text-gray-700 mb-1">
              Notas Adicionales
            </label>
            <textarea
              id="notas"
              name="notas"
              value={formData.notas}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Información adicional sobre el viaje..."
            />
          </div>

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
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || user?.activo === false}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Solicitar Viaje'}
            </button>
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



