import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet en Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Iconos personalizados
const createIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const originIcon = createIcon('#10b981'); // green
const destinationIcon = createIcon('#ef4444'); // red
const currentIcon = createIcon('#3b82f6'); // blue

// Componente para ajustar el mapa a los bounds
function MapBounds({ bounds }) {
  const map = useMap();
  
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  
  return null;
}

const EMPTY_ROUTE = [];

export const TripMap = ({ trip, currentLocation, route = EMPTY_ROUTE }) => {
  const mapRef = useRef();

  // Coordenadas de origen y destino
  const origin = trip.origen?.coordenadas 
    ? [trip.origen.coordenadas.latitud, trip.origen.coordenadas.longitud]
    : null;
  
  const destination = trip.destino?.coordenadas
    ? [trip.destino.coordenadas.latitud, trip.destino.coordenadas.longitud]
    : null;

  // Ubicación actual del transportista
  const current = currentLocation
    ? [currentLocation.latitud, currentLocation.longitud]
    : null;

  // Calcular bounds para centrar el mapa
  const bounds = [];
  if (origin) bounds.push(origin);
  if (destination) bounds.push(destination);
  if (current) bounds.push(current);

  // Ruta completa (puntos históricos)
  const routePoints = route.map(point => [point.latitud, point.longitud]);

  // Centro por defecto (Argentina)
  const defaultCenter = [-34.6037, -58.3816];
  const center = bounds.length > 0 ? bounds[0] : defaultCenter;

  if (!origin && !destination && !current) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <p className="text-gray-500">No hay coordenadas disponibles para mostrar el mapa</p>
      </div>
    );
  }

  return (
    <div className="relative h-[500px] rounded-lg overflow-hidden border border-gray-200">
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Ajustar bounds */}
        <MapBounds bounds={bounds} />

        {/* Marcador de origen */}
        {origin && (
          <Marker position={origin} icon={originIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">Origen</p>
                <p>{trip.origen?.ciudad}, {trip.origen?.provincia}</p>
                <p className="text-xs text-gray-500">{trip.origen?.direccion}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Marcador de destino */}
        {destination && (
          <Marker position={destination} icon={destinationIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">Destino</p>
                <p>{trip.destino?.ciudad}, {trip.destino?.provincia}</p>
                <p className="text-xs text-gray-500">{trip.destino?.direccion}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Marcador de ubicación actual */}
        {current && (
          <Marker position={current} icon={currentIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">Ubicación Actual</p>
                <p className="text-xs text-gray-500">
                  {new Date(currentLocation.timestamp).toLocaleString('es-AR')}
                </p>
                {currentLocation.velocidad && (
                  <p className="text-xs text-gray-500">
                    Velocidad: {Math.round(currentLocation.velocidad)} km/h
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Línea de ruta planificada */}
        {origin && destination && (
          <Polyline
            positions={[origin, destination]}
            color="#9ca3af"
            weight={2}
            dashArray="10, 10"
            opacity={0.6}
          />
        )}

        {/* Línea de ruta recorrida */}
        {routePoints.length > 1 && (
          <Polyline
            positions={routePoints}
            color="#3b82f6"
            weight={3}
            opacity={0.8}
          />
        )}
      </MapContainer>

      {/* Leyenda */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 text-xs space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
          <span>Origen</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white"></div>
          <span>Destino</span>
        </div>
        {current && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white"></div>
            <span>Ubicación Actual</span>
          </div>
        )}
      </div>
    </div>
  );
};
