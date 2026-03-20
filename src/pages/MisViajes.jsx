import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import arrowRightSvg from '../assets/arrow-right.svg';
import TruckIcon from '../assets/Truck.svg';
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
  { key: 'tipoCarga', label: 'Tipo de carga' },
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

  useEffect(() => {
    setCurrentPage(1);
    setMobileCount(ITEMS_PER_PAGE);
  }, [searchTerm, filters]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && mobileCount < filteredTrips.length) {
          setMobileCount((c) => c + ITEMS_PER_PAGE);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [mobileCount, filteredTrips.length]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-gray-900">Viajes</h1>
        <p className="text-gray-600 mt-1">Gestiona la información de los viajes disponibles.</p>
      </div>

      <ListPageToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar viajes"
        filters={filters}
        onFilterChange={handleFilterChange}
        filterSections={FILTER_SECTIONS}
        addLabel="Solicitar viaje"
        addButtonWidth={200}
        onAdd={() => navigate('/solicitar-viaje')}
      />

      {/* Desktop: tabla + paginación */}
      <div className="hidden md:block space-y-6">
        <DataTable
          columns={TABLE_COLUMNS}
          data={paginatedTrips}
          emptyIcon={
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: '#F6F6F6' }}>
              <img src={TruckIcon} alt="" className="w-6 h-6" />
            </div>
          }
          emptyTitle="No se encontraron viajes"
          emptySubtitle={
            searchTerm || filters.estado
              ? 'Intenta con otros filtros'
              : 'Comienza solicitando un nuevo viaje'
          }
          renderRow={(trip) => (
            <tr
              key={trip._id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/viajes/${trip._id}`)}
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
                {trip.tipoCarga || '-'}
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
            <div className="w-12 h-12 rounded-lg bg-[#F6F6F6] flex items-center justify-center mb-3">
              <img src={TruckIcon} alt="" className="w-6 h-6" />
            </div>
            <p className="text-base font-semibold text-gray-700">No se encontraron viajes</p>
            <p className="text-sm text-gray-400 mt-1">
              {searchTerm || filters.estado
                ? 'Intenta con otros filtros'
                : 'Comienza solicitando un nuevo viaje'}
            </p>
          </div>
        ) : (
          <div className="border border-[#DEDEDE] rounded-2xl divide-y divide-[#DEDEDE] overflow-hidden">
            {mobileTrips.map((trip) => (
              <div
                key={trip._id}
                className="flex items-center gap-3 px-4 py-4 bg-white cursor-pointer active:bg-gray-50"
                onClick={() => navigate(`/viajes/${trip._id}`)}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#F6F6F6' }}>
                  <img src={TruckIcon} alt="" className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-[#363636]">
                      {trip.camionesSolicitados ?? '-'} camiones
                    </span>
                    <StatusBadge status={trip.estado} />
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: '#7A7A7A' }}>
                    {trip.numeroViaje ? `#${trip.numeroViaje}` : '-'}
                    {' • '}
                    {trip.fechaProgramada
                      ? new Date(trip.fechaProgramada).toLocaleDateString('es-AR')
                      : '-'}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full border border-[#DEDEDE] bg-white flex items-center justify-center flex-shrink-0">
                  <img src={arrowRightSvg} alt="" width={20} height={20} />
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
