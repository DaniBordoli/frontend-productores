import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import UserOutlineIcon from '../assets/UserOutline.svg';
import TruckOutlineIcon from '../assets/TruckOutline.svg';
import CalendarOutlineIcon from '../assets/CalendarOutline.svg';
import PaperClipIcon from '../assets/PaperClip.svg';
import LocationFilledIcon from '../assets/LocationFilled.svg';
import DownloadIcon from '../assets/Download.svg';
import TrashOutlineIcon from '../assets/TrashOutline.svg';

const Row = ({ icon, label, children, showBorder = false }) => (
  <div className={`flex items-center justify-between py-4`}>
    <div className="flex items-center gap-3 text-sm font-semibold" style={{ color: '#7A7A7A' }}>
      <span>{icon}</span>
      {label}
    </div>
    <div className="text-sm" style={{ color: '#B0B0B0' }}>{children}</div>
  </div>
);

export const TruckDetailSheet = ({ truck, trip, index = 0, total = 1, onClose, onPrev, onNext }) => {
  // Local state for documents
  const [documentos, setDocumentos] = useState(truck?.documentos || []);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // If showing trip info instead of truck
  const isTripMode = !truck && trip;
  
  const truckId = truck?.truckId || truck?._id?.slice(-6).toUpperCase() || (isTripMode ? trip?.numeroViaje : `C-${index + 1}`);
  const choferName = truck?.chofer?.nombre || truck?.choferNombre || null;
  const patente = truck?.patente || null;
  const checkIns = truck?.checkIns?.length ?? 0;

  // Handle file upload
  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newDocs = Array.from(files).map(file => ({
      nombre: file.name,
      tamaño: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      file: file
    }));

    setDocumentos(prev => [...prev, ...newDocs]);
  };

  // Handle document deletion
  const handleDeleteDoc = (idx) => {
    setDocumentos(prev => prev.filter((_, i) => i !== idx));
  };

  // Handle document download
  const handleDownloadDoc = (doc) => {
    if (doc.file) {
      const url = URL.createObjectURL(doc.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.nombre;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end md:items-stretch md:justify-end"
      style={{ background: 'rgba(0,0,0,0.122)', backdropFilter: 'blur(23.1px)', WebkitBackdropFilter: 'blur(23.1px)' }}
      onClick={onClose}
    >
      {/* Sheet panel */}
      <div
        className="w-full h-[85vh] md:w-[520px] md:h-full bg-white rounded-t-3xl md:rounded-t-none md:rounded-l-2xl flex flex-col animate-slide-up md:animate-slide-from-right"
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
            {!isTripMode && (
              <div className="w-9 h-9 rounded-full bg-[#DEEDE0] flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-[#45845C]">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
            )}
            <h2 className="text-xl font-semibold text-[#1A1A1A]">
              {isTripMode ? `Detalle del viaje #${truckId}` : `Detalle del camión #${truckId}`}
            </h2>
          </div>
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto px-6 pb-8">

          {/* Info rows */}
          <div className="mb-2">
            <Row icon={<Loader size={18} />} label="Estado">
              <StatusBadge status={isTripMode ? (trip?.estado || 'Pendiente') : (truck.estado || 'Pendiente')} />
            </Row>
            <Row icon={<img src={UserOutlineIcon} alt="" className="w-[18px] h-[18px]" />} label="Chofer">
              {choferName ?? <span className="text-[#CCCCCC]">Vacío</span>}
            </Row>
            <Row icon={<img src={TruckOutlineIcon} alt="" className="w-[18px] h-[18px]" />} label="Camión">
              {patente ?? <span className="text-[#CCCCCC]">Vacío</span>}
            </Row>
            <Row icon={<img src={CalendarOutlineIcon} alt="" className="w-[18px] h-[18px]" />} label="Fecha de inicio">
              {truck?.fechaInicio
                ? new Date(truck.fechaInicio).toLocaleDateString('es-AR')
                : <span className="text-[#CCCCCC]">Vacío</span>}
            </Row>
            <Row icon={<img src={CalendarOutlineIcon} alt="" className="w-[18px] h-[18px]" />} label="Fecha de finalización">
              {truck?.fechaFin
                ? new Date(truck.fechaFin).toLocaleDateString('es-AR')
                : <span className="text-[#CCCCCC]">Vacío</span>}
            </Row>
            <Row icon={<img src={PaperClipIcon} alt="" className="w-[18px] h-[18px]" />} label="Carta de porte">
              <StatusBadge status={truck?.cartaDePorte || 'Pendiente'} />
            </Row>
            <Row icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 17L17 7" stroke="#7A7A7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 7H17V17" stroke="#7A7A7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>} label="Check-ins" showBorder={true}>
              {checkIns > 0
                ? `${checkIns} registros`
                : <span className="text-[#CCCCCC]">Vacío</span>}
            </Row>
          </div>

          {/* Seguimiento */}
          <div className="border-t border-[#DEDEDE] pt-5 mt-2 mb-5">
            <div className="flex items-center gap-2 mb-2">
              <img src={LocationFilledIcon} alt="" className="w-5 h-5" />
              <h3 className="text-base font-semibold text-[#1A1A1A]">Seguimiento</h3>
            </div>
            <p className="text-sm text-[#888888]">
              Todavía no hay una ubicación para mostrar. Cuando esté disponible, vas a ver el mapa acá.
            </p>
          </div>

          {/* Documentos */}
          <div className="border-t border-[#DEDEDE] pt-5">
            <div className="flex items-center gap-2 mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 2.5C12 2.22386 11.7761 2 11.5 2H8C5.79086 2 4 3.79086 4 6V18C4 20.2091 5.79086 22 8 22H16C18.2091 22 20 20.2091 20 18V10.5C20 10.2239 19.7761 10 19.5 10H17C14.2386 10 12 7.76142 12 5V2.5ZM19.2195 8C19.552 8 19.7909 7.67893 19.6312 7.3873C19.4956 7.13969 19.3245 6.91032 19.1213 6.70711L15.2929 2.87868C15.0897 2.67546 14.8603 2.50441 14.6127 2.3688C14.3211 2.20909 14 2.44805 14 2.78055V5C14 6.65685 15.3431 8 17 8H19.2195Z" fill="#363636"/></svg>
              <h3 className="text-base font-semibold text-[#1A1A1A]">Documentos</h3>
            </div>
            
            {/* Document list */}
            {documentos.length > 0 ? (
              <div className="space-y-3">
                {documentos.map((doc, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-3 p-3 border border-[#D5D5D5]"
                    style={{ borderRadius: 12, background: '#FDFDFD' }}
                  >
                    {/* File icon */}
                    <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ background: '#F6F6F6' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2.5C12 2.22386 11.7761 2 11.5 2H8C5.79086 2 4 3.79086 4 6V18C4 20.2091 5.79086 22 8 22H16C18.2091 22 20 20.2091 20 18V10.5C20 10.2239 19.7761 10 19.5 10H17C14.2386 10 12 7.76142 12 5V2.5ZM19.2195 8C19.552 8 19.7909 7.67893 19.6312 7.3873C19.4956 7.13969 19.3245 6.91032 19.1213 6.70711L15.2929 2.87868C15.0897 2.67546 14.8603 2.50441 14.6127 2.3688C14.3211 2.20909 14 2.44805 14 2.78055V5C14 6.65685 15.3431 8 17 8H19.2195Z" fill="#B0B0B0"/>
                      </svg>
                    </div>
                    
                    {/* File info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1A1A1A] truncate">{doc.nombre}</p>
                      <p className="text-xs text-[#888888]">{doc.tamaño}</p>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleDownloadDoc(doc)}
                        className="w-9 h-9 rounded-full bg-white border border-[#DEDEDE] flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <img src={DownloadIcon} alt="Descargar" className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteDoc(idx)}
                        className="w-9 h-9 rounded-full bg-white border border-[#DEDEDE] flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <img src={TrashOutlineIcon} alt="Eliminar" className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#888888]">
                De momento no tienes documentos asociados a este viaje.
              </p>
            )}
          </div>

        </div>

        {/* ── Fixed footer button ── */}
        <div className="flex-shrink-0 px-6 pb-6">
          <input 
            type="file" 
            id="file-upload" 
            multiple 
            className="hidden" 
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <label 
            htmlFor="file-upload"
            className="w-full py-3 text-sm font-medium text-[#363636] bg-white border border-[#DEDEDE] hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center"
            style={{ borderRadius: 80, boxShadow: '0px 1px 34px 0px #10182814' }}
          >
            Cargar documentos
          </label>
        </div>
      </div>
    </div>
  );
};

export default TruckDetailSheet;
