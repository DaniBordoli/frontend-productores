import { useState } from 'react';
import { X } from 'lucide-react';
import StarEmptyIcon from '../assets/StarEmpty.svg';
import StarFilledIcon from '../assets/StarFilled.svg';
import CheckCircle from '../assets/CheckCircle.svg';

// Driver rating item component
const DriverRatingItem = ({ driver, rating, comment, onRatingChange, onCommentChange }) => {
  const initials = driver.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="py-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: '#F1F8F3', color: '#37784C' }}>
            {initials}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{driver.name}</p>
            <p className="text-sm text-gray-500">{driver.truck}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => onRatingChange(star)}
              className="p-1 hover:scale-110 transition-transform"
            >
              <img
                src={star <= rating ? StarFilledIcon : StarEmptyIcon}
                alt=""
                className="w-6 h-6"
              />
            </button>
          ))}
        </div>
      </div>
      <input
        type="text"
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
        placeholder="Ingrese su comentario aquí"
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-gray-300 text-sm"
        style={{ boxShadow: '0px 1px 34px 0px #10182814' }}
      />
    </div>
  );
};

export const RateDriversModal = ({ isOpen, onClose, tripData }) => {
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Default mock data if no tripData provided
  const defaultDrivers = [
    { id: '1', name: 'Carlos Mendoza', truck: 'Camión ABC 1234' },
    { id: '2', name: 'Oscar Martinez', truck: 'Camión ABC 1234' },
    { id: '3', name: 'Pablo Gonzalez', truck: 'Camión ABC 1234' },
  ];

  const drivers = tripData?.drivers || defaultDrivers;
  const tripNumber = tripData?.tripNumber || '#VJ-2024-001';
  const tripDate = tripData?.date || '17/02/2026';

  const handleRatingChange = (driverId, rating) => {
    setRatings(prev => ({ ...prev, [driverId]: rating }));
  };

  const handleCommentChange = (driverId, comment) => {
    setComments(prev => ({ ...prev, [driverId]: comment }));
  };

  const ratedCount = Object.values(ratings).filter(r => r > 0).length;
  const totalDrivers = drivers.length;

  const handleSave = () => {
    // Submit ratings
    console.log('Ratings:', ratings);
    console.log('Comments:', comments);
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setRatings({});
    setComments({});
    onClose();
  };

  if (!isOpen) return null;

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50">
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ background: '#0000001F', backdropFilter: 'blur(23.1px)' }}
        >
          <div className="bg-white shadow-lg flex flex-col items-center justify-center px-10" style={{ width: 460, height: 302, borderRadius: 32 }}>
            <div className="flex items-center justify-center rounded-full mb-6" style={{ width: 80, height: 80, background: '#EAF5ED' }}>
              <img src={CheckCircle} alt="" style={{ width: 44, height: 44 }} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">¡Puntuación cargada correctamente!</h2>
            <p className="text-gray-500 text-sm mb-8 text-center">Los valores cargados fueron actualizados en el detalle de cada chofer.</p>
            <button
              onClick={handleSuccessClose}
              className="w-full py-3 rounded-full font-medium text-base text-white"
              style={{ background: 'linear-gradient(135deg, #37784C 0%, #5F9C73 100%)', borderRadius: 80 }}
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop con blur */}
      <div 
        className="fixed inset-0" 
        style={{ background: '#0000001F', backdropFilter: 'blur(23.1px)' }}
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
        <div 
          className="bg-white w-full flex flex-col"
          style={{ 
            width: 673, 
            maxHeight: 724, 
            borderRadius: 32,
            boxShadow: '0px 1px 34px 0px #10182814'
          }}
        >
          {/* Header - fixed */}
          <div className="flex items-start justify-between px-8 pt-8 pb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Calificá a los choferes</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Trip info - fixed */}
          <div className="flex items-center justify-between px-8 pb-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">Viaje <span className="underline underline-offset-4">{tripNumber}</span></span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">{tripDate}</span>
            </div>
            <span className="text-gray-500">{ratedCount}/{totalDrivers} calificados</span>
          </div>

          {/* Divider - solo una línea */}
          <div className="border-b border-gray-200 mx-8" />

          {/* Drivers list - scrollable */}
          <div className="flex-1 overflow-y-auto px-8" style={{ maxHeight: 'calc(724px - 260px)' }}>
            {drivers.map((driver, index) => (
              <div key={driver.id}>
                <DriverRatingItem
                  driver={driver}
                  rating={ratings[driver.id] || 0}
                  comment={comments[driver.id] || ''}
                  onRatingChange={(rating) => handleRatingChange(driver.id, rating)}
                  onCommentChange={(comment) => handleCommentChange(driver.id, comment)}
                />
                {index < drivers.length - 1 && <div className="border-b border-gray-200" />}
              </div>
            ))}
          </div>

          {/* Save button - fixed */}
          <div className="px-8 pt-4 pb-8 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={ratedCount === 0}
              className="w-full py-4 rounded-full font-medium text-base text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              style={{ 
                background: ratedCount > 0 ? 'linear-gradient(135deg, #37784C 0%, #5F9C73 100%)' : '#E5E5E5',
                borderRadius: 80,
                color: ratedCount > 0 ? 'white' : '#999999'
              }}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateDriversModal;
