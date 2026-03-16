import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import tripService from '../services/trip.service';
import { StatusBadge } from '../components/StatusBadge';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return '—';
  return d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

const formatPrice = (value) => {
  if (!value && value !== 0) return null;
  return `$${Number(value).toLocaleString('es-AR')}`;
};

// --- Icons ---
const IconRoute = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="5" cy="12" r="3" stroke="#888888" strokeWidth="2" />
    <circle cx="19" cy="12" r="3" stroke="#888888" strokeWidth="2" />
    <path d="M8 12H16" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" />
  </svg>
);

const IconTruck = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M1 3H15V16H1V3Z" stroke="#888888" strokeWidth="2" strokeLinejoin="round" />
    <path d="M15 8H18L21 11V16H15V8Z" stroke="#888888" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="5.5" cy="18.5" r="2.5" stroke="#888888" strokeWidth="2" />
    <circle cx="18.5" cy="18.5" r="2.5" stroke="#888888" strokeWidth="2" />
  </svg>
);

const IconCard = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripService.getById(id)
      .then(setTrip)
      .catch(() => navigate('/viajes'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Viaje no encontrado</p>
      </div>
    );
  }

  const originCity = trip.origen?.ciudad || '—';
  const destCity = trip.destino?.ciudad || '—';
  const distanceKm = trip.distanciaKm ? `${trip.distanciaKm} km` : null;
  const requestedTrucks = trip.camionesSolicitados ?? 0;

  const basePrice = formatPrice(trip.precios?.precioBase);
  const proposedPrice = formatPrice(trip.precios?.precioPropuesto);
  const confirmedPrice = formatPrice(trip.precios?.precioConfirmado);
  const finalPrice = formatPrice(trip.precios?.precioFinal);
  const displayPrice = finalPrice || confirmedPrice || proposedPrice || basePrice;
  const priceLabel = finalPrice ? 'Final' : confirmedPrice ? 'Confirmada' : proposedPrice ? 'Propuesta' : 'Tentativo';

  return (
    <div className="space-y-6">
      {/* Breadcrumb + fecha */}
      <div className="flex items-center justify-between">
        <nav className="flex items-center gap-1 text-sm">
          <Link to="/viajes" className="text-gray-500 hover:text-gray-700">Viajes</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium">Detalle del viaje</span>
        </nav>
        <span className="text-sm text-gray-400">{formatDate(trip.fechaProgramada)}</span>
      </div>

      {/* Título + estado */}
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-3xl font-bold text-gray-900">
          Viaje {trip.numeroViaje ? `#${trip.numeroViaje}` : ''}
        </h1>
        <StatusBadge status={trip.estado} />
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

        {/* Tarifas */}
        <div
          className="rounded-2xl p-5 flex flex-col justify-between"
          style={{ background: 'linear-gradient(135deg, #37784C 0%, #5F9C73 100%)' }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <IconCard />
              </div>
              <span className="text-sm font-semibold text-white">Tarifas</span>
            </div>
            {displayPrice && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full text-white" style={{ background: 'rgba(255,255,255,0.18)' }}>
                {priceLabel}: {displayPrice}
              </span>
            )}
          </div>
          <p className="text-sm text-white opacity-80">
            {displayPrice
              ? `Tarifa ${priceLabel.toLowerCase()}: ${displayPrice}`
              : 'El precio se mostrará cuando esté disponible'}
          </p>
        </div>
      </div>

      {/* Información del viaje */}
      <div className="bg-white rounded-2xl shadow border border-[#DEDEDE] p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Información del viaje</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Origen</span>
            <p className="font-medium text-gray-900 mt-0.5">
              {trip.origen?.direccion
                ? `${trip.origen.direccion}, ${trip.origen.ciudad}, ${trip.origen.provincia}`
                : `${trip.origen?.ciudad || '—'}, ${trip.origen?.provincia || ''}`}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Destino</span>
            <p className="font-medium text-gray-900 mt-0.5">
              {trip.destino?.direccion
                ? `${trip.destino.direccion}, ${trip.destino.ciudad}, ${trip.destino.provincia}`
                : `${trip.destino?.ciudad || '—'}, ${trip.destino?.provincia || ''}`}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Tipo de carga</span>
            <p className="font-medium text-gray-900 mt-0.5 capitalize">{trip.tipoCarga || '—'}</p>
          </div>
          <div>
            <span className="text-gray-500">Peso</span>
            <p className="font-medium text-gray-900 mt-0.5">{trip.peso ? `${trip.peso} tn` : '—'}</p>
          </div>
          <div>
            <span className="text-gray-500">Fecha programada</span>
            <p className="font-medium text-gray-900 mt-0.5">{formatDate(trip.fechaProgramada)}</p>
          </div>
          <div>
            <span className="text-gray-500">Tipo de destino</span>
            <p className="font-medium text-gray-900 mt-0.5 capitalize">{trip.tipoDestino || '—'}</p>
          </div>
          {trip.notas && (
            <div className="sm:col-span-2">
              <span className="text-gray-500">Notas</span>
              <p className="font-medium text-gray-900 mt-0.5">{trip.notas}</p>
            </div>
          )}
        </div>
      </div>

      {/* Check-ins */}
      {trip.checkIns?.length > 0 && (
        <div className="bg-white rounded-2xl shadow border border-[#DEDEDE] p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Seguimiento</h2>
          <div className="space-y-3">
            {trip.checkIns.map((ci, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900 capitalize">{ci.tipo?.replace(/_/g, ' ') || '—'}</p>
                  {ci.timestamp && (
                    <p className="text-xs text-gray-500">
                      {new Date(ci.timestamp).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                  {ci.notas && <p className="text-xs text-gray-400 mt-0.5">{ci.notas}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transportista asignado */}
      {trip.transportista && (
        <div className="bg-white rounded-2xl shadow border border-[#DEDEDE] p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Transportista asignado</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Empresa</span>
              <p className="font-medium text-gray-900 mt-0.5">{trip.transportista.razonSocial || '—'}</p>
            </div>
            <div>
              <span className="text-gray-500">Conductor</span>
              <p className="font-medium text-gray-900 mt-0.5">{trip.transportista.nombreConductor || '—'}</p>
            </div>
            {trip.transportista.telefono && (
              <div>
                <span className="text-gray-500">Teléfono</span>
                <p className="font-medium text-gray-900 mt-0.5">{trip.transportista.telefono}</p>
              </div>
            )}
          </div>
        </div>
      )}

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
