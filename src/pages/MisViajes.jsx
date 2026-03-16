import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck } from 'lucide-react';
import arrowRightSvg from '../assets/arrow-right.svg';
import tripService from '../services/trip.service';
import { StatusBadge } from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import {
  Button,
  LoadingSpinner,
  DataTable,
  ListPageToolbar,
  StarRating,
} from '../components/ui';

const ITEMS_PER_PAGE = 10;

const FILTER_SECTIONS = [
  {
    label: 'Estado',
    key: 'estado',
    options: [
      { label: 'Solicitado', value: 'solicitado' },
      { label: 'Cotizando', value: 'cotizando' },
      { label: 'Confirmado', value: 'confirmado' },
      { label: 'En asignación', value: 'en_asignacion' },
      { label: 'En curso', value: 'en_curso' },
      { label: 'Finalizado', value: 'finalizado' },
    ],
  },
];

const TABLE_COLUMNS = [
  { key: 'id', label: 'ID Viaje' },
  { key: 'origen', label: 'Origen' },
  { key: 'destino', label: 'Destino' },
  { key: 'camiones', label: 'N° Camiones' },
  { key: 'fecha', label: 'Fecha', sortable: true },
  { key: 'estado', label: 'Estado', sortable: true },
  { key: 'puntuacion', label: 'Puntuación', sortable: true },
  { key: 'accionable', label: 'Accionable', align: 'right' },
];

export const MisViajes = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ estado: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileCount, setMobileCount] = useState(ITEMS_PER_PAGE);
  const sentinelRef = useRef(null);

  const handleFilterChange = (key, val) => setFilters((prev) => ({ ...prev, [key]: val }));

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const data = await tripService.getMyTrips();
      setTrips(data);
    } catch (error) {
      console.error('Error al cargar viajes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrips = useMemo(() => {
    let filtered = trips;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.numeroViaje?.toLowerCase().includes(term) ||
          t.origen?.ciudad?.toLowerCase().includes(term) ||
          t.destino?.ciudad?.toLowerCase().includes(term)
      );
    }
    if (filters.estado) {
      filtered = filtered.filter((t) => t.estado === filters.estado);
    }
    return filtered;
  }, [trips, searchTerm, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredTrips.length / ITEMS_PER_PAGE));
  const paginatedTrips = filteredTrips.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const mobileTrips = filteredTrips.slice(0, mobileCount);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [mobileCount, filteredTrips.length]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-gray-900">Mis Viajes</h1>
        <p className="text-gray-600 mt-1">Visualiza y gestiona tus solicitudes de viaje.</p>
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter('')}
              className={`px-3 py-1 rounded-lg text-sm ${!statusFilter ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('solicitado')}
              className={`px-3 py-1 rounded-lg text-sm ${statusFilter === 'solicitado' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Solicitado
            </button>
            <button
              onClick={() => setStatusFilter('en_curso')}
              className={`px-3 py-1 rounded-lg text-sm ${statusFilter === 'en_curso' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              En Curso
            </button>
            <button
              onClick={() => setStatusFilter('finalizado')}
              className={`px-3 py-1 rounded-lg text-sm ${statusFilter === 'finalizado' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <td className="px-6 py-4 font-medium text-[#363636]">
                {trip.numeroViaje || '-'}
              </td>
              <td className="px-6 py-4 text-sm text-[#363636]">
                {trip.origen?.ciudad
                  ? `${trip.origen.ciudad}, ${trip.origen.provincia}`
                  : '-'}
              </td>
              <td className="px-6 py-4 text-sm text-[#363636]">
                {trip.destino?.ciudad
                  ? `${trip.destino.ciudad}, ${trip.destino.provincia}`
                  : '-'}
              </td>
              <td className="px-6 py-4 text-sm text-[#363636]">
                {trip.camionesSolicitados ?? '-'}
              </td>
              <td className="px-6 py-4 text-sm text-[#363636]">
                {trip.fechaProgramada
                  ? new Date(trip.fechaProgramada).toLocaleDateString('es-AR')
                  : '-'}
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={trip.estado} />
              </td>
              <td className="px-6 py-4">
                <StarRating rating={trip.puntuacion ?? trip.rating ?? 0} />
              </td>
              <td className="px-6 py-4 text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/viajes/${trip._id}`);
                  }}
                >
                  Ver detalle
                </Button>
              </td>
            </tr>
          )}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Mobile: lista de tarjetas + scroll infinito */}
      <div className="md:hidden">
        {mobileTrips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-[#DEDEDE] rounded-2xl bg-white">
            <Truck className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-base font-semibold text-gray-700">No se encontraron viajes</p>
            <p className="text-sm text-gray-400 mt-1">
              {searchTerm || filters.estado
                ? 'Intenta con otros filtros'
                : 'Comienza solicitando un nuevo viaje'}
            </p>
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
                        <Truck className="w-4 h-4 text-emerald-600" />
                        <span className="text-gray-600">
                          Transportista: <span className="font-medium text-gray-900">{trip.transportista.nombreConductor}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  <Link
                    to={`/viajes/${trip._id}`}
                    className="ml-4 p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                    title="Ver detalles"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={sentinelRef} className="h-4" />
      </div>

      {/* Mobile FAB – Solicitar viaje */}
      <Link
        to="/solicitar-viaje"
        className="md:hidden fixed bottom-6 right-6 z-50 flex items-center justify-center"
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #37784C, #5F9C73)',
          boxShadow: '0 4px 16px rgba(55,120,76,0.4)',
          padding: 19.5,
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 7C12.5523 7 13 7.44772 13 8V11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H13V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V13H8C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11H11V8C11 7.44772 11.4477 7 12 7Z" fill="white"/>
        </svg>
      </Link>
    </div>
  );
};
