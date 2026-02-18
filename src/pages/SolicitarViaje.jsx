import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Package, Truck } from 'lucide-react';
import tripService from '../services/trip.service';

export const SolicitarViaje = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    origen: {
      direccion: '',
      ciudad: '',
      provincia: ''
    },
    destino: {
      direccion: '',
      ciudad: '',
      provincia: ''
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
    
    if (name.startsWith('origen.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        origen: { ...prev.origen, [field]: value }
      }));
    } else if (name.startsWith('destino.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        destino: { ...prev.destino, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver
      </button>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Solicitar Viaje</h1>
          <p className="text-gray-600 mt-1">Completa los datos para solicitar un nuevo viaje</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Origen */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Origen</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="origen-direccion" className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección *
                </label>
                <input
                  id="origen-direccion"
                  type="text"
                  name="origen.direccion"
                  value={formData.origen.direccion}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ej: Ruta 9 Km 123"
                />
              </div>
              <div>
                <label htmlFor="origen-ciudad" className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad *
                </label>
                <input
                  id="origen-ciudad"
                  type="text"
                  name="origen.ciudad"
                  value={formData.origen.ciudad}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ej: Pergamino"
                />
              </div>
              <div>
                <label htmlFor="origen-provincia" className="block text-sm font-medium text-gray-700 mb-1">
                  Provincia *
                </label>
                <input
                  id="origen-provincia"
                  type="text"
                  name="origen.provincia"
                  value={formData.origen.provincia}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ej: Buenos Aires"
                />
              </div>
            </div>
          </div>

          {/* Destino */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Destino</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="destino-direccion" className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección *
                </label>
                <input
                  id="destino-direccion"
                  type="text"
                  name="destino.direccion"
                  value={formData.destino.direccion}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ej: Puerto de Rosario"
                />
              </div>
              <div>
                <label htmlFor="destino-ciudad" className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad *
                </label>
                <input
                  id="destino-ciudad"
                  type="text"
                  name="destino.ciudad"
                  value={formData.destino.ciudad}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ej: Rosario"
                />
              </div>
              <div>
                <label htmlFor="destino-provincia" className="block text-sm font-medium text-gray-700 mb-1">
                  Provincia *
                </label>
                <input
                  id="destino-provincia"
                  type="text"
                  name="destino.provincia"
                  value={formData.destino.provincia}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ej: Santa Fe"
                />
              </div>
            </div>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="puerto">Puerto</option>
                <option value="acopio">Acopio</option>
              </select>
            </div>
          </div>

          {/* Detalles del Viaje */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-primary-600" />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ej: 1"
                />
              </div>
            </div>
          </div>

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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Información adicional sobre el viaje..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Solicitar Viaje'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
