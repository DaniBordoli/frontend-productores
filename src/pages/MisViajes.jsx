import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Package, Truck, Eye } from 'lucide-react';
import tripService from '../services/trip.service';

export const MisViajes = () => {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadTrips();
  }, []);

  useEffect(() => {
    filterTrips();
  }, [searchTerm, statusFilter, trips]);

  const loadTrips = async () => {
    try {
      const data = await tripService.getMyTrips();
      setTrips(data);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTrips = () => {
    let filtered = trips;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.numeroViaje?.toLowerCase().includes(term) ||
        t.origen?.ciudad?.toLowerCase().includes(term) ||
        t.destino?.ciudad?.toLowerCase().includes(term)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(t => t.estado === statusFilter);
    }

    setFilteredTrips(filtered);
  };

  const getSubStatusLabel = (subStatus) => {
    const subStatusLabels = {
      'llegue_a_cargar': '🚚 Llegué a cargar',
      'cargado_saliendo': '📦 Cargado, saliendo',
      'en_camino': '🛣️ En camino',
      'llegue_a_destino': '📍 Llegué a destino',
      'descargado': '✅ Descargado'
    };
    return subStatusLabels[subStatus] || null;
  };

  const getStatusBadge = (status, subStatus) => {
    const statusConfig = {
      solicitado: { color: 'bg-blue-100 text-blue-800', label: 'Solicitado' },
      cotizando: { color: 'bg-yellow-100 text-yellow-800', label: 'Cotizando' },
      confirmado: { color: 'bg-green-100 text-green-800', label: 'Confirmado' },
      en_asignacion: { color: 'bg-purple-100 text-purple-800', label: 'En Asignación' },
      en_curso: { color: 'bg-indigo-100 text-indigo-800', label: 'En Curso' },
      finalizado: { color: 'bg-gray-100 text-gray-800', label: 'Finalizado' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    const subLabel = getSubStatusLabel(subStatus);
    
    return (
      <div className="flex flex-col gap-1">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
          {config.label}
        </span>
        {subLabel && (
          <span className="text-xs text-gray-600">
            {subLabel}
          </span>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mis Viajes</h1>
        <p className="text-gray-600 mt-1">Visualiza y gestiona tus solicitudes de viaje</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por número o ciudad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter('')}
              className={`px-3 py-1 rounded-lg text-sm ${!statusFilter ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('solicitado')}
              className={`px-3 py-1 rounded-lg text-sm ${statusFilter === 'solicitado' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Solicitado
            </button>
            <button
              onClick={() => setStatusFilter('en_curso')}
              className={`px-3 py-1 rounded-lg text-sm ${statusFilter === 'en_curso' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              En Curso
            </button>
            <button
              onClick={() => setStatusFilter('finalizado')}
              className={`px-3 py-1 rounded-lg text-sm ${statusFilter === 'finalizado' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Finalizado
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredTrips.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-lg font-medium text-gray-500">No se encontraron viajes</p>
              <p className="text-sm text-gray-400 mt-1">
                {searchTerm || statusFilter ? 'Intenta con otros filtros' : 'Aún no has solicitado ningún viaje'}
              </p>
            </div>
          ) : (
            filteredTrips.map((trip) => (
              <div key={trip._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{trip.numeroViaje}</h3>
                      {getStatusBadge(trip.estado, trip.subEstado)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div className="text-sm">
                          <p className="text-gray-900 font-medium">Origen</p>
                          <p className="text-gray-600">{trip.origen?.ciudad}, {trip.origen?.provincia}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div className="text-sm">
                          <p className="text-gray-900 font-medium">Destino</p>
                          <p className="text-gray-600">{trip.destino?.ciudad}, {trip.destino?.provincia}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div className="text-sm">
                          <p className="text-gray-600">
                            {new Date(trip.fechaProgramada).toLocaleDateString('es-AR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <div className="text-sm">
                          <p className="text-gray-600">{trip.peso} tn - {trip.camionesSolicitados} camiones</p>
                        </div>
                      </div>
                    </div>

                    {trip.transportista && (
                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <Truck className="w-4 h-4 text-primary-600" />
                        <span className="text-gray-600">
                          Transportista: <span className="font-medium text-gray-900">{trip.transportista.nombreConductor}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  <Link
                    to={`/viajes/${trip._id}`}
                    className="ml-4 p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                    title="Ver detalles"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {filteredTrips.length > 0 && (
          <div className="px-6 py-4 border-t bg-gray-50">
            <p className="text-sm text-gray-600">
              Mostrando {filteredTrips.length} de {trips.length} viajes
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
