import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, Search, ChevronLeft, ChevronRight, Eye, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import tripService from '../services/trip.service';

const STATUS_CONFIG = {
  solicitado:    { color: 'bg-blue-100 text-blue-800',    label: 'Solicitado' },
  cotizando:     { color: 'bg-yellow-100 text-yellow-800', label: 'Cotizando' },
  confirmado:    { color: 'bg-green-100 text-green-800',   label: 'Confirmado' },
  en_asignacion: { color: 'bg-purple-100 text-purple-800', label: 'En Asignación' },
  en_curso:      { color: 'bg-indigo-100 text-indigo-800', label: 'En Curso' },
  finalizado:    { color: 'bg-gray-100 text-gray-800',     label: 'Finalizado' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || { color: 'bg-gray-100 text-gray-800', label: status };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
      {cfg.label}
    </span>
  );
};

const ITEMS_PER_PAGE = 10;
const STATUSES = Object.entries(STATUS_CONFIG).map(([value, { label }]) => ({ value, label }));

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const StarRating = ({ rating = 0 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= rating ? '#FBBF24' : 'none'} stroke={i <= rating ? '#FBBF24' : '#D1D5DB'} strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
);

const SortIcon = ({ col, sortKey, sortDir }) => {
  if (sortKey !== col) return <ChevronUp className="w-3 h-3 text-gray-300 ml-1 inline" />;
  return sortDir === 'asc'
    ? <ChevronUp className="w-3 h-3 text-gray-600 ml-1 inline" />
    : <ChevronDown className="w-3 h-3 text-gray-600 ml-1 inline" />;
};

export const Viajes = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState('fechaProgramada');
  const [sortDir, setSortDir] = useState('desc');

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  useEffect(() => {
    tripService.getMyTrips()
      .then(setTrips)
      .catch(err => console.error('Error cargando viajes:', err))
      .finally(() => setLoading(false));
  }, []);

  const STATUS_ORDER = ['solicitado','cotizando','confirmado','en_asignacion','en_curso','finalizado'];

  const filtered = useMemo(() => {
    let list = trips;
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      list = list.filter(v =>
        v.numeroViaje?.toLowerCase().includes(t) ||
        v.origen?.ciudad?.toLowerCase().includes(t) ||
        v.destino?.ciudad?.toLowerCase().includes(t)
      );
    }
    if (statusFilter) list = list.filter(v => v.estado === statusFilter);
    list = [...list].sort((a, b) => {
      let va, vb;
      if (sortKey === 'fechaProgramada') {
        va = a.fechaProgramada ? new Date(a.fechaProgramada).getTime() : 0;
        vb = b.fechaProgramada ? new Date(b.fechaProgramada).getTime() : 0;
      } else if (sortKey === 'estado') {
        va = STATUS_ORDER.indexOf(a.estado);
        vb = STATUS_ORDER.indexOf(b.estado);
      } else if (sortKey === 'puntuacion') {
        va = a.puntuacion ?? 0;
        vb = b.puntuacion ?? 0;
      } else {
        return 0;
      }
      return sortDir === 'asc' ? va - vb : vb - va;
    });
    return list;
  }, [trips, searchTerm, statusFilter, sortKey, sortDir]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Viajes</h1>
          <p className="text-gray-500 text-sm mt-0.5">Visualizá y gestioná tus solicitudes de viaje</p>
        </div>
        <Link
          to="/solicitar-viaje"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white"
          style={{ background: 'linear-gradient(135deg, #37784C 0%, #5F9C73 100%)' }}
        >
          <Plus className="w-4 h-4" />
          Solicitar viaje
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por número, origen o destino..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 h-11 border border-[#DEDEDE] rounded-full bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-400 shadow-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="h-11 pl-4 pr-9 border border-[#DEDEDE] rounded-full bg-white text-sm text-gray-700 focus:outline-none focus:border-gray-400 shadow-sm appearance-none"
          style={{ minWidth: 180 }}
        >
          <option value="">Todos los estados</option>
          {STATUSES.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#DEDEDE] shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <Truck className="w-12 h-12 text-gray-200 mb-3" />
            <p className="text-base font-semibold text-gray-600">No se encontraron viajes</p>
            <p className="text-sm text-gray-400 mt-1">
              {searchTerm || statusFilter ? 'Probá con otros filtros' : 'Todavía no solicitaste ningún viaje'}
            </p>
            {!searchTerm && !statusFilter && (
              <Link
                to="/solicitar-viaje"
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white"
                style={{ background: 'linear-gradient(135deg, #37784C 0%, #5F9C73 100%)' }}
              >
                <Plus className="w-4 h-4" />
                Solicitar viaje
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: '#F6F6F6' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#363636]">ID Viaje</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#363636]">Origen</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#363636]">Destino</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#363636]">Tipo de carga</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#363636]">N° Camiones</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#363636] cursor-pointer select-none" onClick={() => handleSort('fechaProgramada')}>
                    Fecha <SortIcon col="fechaProgramada" sortKey={sortKey} sortDir={sortDir} />
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#363636] cursor-pointer select-none" onClick={() => handleSort('estado')}>
                    Estado <SortIcon col="estado" sortKey={sortKey} sortDir={sortDir} />
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#363636] cursor-pointer select-none" onClick={() => handleSort('puntuacion')}>
                    Puntuación <SortIcon col="puntuacion" sortKey={sortKey} sortDir={sortDir} />
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-[#363636]">Accionable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((trip) => (
                  <tr
                    key={trip._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/viajes/${trip._id}`)}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {trip.numeroViaje || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {trip.origen?.ciudad ? `${trip.origen.ciudad}, ${trip.origen.provincia}` : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {trip.destino?.ciudad ? `${trip.destino.ciudad}, ${trip.destino.provincia}` : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 capitalize">
                      {trip.tipoCarga || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {trip.camionesSolicitados ?? '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDate(trip.fechaProgramada)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={trip.estado} />
                    </td>
                    <td className="px-6 py-4">
                      {trip.puntuacion ? <StarRating rating={trip.puntuacion} /> : <span className="text-sm text-gray-400">—</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/viajes/${trip._id}`}
                        onClick={e => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#DEDEDE] bg-white text-sm text-gray-700 hover:bg-gray-50 shadow-sm whitespace-nowrap"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Ver detalle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Mostrando {Math.min(filtered.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)}–{Math.min(filtered.length, currentPage * ITEMS_PER_PAGE)} de {filtered.length} viajes
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[#DEDEDE] bg-white text-gray-600 disabled:opacity-40 hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-sm text-gray-400">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium border transition-colors ${
                      currentPage === p
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-[#DEDEDE] bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[#DEDEDE] bg-white text-gray-600 disabled:opacity-40 hover:bg-gray-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
