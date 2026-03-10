import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import tripService from '../services/trip.service';
import { StatusBadge } from '../components/StatusBadge';
import { TripMap } from '../components/TripMap';
import { CheckInTimeline } from '../components/CheckInTimeline';
import { useWebSocket } from '../hooks/useWebSocket';
import { Button, LoadingSpinner, Breadcrumb } from '../components/ui';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return '—';
  return d.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const cityOf = (loc) =>
  loc?.ciudad && loc?.provincia
    ? `${loc.ciudad}, ${loc.provincia}`
    : loc?.ciudad || loc?.provincia || '—';

const formatPrice = (value) => {
  if (!value && value !== 0) return null;
  return `$${Number(value).toLocaleString('es-AR')}`;
};

// --- Inline icons (same as dashboard ViajeDetail) ---
const IconRoute = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="5" cy="12" r="3" stroke="#888888" strokeWidth="2" />
    <circle cx="19" cy="12" r="3" stroke="#888888" strokeWidth="2" />
    <path d="M8 12H16" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" />
  </svg>
);

const IconTruck = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 3H15V16H1V3Z" stroke="#888888" strokeWidth="2" strokeLinejoin="round" />
    <path d="M15 8H18L21 11V16H15V8Z" stroke="#888888" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="5.5" cy="18.5" r="2.5" stroke="#888888" strokeWidth="2" />
    <circle cx="18.5" cy="18.5" r="2.5" stroke="#888888" strokeWidth="2" />
  </svg>
);

const IconCard = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="5" width="20" height="14" rx="3" stroke="white" strokeWidth="2" />
    <path d="M2 10H22" stroke="white" strokeWidth="2" />
    <path d="M6 15H10" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const EmptyIllustration = () => (
  <div className="w-32 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect x="8" y="8" width="32" height="32" rx="6" fill="#E5E7EB" />
      <rect x="14" y="16" width="20" height="3" rx="1.5" fill="#D1D5DB" />
      <rect x="14" y="22" width="14" height="3" rx="1.5" fill="#D1D5DB" />
      <rect x="14" y="28" width="17" height="3" rx="1.5" fill="#D1D5DB" />
    </svg>
  </div>
);

export const ViajeDetalle = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTracking, setShowTracking] = useState(false);
  const { isConnected, lastUpdate } = useWebSocket(id);

  const loadTrip = useCallback(async () => {
    try {
      const data = await tripService.getById(id);
      setTrip(data);
    } catch (error) {
      console.error('Error loading trip:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTrip();
  }, [loadTrip]);

  // eslint-disable-next-line react-doctor/no-effect-event-handler
  useEffect(() => {
    if (lastUpdate) loadTrip();
  }, [lastUpdate, loadTrip]);

  if (loading) return <LoadingSpinner />;

  if (!trip) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Viaje no encontrado</p>
      </div>
    );
  }

  const originCity = cityOf(trip.origen);
  const destCity = cityOf(trip.destino);
  const distanceKm = trip.distancia ? `${trip.distancia} km` : null;
  const requestedTrucks = trip.camionesSolicitados ?? 0;
  const assignedTrucks = trip.camiones || [];
  const canTrack = trip.estado === 'en_curso' && (trip.trackingActivo || trip.rutaCompleta?.length > 0);

  // Pricing
  const proposedPrice = formatPrice(trip.precios?.precioPropuesto);
  const confirmedPrice = formatPrice(trip.precios?.precioConfirmado);
  const finalPrice = formatPrice(trip.precios?.precioFinal);
  const displayPrice = finalPrice || confirmedPrice || proposedPrice;
  const priceLabel = finalPrice ? 'Final' : confirmedPrice ? 'Confirmada' : 'Propuesta';

  return (
    <div className="space-y-6">
      {/* Breadcrumb + date */}
      <div className="flex items-center justify-between">
        <Breadcrumb parentLabel="Mis Viajes" parentPath="/viajes" currentLabel="Detalle del viaje" />
        <span className="text-sm text-gray-400">{formatDate(trip.fechaProgramada)}</span>
      </div>

      {/* Title + actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">
            Viaje {trip.numeroViaje ? `#${trip.numeroViaje}` : ''}
          </h1>
          <StatusBadge status={trip.estado} />
        </div>
        {canTrack && (
          <Button onClick={() => setShowTracking((v) => !v)}>
            {showTracking ? 'Ocultar mapa' : 'Ver tracking'}
          </Button>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Recorrido */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">
                <IconRoute />
              </div>
              <span className="text-sm font-semibold text-gray-700">Recorrido</span>
            </div>
            {distanceKm && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                {distanceKm}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-gray-900">{originCity}</span>
            <div className="flex-1 flex items-center">
              <div className="w-full border-t-2 border-dashed border-gray-300" />
            </div>
            <span className="text-base font-semibold text-gray-900">{destCity}</span>
          </div>
        </div>

        {/* Camiones */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">
                <IconTruck />
              </div>
              <span className="text-sm font-semibold text-gray-700">Camiones</span>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
              {requestedTrucks} unidades
            </span>
          </div>
          <p className="text-base font-semibold text-gray-900">
            {requestedTrucks > 0 ? `${requestedTrucks} camiones solicitados` : '—'}
          </p>
        </div>

        {/* Tarifas (green gradient card) */}
        <div
          className="rounded-2xl p-5 flex flex-col justify-between"
          style={{ background: 'linear-gradient(135deg, #37784C 0%, #5F9C73 100%)' }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.15)' }}
              >
                <IconCard />
              </div>
              <span className="text-sm font-semibold text-white">Tarifas</span>
            </div>
            {displayPrice && (
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full text-white"
                style={{ background: 'rgba(255,255,255,0.18)' }}
              >
                {priceLabel}: {displayPrice}
              </span>
            )}
          </div>
          <p className="text-base font-semibold text-white">
            {displayPrice || 'Sin tarifa asignada'}
          </p>
        </div>
      </div>

      {/* Tracking map (conditional) */}
      {showTracking && canTrack && (
        <div className="bg-white rounded-2xl shadow border border-[#DEDEDE] p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Tracking en tiempo real</h2>
          <TripMap
            trip={trip}
            currentLocation={trip.rutaCompleta?.[trip.rutaCompleta.length - 1]}
            route={trip.rutaCompleta || []}
          />
          {trip.checkIns?.length > 0 && (
            <div className="mt-6">
              <CheckInTimeline checkIns={trip.checkIns} />
            </div>
          )}
        </div>
      )}

      {/* Detalle de camiones */}
      <div className="bg-white rounded-2xl shadow border border-[#DEDEDE] p-6">
        <h2 className="text-base font-semibold text-gray-900">Detalle de camiones</h2>
        {assignedTrucks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <EmptyIllustration />
            <p className="mt-5 text-base font-semibold text-gray-700">Aún no hay datos para mostrar</p>
            <p className="mt-1 text-sm text-gray-400">
              Cuando se confirmen las asignaciones, verás el detalle de cada camión aquí
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#DEDEDE] mt-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ background: '#F6F6F6' }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-[#363636]">ID Camión</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-[#363636]">Tipo</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-[#363636]">Estado</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-[#363636]">Chofer</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-[#363636]">Patente</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-[#363636]">Carta de porte</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {assignedTrucks.map((row, i) => (
                    <tr key={row._id || i} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {row.truckId || row._id?.slice(-6).toUpperCase() || `C-${i + 1}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#363636]">{row.tipo || '—'}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={row.estado || row.status || 'pendiente'} />
                      </td>
                      <td className="px-6 py-4 text-sm text-[#363636]">
                        {row.chofer?.nombre ||
                          row.choferNombre ||
                          (row.choferOptions?.find((c) => c._id === row.choferId)?.name) ||
                          '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#363636]">
                        {row.patente ||
                          (row.camionOptions?.find((c) => c._id === row.camionId)?.patente) ||
                          '—'}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={row.cartaDePorte || 'pendiente'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Notas */}
      {trip.notas && (
        <div className="bg-white rounded-2xl shadow border border-[#DEDEDE] p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Notas</h2>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{trip.notas}</p>
        </div>
      )}
    </div>
  );
};
