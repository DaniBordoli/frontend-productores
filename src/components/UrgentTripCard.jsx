import { Link } from 'react-router-dom';
import AlertCircle from '../assets/alert-circle.svg';
import ElipseTrip from '../assets/ElipseTrip.svg';
import ArrowRight from '../assets/arrow-right.svg';

const fmtShort = (d) => {
  if (!d) return '-';
  const dt = new Date(d);
  const day = dt.getDate();
  const month = dt.getMonth() + 1;
  const hh = String(dt.getHours()).padStart(2, '0');
  const min = String(dt.getMinutes()).padStart(2, '0');
  return `${day}/${month} ${hh}:${min} hs`;
};

export const UrgentTripCard = ({ trip, problema }) => (
  <div className="rounded-[16px] overflow-hidden shadow-sm border border-[#E8E8E8]">
    {/* Gradient header */}
    <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#DBB765] to-[#F8DF60]">
      <img src={AlertCircle} alt="Alerta" className="w-5 h-5 shrink-0 brightness-0 invert" />
      <span className="text-sm font-medium text-white">{problema}</span>
    </div>

    {/* Card body */}
    <div className="p-4 bg-white">
      <h3 className="text-base font-bold text-gray-900 mb-4">
        Viaje n° {trip.numeroViaje || '-'}
      </h3>

      {/* Route */}
      <div className="flex gap-3 mb-5">
        {/* Icon column */}
        <div className="flex flex-col items-center pt-1">
          <div className="w-10 h-10 rounded-full bg-[#F6F6F6] shadow-sm flex items-center justify-center shrink-0">
            <img src={ElipseTrip} alt="" className="w-5 h-5" />
          </div>
          <div className="flex-1 min-h-[20px] my-1" style={{ borderLeft: '2px dashed #CCCCCC' }} />
          <div className="w-10 h-10 rounded-full bg-[#F6F6F6] shadow-sm flex items-center justify-center shrink-0">
            <img src={ElipseTrip} alt="" className="w-5 h-5" />
          </div>
        </div>

        {/* Text column */}
        <div className="flex flex-col justify-between flex-1 gap-3">
          <div>
            <p className="text-xs text-[#888888] mb-0.5">Inicio</p>
            <p className="text-sm font-semibold text-gray-900 leading-snug">
              {trip.origen?.ciudad}
              {trip.origen?.provincia ? `, Provincia de ${trip.origen.provincia}` : ''}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#888888] mb-0.5">Destino</p>
            <p className="text-sm font-semibold text-gray-900 leading-snug">
              {trip.destino?.ciudad}
              {trip.destino?.provincia ? `, Provincia de ${trip.destino.provincia}` : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#DEDEDE] mb-4 -mx-4" />

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1.5 rounded-full bg-[#F6F6F6] text-sm text-[#888888]">
            {trip.camionesSolicitados ?? '-'} camiones
          </span>
          <span className="px-3 py-1.5 rounded-full bg-[#F6F6F6] text-sm text-[#888888]">
            {fmtShort(trip.fechaProgramada)}
          </span>
        </div>
        <Link to={`/viajes/${trip._id}`}>
          <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors shrink-0">
            <img src={ArrowRight} alt="Ver detalle" className="w-5 h-5" />
          </button>
        </Link>
      </div>
    </div>
  </div>
);
