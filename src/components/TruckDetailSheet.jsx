import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Loader, User, Truck, Calendar, Paperclip, ArrowUpRight, MapPin, FileText } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

const Row = ({ icon, label, children }) => (
  <div className="flex items-center justify-between py-4 border-b border-[#F0F0F0] last:border-0">
    <div className="flex items-center gap-3 text-sm text-[#363636]">
      <span className="text-[#888888]">{icon}</span>
      {label}
    </div>
    <div className="text-sm text-[#888888]">{children}</div>
  </div>
);

export const TruckDetailSheet = ({ truck, index, total, onClose, onPrev, onNext }) => {
  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const truckId = truck.truckId || truck._id?.slice(-6).toUpperCase() || `C-${index + 1}`;
  const choferName = truck.chofer?.nombre || truck.choferNombre || null;
  const patente = truck.patente || null;
  const checkIns = truck.checkIns?.length ?? 0;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end md:items-stretch md:justify-end"
      style={{ background: 'rgba(0,0,0,0.122)', backdropFilter: 'blur(23.1px)', WebkitBackdropFilter: 'blur(23.1px)' }}
      onClick={onClose}
    >
      {/* Sheet panel */}
      <div
        className="w-full h-[75vh] md:w-[520px] md:h-full bg-white rounded-t-3xl md:rounded-t-none md:rounded-l-2xl flex flex-col animate-slide-up md:animate-slide-from-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Fixed header ── */}
        <div className="flex-shrink-0 px-6 pt-5 pb-4">
          <div className="flex items-center justify-between mb-5">
            {/* Prev / Next */}
            <div className="flex items-center gap-2">
              <button
                onClick={onPrev}
                disabled={index === 0}
                className="w-9 h-9 rounded-full border border-[#DEDEDE] bg-white flex items-center justify-center disabled:opacity-40"
              >
                <ChevronLeft size={18} className="text-[#363636]" />
              </button>
              <button
                onClick={onNext}
                disabled={index === total - 1}
                className="w-9 h-9 rounded-full border border-[#DEDEDE] bg-white flex items-center justify-center disabled:opacity-40"
              >
                <ChevronRight size={18} className="text-[#363636]" />
              </button>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full border border-[#DEDEDE] bg-white flex items-center justify-center"
            >
              <X size={18} className="text-[#363636]" />
            </button>
          </div>

          {/* Badge + Title on the same line */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#DEEDE0] flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-[#45845C]">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#1A1A1A]">
              Detalle del camión #{truckId}
            </h2>
          </div>
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto px-6 pb-8">

          {/* Info rows */}
          <div className="mb-2">
            <Row icon={<Loader size={18} />} label="Estado">
              <StatusBadge status={truck.estado || 'pendiente'} />
            </Row>
            <Row icon={<User size={18} />} label="Chofer">
              {choferName ?? <span className="text-[#CCCCCC]">Vacío</span>}
            </Row>
            <Row icon={<Truck size={18} />} label="Camión">
              {patente ?? <span className="text-[#CCCCCC]">Vacío</span>}
            </Row>
            <Row icon={<Calendar size={18} />} label="Fecha de inicio">
              {truck.fechaInicio
                ? new Date(truck.fechaInicio).toLocaleDateString('es-AR')
                : <span className="text-[#CCCCCC]">Vacío</span>}
            </Row>
            <Row icon={<Calendar size={18} />} label="Fecha de finalización">
              {truck.fechaFin
                ? new Date(truck.fechaFin).toLocaleDateString('es-AR')
                : <span className="text-[#CCCCCC]">Vacío</span>}
            </Row>
            <Row icon={<Paperclip size={18} />} label="Carta de porte">
              <StatusBadge status={truck.cartaDePorte || 'pendiente'} />
            </Row>
            <Row icon={<ArrowUpRight size={18} />} label="Check-ins">
              {checkIns > 0
                ? `${checkIns} registros`
                : <span className="text-[#CCCCCC]">Vacío</span>}
            </Row>
          </div>

          {/* Seguimiento */}
          <div className="border-t border-[#DEDEDE] pt-5 mt-2 mb-5">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={20} className="text-[#1A1A1A]" />
              <h3 className="text-base font-bold text-[#1A1A1A]">Seguimiento</h3>
            </div>
            <p className="text-sm text-[#888888]">
              Todavía no hay una ubicación para mostrar. Cuando esté disponible, vas a ver el mapa acá.
            </p>
          </div>

          {/* Documentos */}
          <div className="border-t border-[#DEDEDE] pt-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText size={20} className="text-[#1A1A1A]" />
                <h3 className="text-base font-bold text-[#1A1A1A]">Documentos</h3>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-[#363636] rounded-xl bg-white border border-[#DEDEDE] hover:bg-gray-50 transition-colors whitespace-nowrap">
                Cargar documentos
              </button>
            </div>
            <p className="text-sm text-[#888888]">
              De momento no tienes documentos asociados a este viaje.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TruckDetailSheet;
