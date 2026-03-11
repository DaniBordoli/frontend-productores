import { useEffect, useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

// ── Inline SVG icons (match TripModal style) ─────────────────────────────────
const IconPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2ZM12 11.5C10.6193 11.5 9.5 10.3807 9.5 9C9.5 7.61929 10.6193 6.5 12 6.5C13.3807 6.5 14.5 7.61929 14.5 9C14.5 10.3807 13.3807 11.5 12 11.5Z" fill="#888888"/>
  </svg>
);
const IconCity = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 3C9.51472 3 7.5 5.01472 7.5 7.5C7.5 10.9397 11.2611 15.3479 12 16.2051C12.7389 15.3479 16.5 10.9397 16.5 7.5C16.5 5.01472 14.4853 3 12 3ZM12 9.5C10.8954 9.5 10 8.60457 10 7.5C10 6.39543 10.8954 5.5 12 5.5C13.1046 5.5 14 6.39543 14 7.5C14 8.60457 13.1046 9.5 12 9.5Z" fill="#888888"/>
    <path d="M5 20C5 18.3431 8.13401 17 12 17C15.866 17 19 18.3431 19 20V21H5V20Z" fill="#888888"/>
  </svg>
);
const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#888888" strokeWidth="2"/>
    <path d="M12 8V16M8 12H16" stroke="#888888" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IconFile = () => (
  <svg width="14" height="16" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M2 0C0.895431 0 0 0.895431 0 2V20C0 21.1046 0.895431 22 2 22H16C17.1046 22 18 21.1046 18 20V7L11 0H2ZM10 2H2V20H16V8H11C10.4477 8 10 7.55228 10 7V2ZM12 2.82843L15.1716 6H12V2.82843Z" fill="#888888"/>
  </svg>
);
const IconTruck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 3C1 2.44772 1.44772 2 2 2H15C15.5523 2 16 2.44772 16 3V16H1V3Z" fill="#888888"/>
    <path d="M16 7H19.382C19.7607 7 20.107 7.214 20.2764 7.5528L22.8944 12.7889C22.9639 12.9279 23 13.0813 23 13.2361V18C23 18.5523 22.5523 19 22 19H16V7Z" fill="#888888"/>
    <circle cx="5.5" cy="18.5" r="2.5" fill="#888888"/>
    <circle cx="18.5" cy="18.5" r="2.5" fill="#888888"/>
    <rect x="1" y="16" width="22" height="2" fill="#888888"/>
  </svg>
);
const IconSun = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="4" fill="#888888"/>
    <path d="M12 2V5M12 19V22M2 12H5M19 12H22M4.93 4.93L7.05 7.05M16.95 16.95L19.07 19.07M19.07 4.93L16.95 7.05M7.05 16.95L4.93 19.07" stroke="#888888" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmt = (n) => n != null ? Number(n).toLocaleString('es-AR') : '—';

const PillReadOnly = ({ label, icon, value }) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      <span className="absolute left-[6px] top-1/2 -translate-y-1/2 flex items-center justify-center bg-[#F6F6F6] rounded-full w-[38px] h-[38px] z-10 pointer-events-none">
        {icon}
      </span>
      <div
        className="w-full pl-[52px] pr-3 h-[50px] flex items-center border border-transparent bg-white text-sm text-gray-700"
        style={{ borderRadius: 80, boxShadow: '0 0 8px rgba(0,0,0,0.10)' }}
      >
        {value || <span className="text-[#B0B0B0]">—</span>}
      </div>
    </div>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-xs text-[#888888]">{label}</span>
    <span className="text-xs text-gray-700 font-medium">{value}</span>
  </div>
);

const TruckTypeSection = ({ label, units, totalPrice, tarifaKm, distancia, toneladas, valorCamion }) => {
  const [open, setOpen] = useState(false);
  const valorTotal = totalPrice ?? (valorCamion != null && units ? valorCamion * units : null);

  return (
    <div>
      {/* Summary row */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 py-3"
      >
        <span className="flex items-center justify-center bg-[#F6F6F6] rounded-full w-[38px] h-[38px] flex-shrink-0">
          <IconTruck />
        </span>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          <p className="text-xs text-[#888888]">{units ?? 0} unidades</p>
        </div>
        <span className="text-sm font-semibold text-gray-900 mr-1">
          {valorTotal != null ? `$${fmt(valorTotal)}` : '—'}
        </span>
        {open
          ? <ChevronUp size={16} className="text-[#888888] flex-shrink-0" />
          : <ChevronDown size={16} className="text-[#888888] flex-shrink-0" />
        }
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="ml-[51px] mr-1 mb-2 rounded-xl border border-[#F0F0F0] bg-white px-4">
          <DetailRow label="Tarifa x km" value={tarifaKm != null ? fmt(tarifaKm) : '—'} />
          <DetailRow label="Distancia" value={distancia != null ? fmt(distancia) : '—'} />
          <DetailRow label="Toneladas" value={toneladas != null ? fmt(toneladas) : '—'} />
          <div className="border-t border-[#F0F0F0] mt-1 pt-1">
            <DetailRow label="Valor del camión" value={valorCamion != null ? fmt(valorCamion) : '—'} />
            <DetailRow label={`Valor ${units ?? 0} camiones`} value={valorTotal != null ? fmt(valorTotal) : '—'} />
          </div>
        </div>
      )}
    </div>
  );
};

const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

export const TripDetailModal = ({ isOpen, onClose, trip }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !trip) return null;

  const origin = trip.origen || {};
  const destination = trip.destino || {};
  const cargoType = trip.tipoCarga || trip.cargoType || '';
  const requestedTrucks = trip.camionesSolicitados ?? trip.requestedTrucks ?? 0;
  const recommendedTrucks = trip.camionesRecomendados ?? trip.recommendedTrucks ?? 0;
  const destinationType = trip.tipoDestino || trip.destinationType || '';

  // Pricing
  const tarifaKm = trip.precios?.tarifaKm ?? trip.precios?.precioFinal ?? trip.precios?.precioConfirmado ?? trip.precios?.precioPropuesto ?? null;
  const distancia = trip.distancia ?? null;
  const tonComunes = trip.precios?.toneladasComunes ?? trip.peso ?? null;
  const tonEscalables = trip.precios?.toneladasEscalables ?? tonComunes;
  const valorCamionComun = (tarifaKm != null && distancia != null && tonComunes != null) ? tarifaKm * distancia * tonComunes : null;
  const valorCamionEscalable = (tarifaKm != null && distancia != null && tonEscalables != null) ? tarifaKm * distancia * tonEscalables : null;
  const totalComunes = valorCamionComun != null ? valorCamionComun * requestedTrucks : null;
  const totalEscalables = valorCamionEscalable != null ? valorCamionEscalable * recommendedTrucks : null;
  const grandTotal = (totalComunes ?? 0) + (totalEscalables ?? 0);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: '#0000001F', backdropFilter: 'blur(23.1px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-3">
          <h2 className="text-xl font-semibold text-gray-900">
            Detalle del viaje {trip.numeroViaje ? `#${trip.numeroViaje}` : ''}
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-full border border-[#DEDEDE] shadow-md"
            style={{ width: 32, height: 32 }}
          >
            <X className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>

        <div className="px-6 pb-6 pt-1 space-y-5">

          {/* ── Información de origen ── */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Información de origen</h3>
            <div className="grid grid-cols-2 gap-3">
              <PillReadOnly label="Calle*" icon={<IconPin />} value={origin.direccion || origin.address} />
              <PillReadOnly label="Ciudad*" icon={<IconCity />} value={origin.ciudad || origin.city} />
              <PillReadOnly label="Provincia*" icon={<IconPlus />} value={origin.provincia || origin.province} />
              <PillReadOnly label="Código postal*" icon={<IconFile />} value={origin.codigoPostal || origin.postalCode} />
            </div>
          </div>

          {/* ── Información de destino ── */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Información de destino</h3>
            <div className="grid grid-cols-2 gap-3">
              <PillReadOnly label="Calle*" icon={<IconPin />} value={destination.direccion || destination.address} />
              <PillReadOnly label="Ciudad*" icon={<IconCity />} value={destination.ciudad || destination.city} />
              <PillReadOnly label="Provincia*" icon={<IconPlus />} value={destination.provincia || destination.province} />
              <PillReadOnly label="Código postal*" icon={<IconFile />} value={destination.codigoPostal || destination.postalCode} />
              <div className="col-span-2">
                <PillReadOnly label="Puerto/Acopio*" icon={<IconPlus />} value={capitalize(destinationType)} />
              </div>
            </div>
          </div>

          {/* ── Información de la carga ── */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Información de la carga</h3>
            <div className="grid grid-cols-2 gap-3">
              <PillReadOnly label="Camiones comunes*" icon={<IconTruck />} value={requestedTrucks ? String(requestedTrucks) : ''} />
              <PillReadOnly label="Camiones escalables*" icon={<IconTruck />} value={recommendedTrucks ? String(recommendedTrucks) : ''} />
              <PillReadOnly label="Tipo de grano*" icon={<IconSun />} value={capitalize(cargoType)} />
            </div>
          </div>

          {/* ── Camiones y tarifas ── */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Camiones y tarifas</h3>
            <div className="rounded-2xl bg-white shadow-md p-4">
              <TruckTypeSection
                label="Camiones comunes"
                units={requestedTrucks}
                totalPrice={totalComunes}
                tarifaKm={tarifaKm}
                distancia={distancia}
                toneladas={tonComunes}
                valorCamion={valorCamionComun}
              />
              <TruckTypeSection
                label="Camiones escalables"
                units={recommendedTrucks}
                totalPrice={totalEscalables}
                tarifaKm={tarifaKm}
                distancia={distancia}
                toneladas={tonEscalables}
                valorCamion={valorCamionEscalable}
              />
              {/* Total */}
              <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#F0F0F0]">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-base font-bold text-gray-900">
                  {grandTotal > 0 ? `$${fmt(grandTotal)}` : '—'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TripDetailModal;
