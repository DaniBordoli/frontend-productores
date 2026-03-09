import { Link } from 'react-router-dom';
import ArrowRight from '../assets/arrow-right.svg';

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('es-AR') : '-');

export const PendingTripCard = ({ trip }) => (
  <div className="rounded-[16px] bg-white border border-[#E8E8E8] shadow-sm p-4 flex items-center justify-between gap-3">
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <span className="text-base font-bold text-gray-900">
          {trip.camionesSolicitados || '—'} camiones
        </span>
        <span className="px-3 py-1 rounded-full bg-[#F6F6F6] text-sm text-[#888888]">
          {fmtDate(trip.fechaProgramada)}
        </span>
      </div>
      <p className="text-sm text-[#888888]">
        {trip.origen?.ciudad || '-'} → {trip.destino?.ciudad || '-'}
      </p>
    </div>
    <Link to={`/viajes/${trip._id}`} className="shrink-0">
      <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors">
        <img src={ArrowRight} alt="Ver detalle" className="w-5 h-5" />
      </button>
    </Link>
  </div>
);
