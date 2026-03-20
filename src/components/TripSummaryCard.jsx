import { useNavigate } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';

const ElipseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10.5" cy="10.5" r="6.5625" fill="#94C1A1" />
    <circle cx="10.5" cy="10.5" r="10" stroke="#94C1A1" strokeWidth="1" />
  </svg>
);

const cityOf = (loc) =>
  loc?.ciudad && loc?.provincia
    ? `${loc.ciudad}, ${loc.provincia}`
    : loc?.ciudad || loc?.provincia || '—';

const formatPrice = (value) => {
  if (!value && value !== 0) return null;
  return `$${Number(value).toLocaleString('es-AR')}`;
};

export const TripSummaryCard = ({ trip, onVerDetalle }) => {
  const navigate = useNavigate();

  const originCity = cityOf(trip.origen);
  const destCity = cityOf(trip.destino);
  const distanceKm = trip.distancia ? `${trip.distancia} km` : null;

  // Truck type badges — grouped from assigned trucks, fallback to requested count
  const assignedTrucks = trip.camiones || [];
  const truckGroups = Object.entries(
    assignedTrucks.reduce((acc, t) => {
      const tipo = (t.tipo || 'común').toLowerCase();
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {})
  );

  const displayPrice =
    formatPrice(trip.precios?.precioFinal) ||
    formatPrice(trip.precios?.precioConfirmado);

  const handleVerDetalle = () => {
    if (onVerDetalle) {
      onVerDetalle();
    } else {
      navigate(`/viajes/${trip._id}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#DEDEDE] overflow-hidden" style={{ boxShadow: '0px 1px 34px 0px rgba(16, 24, 40, 0.08)' }}>

      {/* ── Recorrido ──────────────────────────────── */}
      <div className="px-4 pt-4 pb-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-base font-semibold text-[#363636]">Recorrido</span>
          {distanceKm && (
            <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-[#F6F6F6] text-[#888888]">
              {distanceKm}
            </span>
          )}
        </div>

        <div className="flex gap-3">
          {/* Icon + connector column */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#F1F8F3] flex items-center justify-center md:w-10 md:h-10" style={{ width: 55, height: 55 }}>
              <ElipseIcon />
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-1 py-1 min-h-[24px]">
              <div className="w-1 h-1.5 rounded-full bg-[#DEDEDE]" />
              <div className="w-1 h-1.5 rounded-full bg-[#DEDEDE]" />
              <div className="w-1 h-1.5 rounded-full bg-[#DEDEDE]" />
            </div>
            <div className="w-10 h-10 rounded-full bg-[#F1F8F3] flex items-center justify-center md:w-10 md:h-10" style={{ width: 55, height: 55 }}>
              <ElipseIcon />
            </div>
          </div>

          {/* Text column */}
          <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
            <div>
              <p className="text-xs text-[#888888]">Origen</p>
              <p className="text-sm font-semibold text-[#363636] leading-snug">{originCity}</p>
            </div>
            <div>
              <p className="text-xs text-[#888888]">Destino</p>
              <p className="text-sm font-semibold text-[#363636] leading-snug">{destCity}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#DEDEDE] mx-4" /> 
      <div className="px-4 py-4 flex items-center justify-between gap-3">
        <span className="text-base font-semibold text-[#363636]">Camiones</span>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {truckGroups.length > 0 ? (
            truckGroups.map(([tipo, count]) => (
              <span
                key={tipo}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-[#F6F6F6] text-[#888888]"
              >
                {count} {tipo}
              </span>
            ))
          ) : (
            <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-[#F6F6F6] text-[#888888]">
              {trip.camionesSolicitados ?? 0} solicitados
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-[#DEDEDE] mx-4" /> 
      <div className="px-4 py-4 flex items-center justify-between gap-3">
        <span className="text-base font-semibold text-[#363636]">Tarifa final</span>
        {displayPrice ? (
          <span className="text-sm font-semibold text-[#363636]">{displayPrice}</span>
        ) : (
          <StatusBadge label="Pendiente confirmar" variant="yellow" />
        )}
      </div>

      {/* ── Ver detalle button ──────────────────────── */}
      <div className="px-4 pb-4">
        <button
          onClick={handleVerDetalle}
          className="w-full py-3.5 text-sm font-medium text-[#363636] bg-white hover:bg-gray-50 transition-colors border border-[#DEDEDE]"
          style={{ borderRadius: 80, boxShadow: '0px 1px 34px 0px #10182814' }}
        >
          Ver detalle
        </button>
      </div>

    </div>
  );
};

export default TripSummaryCard;
