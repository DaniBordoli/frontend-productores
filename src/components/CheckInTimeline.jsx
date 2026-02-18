import { MapPin, Clock, CheckCircle, Package, Truck } from 'lucide-react';

const checkInIcons = {
  llegue_a_cargar: Package,
  cargado_saliendo: Truck,
  en_camino: Truck,
  llegue_a_destino: MapPin,
  descargado: CheckCircle,
};

const checkInLabels = {
  llegue_a_cargar: 'Llegué a cargar',
  cargado_saliendo: 'Cargado, saliendo',
  en_camino: 'En camino',
  llegue_a_destino: 'Llegué a destino',
  descargado: 'Descargado',
};

const checkInColors = {
  llegue_a_cargar: 'bg-blue-100 text-blue-600',
  cargado_saliendo: 'bg-indigo-100 text-indigo-600',
  en_camino: 'bg-purple-100 text-purple-600',
  llegue_a_destino: 'bg-orange-100 text-orange-600',
  descargado: 'bg-green-100 text-green-600',
};

const EMPTY_CHECK_INS = [];

export const CheckInTimeline = ({ checkIns = EMPTY_CHECK_INS }) => {
  if (!checkIns || checkIns.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Check-ins del Viaje</h3>
        <div className="text-center py-8">
          <Clock className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Aún no hay check-ins registrados</p>
          <p className="text-sm text-gray-400 mt-1">
            Los check-ins aparecerán cuando el transportista reporte su estado
          </p>
        </div>
      </div>
    );
  }

  // Ordenar check-ins por fecha (más reciente primero)
  const sortedCheckIns = [...checkIns].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Check-ins del Viaje</h3>
      
      <div className="space-y-4">
        {sortedCheckIns.map((checkIn, index) => {
          const Icon = checkInIcons[checkIn.estado] || Clock;
          const colorClass = checkInColors[checkIn.estado] || 'bg-gray-100 text-gray-600';
          const label = checkInLabels[checkIn.estado] || checkIn.estado;
          const isLast = index === sortedCheckIns.length - 1;

          return (
            <div key={checkIn._id || index} className="relative">
              {/* Línea conectora */}
              {!isLast && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200"></div>
              )}

              <div className="flex gap-4">
                {/* Icono */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full ${colorClass} flex items-center justify-center relative z-10`}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* Contenido */}
                <div className="flex-1 pb-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{label}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(checkIn.timestamp).toLocaleString('es-AR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {index === 0 && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                        Último
                      </span>
                    )}
                  </div>

                  {/* Ubicación si existe */}
                  {checkIn.ubicacion && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>
                        {checkIn.ubicacion.latitud.toFixed(4)}, {checkIn.ubicacion.longitud.toFixed(4)}
                      </span>
                    </div>
                  )}

                  {/* Notas si existen */}
                  {checkIn.notas && (
                    <div className="mt-2 text-sm text-gray-600 bg-gray-50 rounded p-2">
                      {checkIn.notas}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
