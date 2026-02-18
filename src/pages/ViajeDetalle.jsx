import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Package, Truck, DollarSign, Clock, CheckCircle, Radio } from 'lucide-react';
import tripService from '../services/trip.service';
import { ProposePrice } from '../components/ProposePrice';
import { TripMap } from '../components/TripMap';
import { CheckInTimeline } from '../components/CheckInTimeline';
import { useWebSocket } from '../hooks/useWebSocket';

export const ViajeDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProposeModal, setShowProposeModal] = useState(false);
  const { isConnected, lastUpdate } = useWebSocket(id);

  const loadTrip = useCallback(async () => {
    try {
      const data = await tripService.getById(id);
      setTrip(data);
    } catch (error) {
      console.error('Error loading trip:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTrip();
  }, [loadTrip]);

  // Actualizar viaje cuando llega una actualización por WebSocket
  // eslint-disable-next-line react-doctor/no-effect-event-handler
  useEffect(() => {
    if (lastUpdate) {
      loadTrip();
    }
  }, [lastUpdate, loadTrip]);

  const handleProposePrice = async (price) => {
    await tripService.proposePrice(id, price);
    await loadTrip();
  };

  const getSubStatusLabel = (subStatus) => {
    const subStatusLabels = {
      'llegue_a_cargar': '🚚 Llegué a cargar',
      'cargado_saliendo': '📦 Cargado, saliendo',
      'en_camino': '🛣️ En camino',
      'llegue_a_destino': '📍 Llegué a destino',
      'descargado': '✅ Descargado'
    };
    return subStatusLabels[subStatus] || null;
  };

  const getStatusBadge = (status, subStatus) => {
    const statusConfig = {
      solicitado: { color: 'bg-blue-100 text-blue-800', label: 'Solicitado' },
      cotizando: { color: 'bg-yellow-100 text-yellow-800', label: 'Cotizando' },
      confirmado: { color: 'bg-green-100 text-green-800', label: 'Confirmado' },
      en_asignacion: { color: 'bg-purple-100 text-purple-800', label: 'En Asignación' },
      en_curso: { color: 'bg-indigo-100 text-indigo-800', label: 'En Curso' },
      finalizado: { color: 'bg-gray-100 text-gray-800', label: 'Finalizado' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    const subLabel = getSubStatusLabel(subStatus);
    
    return (
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
          {config.label}
        </span>
        {subLabel && (
          <span className="text-sm text-gray-600">
            {subLabel}
          </span>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Viaje no encontrado</p>
        <button
          onClick={() => navigate('/viajes')}
          className="mt-4 text-primary-600 hover:text-primary-700"
        >
          Volver a Mis Viajes
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/viajes')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver a Mis Viajes
      </button>

      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{trip.numeroViaje}</h1>
            <p className="text-gray-600 mt-1">Detalles del viaje</p>
          </div>
          {getStatusBadge(trip.estado, trip.subEstado)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ruta */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ruta</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Origen</p>
                  <p className="text-sm text-gray-600">{trip.origen?.direccion}</p>
                  <p className="text-sm text-gray-500">{trip.origen?.ciudad}, {trip.origen?.provincia}</p>
                </div>
              </div>

              <div className="ml-4 border-l-2 border-gray-200 h-8"></div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Destino ({trip.tipoDestino})</p>
                  <p className="text-sm text-gray-600">{trip.destino?.direccion}</p>
                  <p className="text-sm text-gray-500">{trip.destino?.ciudad}, {trip.destino?.provincia}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detalles de Carga */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalles de Carga</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Tipo de Carga</p>
                  <p className="text-sm font-medium text-gray-900">{trip.tipoCarga}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Peso</p>
                  <p className="text-sm font-medium text-gray-900">{trip.peso} toneladas</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Camiones Solicitados</p>
                  <p className="text-sm font-medium text-gray-900">{trip.camionesSolicitados}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Fecha Programada</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(trip.fechaProgramada).toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mapa de Tracking */}
          {(trip.estado === 'en_curso' || trip.trackingActivo || trip.rutaCompleta?.length > 0) && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Tracking en Tiempo Real</h2>
                {isConnected && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Radio className="w-4 h-4 animate-pulse" />
                    <span>En vivo</span>
                  </div>
                )}
              </div>
              <TripMap 
                trip={trip}
                currentLocation={trip.rutaCompleta?.[trip.rutaCompleta.length - 1]}
                route={trip.rutaCompleta || []}
              />
            </div>
          )}

          {/* Notas */}
          {trip.notas && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notas</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{trip.notas}</p>
            </div>
          )}

          {/* Check-ins Timeline */}
          <CheckInTimeline checkIns={trip.checkIns} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Transportista */}
          {trip.transportista && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Transportista</h2>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{trip.transportista.razonSocial}</p>
                  <p className="text-sm text-gray-500">{trip.transportista.nombreConductor}</p>
                </div>
              </div>
              {trip.transportista.telefono && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="text-sm font-medium text-gray-900">{trip.transportista.telefono}</p>
                </div>
              )}
            </div>
          )}

          {/* Precios */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Precios</h2>
            <div className="space-y-3">
              {trip.precios?.precioBase && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Precio Base</span>
                  <span className="text-sm font-medium text-gray-900">
                    ${trip.precios.precioBase.toLocaleString('es-AR')}
                  </span>
                </div>
              )}
              {trip.precios?.precioPropuesto && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tu Propuesta</span>
                  <span className="text-sm font-medium text-blue-600">
                    ${trip.precios.precioPropuesto.toLocaleString('es-AR')}
                  </span>
                </div>
              )}
              {trip.precios?.precioConfirmado && (
                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-sm font-semibold text-gray-900">Precio Confirmado</span>
                  <span className="text-lg font-bold text-primary-600">
                    ${trip.precios.precioConfirmado.toLocaleString('es-AR')}
                  </span>
                </div>
              )}
            </div>

            {!trip.precios?.precioConfirmado && ['solicitado', 'cotizando'].includes(trip.estado) && (
              <button
                onClick={() => setShowProposeModal(true)}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <DollarSign className="w-4 h-4" />
                {trip.precios?.precioPropuesto ? 'Modificar Propuesta' : 'Proponer Precio'}
              </button>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Historial</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-gray-600">Creado</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(trip.createdAt).toLocaleDateString('es-AR')}
                  </p>
                </div>
              </div>
              {trip.updatedAt && trip.updatedAt !== trip.createdAt && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-600">Última actualización</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(trip.updatedAt).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showProposeModal && (
        <ProposePrice
          trip={trip}
          onPropose={handleProposePrice}
          onClose={() => setShowProposeModal(false)}
        />
      )}
    </div>
  );
};
