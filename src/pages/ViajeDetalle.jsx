import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import tripService from '../services/trip.service';
import { StatusBadge } from '../components/StatusBadge';
import { TripMap } from '../components/TripMap';
import { CheckInTimeline } from '../components/CheckInTimeline';
import { useWebSocket } from '../hooks/useWebSocket';
import { Button, LoadingSpinner, Breadcrumb, DataTable } from '../components/ui';
import { TripSummaryCard } from '../components/TripSummaryCard';
import { TruckDetailSheet } from '../components/TruckDetailSheet';
import { TripDetailModal } from '../components/TripDetailModal';
import arrowRightSvg from '../assets/arrow-right.svg';

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
  const [selectedTruckIdx, setSelectedTruckIdx] = useState(null);
  const [showTripDetail, setShowTripDetail] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { isConnected, lastUpdate } = useWebSocket(id);
  const trucksRef = useRef(null);

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
  const assignedTrucks = []; // Empty array - show empty state
  const canTrack = trip.estado === 'en_curso' && (trip.trackingActivo || trip.rutaCompleta?.length > 0);

  // Pricing
  const proposedPrice = formatPrice(trip.precios?.precioPropuesto);
  const confirmedPrice = formatPrice(trip.precios?.precioConfirmado);
  const finalPrice = formatPrice(trip.precios?.precioFinal);
  const displayPrice = finalPrice || confirmedPrice || proposedPrice;
  const priceLabel = finalPrice ? 'Final' : confirmedPrice ? 'Confirmada' : 'Propuesta';

  return (
    <div className="flex flex-col gap-6">

      {/* ── Mobile layout ────────────────────────── md:hidden */}
      <div className="md:hidden flex flex-col gap-4">
        <Breadcrumb parentLabel="Mis Viajes" parentPath="/viajes" currentLabel="Detalle del viaje" />
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl font-bold text-gray-900">
            Viaje {trip.numeroViaje ? `#${trip.numeroViaje}` : ''}
          </h1>
          <StatusBadge status={trip.estado} />
        </div>
        {trip.estado === 'solicitado' && (
          <div
            className="rounded-2xl px-4 py-4"
            style={{ background: 'rgba(108, 178, 255, 0.15)' }}
          >
            <p className="text-sm font-medium" style={{ color: '#3590F3' }}>
              Tu solicitud está siendo revisada. Una vez que el equipo confirme la tarifa final, podrás visualizar el seguimiento de los camiones.
            </p>
          </div>
        )}
        <TripSummaryCard
          trip={trip}
          onVerDetalle={() => setShowTripDetail(true)}
        />
      </div>

      {/* ── Desktop layout ───────────────────────── hidden md:flex */}
      <div className="hidden md:flex md:flex-col md:gap-6">
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
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setShowDetailModal(true)}>
              Ver detalle
            </Button>
            {canTrack && (
              <Button onClick={() => setShowTracking((v) => !v)}>
                {showTracking ? 'Ocultar mapa' : 'Ver tracking'}
              </Button>
            )}
          </div>
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
      </div>{/* end desktop layout */}

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
      <div ref={trucksRef} className="flex flex-col gap-3 md:gap-0 md:bg-white md:rounded-2xl md:border md:border-[#DEDEDE] md:overflow-hidden">

        {/* Title + progress — floating on mobile, inside card on desktop */}
        <div className="md:px-6 md:pt-5 md:pb-4">
          <h2 className="text-base font-semibold text-gray-900">Detalle de camiones</h2>
          {assignedTrucks.length > 0 && (() => {
            const covered = assignedTrucks.filter(
              (r) => r.estado && r.estado !== 'Pendiente'
            ).length;
            const total = assignedTrucks.length;
            const pct = total > 0 ? Math.round((covered / total) * 100) : 0;
            return (
              <div
                className="mt-3 p-3"
                style={{ background: '#F1F8F3', border: '1px solid #BFDBC5', borderRadius: 16 }}
              >
                {/* Mobile: stacked */}
                <div className="md:hidden mb-4">
                  <p className="text-sm font-medium" style={{ color: '#45845C' }}>Progreso de asignación</p>
                  <p className="text-sm font-regular mt-2" style={{ color: '#45845C' }}>{covered} de {total} camiones cubiertos</p>
                </div>
                {/* Desktop: inline */}
                <div className="hidden md:flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: '#45845C' }}>Progreso de asignación</span>
                  <span className="text-sm font-regular" style={{ color: '#45845C' }}>{covered} de {total} camiones cubiertos</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: '#DEEDE0' }}>
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background: 'linear-gradient(90deg, #37784C, #5F9C73)',
                      minWidth: pct > 0 ? 8 : 0,
                    }}
                  />
                </div>
              </div>
            );
          })()}
        </div>

        {/* Truck list — own white card on mobile, seamless on desktop */}
        {assignedTrucks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#DEDEDE] md:border-0 md:rounded-none flex flex-col items-center justify-center py-16 px-6 text-center shadow-[0px_1px_34px_0px_rgba(16,24,40,0.08)] md:shadow-none">
            <EmptyIllustration />
            <p className="mt-5 text-base font-semibold text-gray-700">Aún no hay datos para mostrar</p>
            <p className="mt-1 text-sm text-gray-400">
              Cuando confirmes las tarifas, podrás asignar camiones y choferes
            </p>
          </div>
        ) : (
          <>
            {/* Mobile: lista numerada */}
            <div className="md:hidden bg-white rounded-2xl border border-[#DEDEDE] overflow-hidden divide-y divide-[#DEDEDE]">
              {assignedTrucks.map((row, i) => {
                const choferName = row.chofer?.nombre || row.choferNombre || 'Sin chofer';
                const patente = row.patente ||
                  (row.camionOptions?.find((c) => c._id === row.camionId)?.patente) ||
                  'Patente a confirmar';
                const truckId = row.truckId || row._id?.slice(-6).toUpperCase() || `C-${i + 1}`;
                return (
                  <div
                    key={row._id || i}
                    className="flex items-center gap-3 px-4 py-4 bg-white cursor-pointer active:bg-gray-50"
                    onClick={() => setSelectedTruckIdx(i)}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#F6F6F6] flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-[#888888]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-[#363636]">{choferName}</span>
                        <StatusBadge status={row.estado || row.status || 'Pendiente'} />
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {`#${truckId}`}
                        {' • '}
                        {patente}
                      </p>
                    </div>
                    <div className="w-9 h-9 rounded-full border border-[#DEDEDE] bg-white flex items-center justify-center flex-shrink-0">
                      <img src={arrowRightSvg} alt="" width={20} height={20} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop: tabla */}
            <div className="hidden md:block border-t border-[#DEDEDE] px-6 py-6">
              <DataTable
                columns={[
                  { key: 'id', label: 'ID Camión' },
                  { key: 'tipo', label: 'Tipo' },
                  { key: 'estado', label: 'Estado' },
                  { key: 'chofer', label: 'Chofer' },
                  { key: 'patente', label: 'Patente' },
                  { key: 'carta', label: 'Carta de porte' },
                  { key: 'seguimiento', label: 'Seguimiento' },
                  { key: 'accionable', label: 'Accionable', align: 'right' },
                ]}
                data={assignedTrucks}
                renderRow={(row, i) => (
                  <tr key={row._id || i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {row.truckId || row._id?.slice(-6).toUpperCase() || `C-${i + 1}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#363636]">{row.tipo || '—'}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={row.estado || row.status || 'Pendiente'} />
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
                      <StatusBadge status={row.cartaDePorte || 'Pendiente'} />
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="outline" size="sm" disabled>
                        Ver ubicación
                      </Button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm" onClick={() => setSelectedTruckIdx(i)}>
                        Ver detalle
                      </Button>
                    </td>
                  </tr>
                )}
              />
            </div>
          </>
        )}
      </div>

      {/* Trip detail modal (desktop) */}
      <TripDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        trip={trip}
      />

      {/* Trip detail sheet (mobile - Ver detalle button) */}
      {showTripDetail && (
        <TruckDetailSheet
          trip={trip}
          onClose={() => setShowTripDetail(false)}
        />
      )}

      {selectedTruckIdx !== null && (
        <TruckDetailSheet
          truck={assignedTrucks[selectedTruckIdx]}
          index={selectedTruckIdx}
          total={assignedTrucks.length}
          onClose={() => setSelectedTruckIdx(null)}
          onPrev={() => setSelectedTruckIdx((i) => Math.max(0, i - 1))}
          onNext={() => setSelectedTruckIdx((i) => Math.min(assignedTrucks.length - 1, i + 1))}
        />
      )}
    </div>
  );
};
