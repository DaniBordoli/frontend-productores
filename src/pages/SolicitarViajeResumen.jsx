import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, ArrowLeft, ChevronDown, Truck, AlertTriangle, PlusCircle, Loader2 } from 'lucide-react';
import logo from '../assets/rutaycampoLogo.svg';
import tripService from '../services/trip.service';
import { Button, PillInput } from '../components/ui';

const formatNum = (n) => n.toLocaleString('es-AR', { maximumFractionDigits: 0 });

const GRANO_LABELS = {
  soja: 'Soja',
  maiz: 'Maíz',
  trigo: 'Trigo',
  girasol: 'Girasol',
  sorgo: 'Sorgo',
  otro: 'Otro',
};

const formatPrice = (n) =>
  '$' + formatNum(n);

function SectionHeader({ title, actionLabel, onAction, badge }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {badge && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
            {badge}
          </span>
        )}
      </div>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="text-sm text-[#45845C] underline hover:opacity-75 transition-opacity focus:outline-none"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function NegociarModal({ tarifaActual, onClose, onConfirm }) {
  const [valor, setValor] = useState('');
  const valid = valor && Number(valor) > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        className="bg-white rounded-2xl flex flex-col pb-8"
        style={{ width: '565px', border: '1px solid #DDE1E6' }}
      >
        <div className="flex items-start justify-between px-8 pt-8 pb-0">
          <h2 className="text-xl font-bold text-gray-900">Proponer nueva tarifa</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0 hover:bg-gray-50 transition-colors focus:outline-none"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <p className="px-8 mt-3 text-sm text-gray-500 leading-relaxed">
          Proponé un valor de km x tn. Será evaluado por el equipo de logística y te contactarán para definir la tarifa final.
        </p>

        <div className="mx-8 mt-6 bg-gray-50 rounded-2xl px-5 py-4">
          <p className="text-sm text-gray-500">Tarifa actual</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            ${tarifaActual ? tarifaActual.toLocaleString('es-AR') : '-'} x km x tn
          </p>
        </div>

        <div className="mx-8 mt-5">
          <label className="text-sm font-medium text-gray-800">Tu tarifa propuesta ($ x km x tn)*</label>
          <div className="mt-2">
            <PillInput
              icon={<PlusCircle className="w-4 h-4" />}
              type="number"
              min={0}
              placeholder={tarifaActual ? String(tarifaActual) : '1000'}
              value={valor}
              onChange={e => setValor(e.target.value)}
            />
          </div>
        </div>

        <div className="mx-8 mt-6">
          <button
            type="button"
            disabled={!valid}
            onClick={() => onConfirm(Number(valor))}
            className="w-full py-3.5 rounded-full text-sm font-semibold transition-colors focus:outline-none"
            style={{
              background: valid ? '#45845C' : '#F0F1F3',
              color: valid ? '#ffffff' : '#A0A7B1',
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

function RouteDisplay({ formData }) {
  return (
    <div className="flex items-start gap-3 mt-3">
      <div className="flex flex-col items-center">
        <div className="w-5 h-5 rounded-full bg-green-50 border-2 border-[#45845C] flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#45845C]" />
        </div>
        <div className="w-px border-l-2 border-dashed border-gray-300 h-10 my-1" />
        <div className="w-5 h-5 rounded-full bg-green-50 border-2 border-[#45845C] flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#45845C]" />
        </div>
      </div>
      <div className="flex flex-col gap-5 flex-1">
        <div>
          <p className="text-xs text-gray-400">Origen</p>
          <p className="text-sm font-semibold text-gray-900">
            {formData.origen.ciudad}, {formData.origen.provincia}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Destino</p>
          <p className="text-sm font-semibold text-gray-900">
            {formData.destino.ciudad}, {formData.destino.provincia}
          </p>
        </div>
      </div>
    </div>
  );
}

// Decode Google encoded polyline to array of {lat, lng}
function decodePolyline(encoded) {
  const points = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lat += (result & 1) ? ~(result >> 1) : result >> 1;
    shift = 0; result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lng += (result & 1) ? ~(result >> 1) : result >> 1;
    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return points;
}

function RouteMap({ origen, destino, className, style }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !window.google?.maps) return;
    const oLat = origen?.coordenadas?.latitud;
    const oLng = origen?.coordenadas?.longitud;
    const dLat = destino?.coordenadas?.latitud;
    const dLng = destino?.coordenadas?.longitud;
    if (!oLat || !dLat) return;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 7,
      center: { lat: (oLat + dLat) / 2, lng: (oLng + dLng) / 2 },
      disableDefaultUI: true,
      zoomControl: true,
      styles: [
        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', stylers: [{ visibility: 'off' }] },
      ],
    });

    // Markers for origin and destination
    new window.google.maps.Marker({
      position: { lat: oLat, lng: oLng },
      map,
      title: origen.ciudad || 'Origen',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#45845C',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 2,
      },
    });
    new window.google.maps.Marker({
      position: { lat: dLat, lng: dLng },
      map,
      title: destino.ciudad || 'Destino',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#1e3a2f',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 2,
      },
    });

    // Fetch route via backend proxy
    tripService.getRoute({ originLat: oLat, originLng: oLng, destLat: dLat, destLng: dLng })
      .then(data => {
        const encoded = data?.routes?.[0]?.polyline?.encodedPolyline;
        if (!encoded) return;
        const path = decodePolyline(encoded);
        const polyline = new window.google.maps.Polyline({
          path,
          map,
          strokeColor: '#45845C',
          strokeWeight: 4,
          strokeOpacity: 0.9,
        });
        // Fit bounds to route
        const bounds = new window.google.maps.LatLngBounds();
        path.forEach(p => bounds.extend(p));
        map.fitBounds(bounds, 40);
      })
      .catch(() => {
        // Fallback: just fit bounds to markers
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend({ lat: oLat, lng: oLng });
        bounds.extend({ lat: dLat, lng: dLng });
        map.fitBounds(bounds, 40);
      });
  }, [origen, destino]);

  return <div ref={mapRef} className={className} style={style} />;
}

export const SolicitarViajeResumen = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const formData = state?.formData;

  const [expandComun, setExpandComun] = useState(false);
  const [expandEscalable, setExpandEscalable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNegociar, setShowNegociar] = useState(false);
  const [tarifaPropuesta, setTarifaPropuesta] = useState(null);
  const [pedidoCreado, setPedidoCreado] = useState(false);
  const [createdTripId, setCreatedTripId] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingError, setPricingError] = useState('');

  if (!formData) {
    navigate('/solicitar-viaje', { replace: true });
    return null;
  }

  const nComunes = parseInt(formData.camionesComunes || 0);
  const nEscalables = parseInt(formData.camionesEscalables || 0);

  // Derived from backend pricing response
  const totalComunes = pricing?.totalComunes ?? null;
  const totalEscalables = pricing?.totalEscalables ?? null;
  const total = pricing?.total ?? null;

  // If user proposed a custom tarifaKmTn, recalculate totals client-side
  const TN_COMUN = 30;
  const TN_ESCALABLE = 37.5;
  const tarifaEfectiva = tarifaPropuesta ?? pricing?.tarifaKmTn ?? null;
  const distanciaKm = pricing?.distanciaKm ?? null;
  const totalEfectivo = tarifaEfectiva && distanciaKm
    ? (TN_COMUN * distanciaKm * tarifaEfectiva * nComunes) + (TN_ESCALABLE * distanciaKm * tarifaEfectiva * nEscalables)
    : total;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const load = async () => {
      setPricingLoading(true);
      setPricingError('');
      try {
        const result = await tripService.calculatePrice({
          origen: formData.origen,
          destino: formData.destino,
          distancia: null,
          camionesComunes: nComunes,
          camionesEscalables: nEscalables,
        });
        setPricing(result);
      } catch (err) {
        setPricingError(
          err.response?.status === 404
            ? 'No hay tarifa configurada para esta ruta. El equipo te contactará con un precio.'
            : 'No se pudo calcular el precio. El equipo te contactará.'
        );
      } finally {
        setPricingLoading(false);
      }
    };
    load();
  }, []);

  const fechaFormateada = formData.fecha
    ? new Date(formData.fecha + 'T00:00:00').toLocaleDateString('es-AR')
    : '--/--/----';

  const tipoDestinoLabel =
    formData.tipoDestino === 'puerto'
      ? 'Puerto'
      : formData.tipoDestino === 'acopio'
      ? 'Acopio'
      : '';

  const granoLabel = GRANO_LABELS[formData.grano] ?? formData.grano ?? '-';

  const editarStep = (step) => {
    navigate('/solicitar-viaje/form', { state: { formData, step } });
  };

  const handleFinalizar = async () => {
    setLoading(true);
    setError('');
    try {
      const camionesTotal = nComunes + nEscalables;
      // peso total = suma de tn fijas por camion
      const pesoTotal = (nComunes * TN_COMUN) + (nEscalables * TN_ESCALABLE);
      const result = await tripService.create({
        origen: formData.origen,
        destino: formData.destino,
        tipoDestino: formData.tipoDestino,
        fechaProgramada: `${formData.fecha}T${formData.hora}`,
        tipoCarga: formData.grano,
        peso: pesoTotal,
        camionesSolicitados: camionesTotal,
        camionesRecomendados: camionesTotal,
        camionesComunes: nComunes,
        camionesEscalables: nEscalables,
        notas: formData.notas,
        ...(distanciaKm ? { distanciaKm } : {}),
        ...(totalEfectivo !== null ? { precios: { precioBase: totalEfectivo } } : {}),
      });
      const tripId = result?.trip?._id || result?._id;
      setCreatedTripId(tripId);
      if (tarifaPropuesta && tripId) {
        try {
          await tripService.proposePrice(tripId, tarifaPropuesta);
        } catch (_) { /* non-fatal */ }
      }
      setPedidoCreado(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la solicitud');
    } finally {
      setLoading(false);
    }
  };

  if (pedidoCreado) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">¡Pedido confirmado!</h2>
        <p className="text-sm text-gray-500 max-w-xs">
          Nos contactaremos con vos para comunicarte los próximos pasos.
        </p>
        <button
          type="button"
          onClick={() => navigate('/viajes')}
          className="mt-8 px-10 py-3 rounded-full text-sm font-semibold text-white focus:outline-none"
          style={{ background: '#45845C' }}
        >
          Entendido
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:h-screen">
      {/* Mobile header */}
      <div className="lg:hidden flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => editarStep(3)}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center focus:outline-none"
            style={{ border: '1px solid #DEDEDE' }}
            aria-label="Atrás"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-gray-600" />
          </button>
          <button
            type="button"
            onClick={() => navigate('/viajes')}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center focus:outline-none"
            style={{ border: '1px solid #DEDEDE' }}
            aria-label="Cerrar"
          >
            <X className="w-3.5 h-3.5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden lg:flex flex-shrink-0 items-center px-4 py-4 gap-4">
        <button type="button" onClick={() => navigate('/')} className="focus:outline-none flex-shrink-0">
          <img src={logo} alt="Ruta y Campo" className="w-10 h-10" />
        </button>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => navigate('/viajes')}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors focus:outline-none flex-shrink-0"
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
          aria-label="Cerrar"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden lg:min-h-0 lg:justify-center lg:px-[145px]">
        {/* Mobile title - above map */}
        <div className="lg:hidden px-4 pt-2 pb-3">
          <h1 className="text-2xl font-bold text-gray-900">Resumen de tu pedido</h1>
          <p className="text-sm text-gray-500 mt-1">Revisá los detalles antes de confirmar.</p>
        </div>

        {/* Map - mobile: full width on top; desktop: left panel fixed size */}
        <RouteMap
          origen={formData.origen}
          destino={formData.destino}
          className="lg:hidden mx-4 mb-4 bg-gray-100"
          style={{ height: '220px', borderRadius: '20px' }}
        />
        <RouteMap
          origen={formData.origen}
          destino={formData.destino}
          className="hidden lg:block m-4 flex-shrink-0 bg-gray-100"
          style={{ width: '475px', height: '498px', borderRadius: '24px' }}
        />

        {/* Summary panel */}
        <div className="w-full lg:w-[560px] xl:w-[600px] flex-shrink-0 overflow-y-auto p-4 pb-28 sm:pb-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            {/* Title - desktop only */}
            <h1 className="hidden lg:block text-2xl font-bold text-gray-900">Resumen de tu pedido</h1>
            <p className="hidden lg:block text-sm text-gray-500 mt-1">Revisá los detalles antes de confirmar.</p>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Recorrido */}
            <div className="lg:border-t lg:border-gray-100 lg:mt-5 lg:pt-5">
              <SectionHeader
                title="Recorrido"
                actionLabel="Editar"
                onAction={() => editarStep(1)}
              />
              <RouteDisplay formData={formData} />
              {tipoDestinoLabel && (
                <div className="flex gap-2 mt-4">
                  <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                    {tipoDestinoLabel}
                  </span>
                </div>
              )}
            </div>

            {/* Fecha y Hora */}
            <div className="border-t border-gray-100 mt-5 pt-5">
              <SectionHeader
                title="Fecha y Hora"
                actionLabel="Editar"
                onAction={() => editarStep(2)}
              />
              <p className="text-sm text-gray-700 mt-2">
                {fechaFormateada} - {formData.hora || '--:--'}
              </p>
            </div>

            {/* Información de la carga */}
            <div className="border-t border-gray-100 mt-5 pt-5">
              <SectionHeader
                title="Información de la carga"
                actionLabel="Editar"
                onAction={() => editarStep(3)}
              />
              <ul className="mt-2 space-y-1">
                {nComunes > 0 && (
                  <li className="text-sm text-gray-700">• {nComunes} camiones comunes</li>
                )}
                {nEscalables > 0 && (
                  <li className="text-sm text-gray-700">• {nEscalables} camiones escalables</li>
                )}
                <li className="text-sm text-gray-700">• Traslado: {granoLabel}</li>
              </ul>
              <div className="mt-3 px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-400">
                {formData.notas || 'Comentarios de las notas adicionales'}
              </div>
            </div>

            {/* Valor total */}
            <div className="border-t border-gray-100 mt-5 pt-5">
              <SectionHeader
                title="Valor total"
                badge={tarifaPropuesta ? 'Tarifa a negociar' : undefined}
                actionLabel={!pricingLoading && !pricingError ? 'Negociar' : undefined}
                onAction={() => setShowNegociar(true)}
              />

              {pricingLoading && (
                <div className="flex items-center gap-2 py-4 text-sm text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Calculando tarifa...
                </div>
              )}

              {!pricingLoading && pricingError && (
                <div className="flex items-start gap-2 bg-yellow-50 text-yellow-700 text-xs px-4 py-3 rounded-xl mb-3">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{pricingError}</span>
                </div>
              )}

              {!pricingLoading && !pricingError && pricing !== null && (
                <>
                  {nComunes > 0 && (
                    <>
                      <button
                        type="button"
                        className="w-full flex items-center gap-3 py-3 border-b border-gray-100 text-left"
                        onClick={() => setExpandComun((v) => !v)}
                      >
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Truck className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Camiones comunes</p>
                          <p className="text-xs text-gray-400">{nComunes} unidades · 30 tn c/u</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 mr-1">
                          {formatPrice(tarifaPropuesta
                            ? TN_COMUN * distanciaKm * tarifaPropuesta * nComunes
                            : totalComunes)}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${expandComun ? 'rotate-180' : ''}`} />
                      </button>
                      {expandComun && (
                        <div className="mb-3 rounded-2xl px-5 py-4 text-sm" style={{ background: '#F6F6F6', color: '#7A7A7A' }}>
                          <div className="flex justify-between py-1.5">
                            <span>Tarifa x km x tn</span><span>${formatNum(tarifaEfectiva)}</span>
                          </div>
                          <div className="flex justify-between py-1.5">
                            <span>Distancia</span><span>{formatNum(distanciaKm)} km</span>
                          </div>
                          <div className="flex justify-between py-1.5">
                            <span>Toneladas por camión</span><span>30 tn</span>
                          </div>
                          <div className="flex justify-between py-1.5">
                            <span>Cantidad</span><span>{nComunes} camiones</span>
                          </div>
                          <div className="border-t my-2" style={{ borderColor: '#E0E0E0' }} />
                          <div className="flex justify-between py-1.5 font-medium">
                            <span>Subtotal comunes</span>
                            <span>{formatNum(tarifaPropuesta
                              ? TN_COMUN * distanciaKm * tarifaPropuesta * nComunes
                              : totalComunes)}</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {nEscalables > 0 && (
                    <>
                      <button
                        type="button"
                        className="w-full flex items-center gap-3 py-3 border-b border-gray-100 text-left"
                        onClick={() => setExpandEscalable((v) => !v)}
                      >
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Truck className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Camiones escalables</p>
                          <p className="text-xs text-gray-400">{nEscalables} unidades · 37,5 tn c/u</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 mr-1">
                          {formatPrice(tarifaPropuesta
                            ? TN_ESCALABLE * distanciaKm * tarifaPropuesta * nEscalables
                            : totalEscalables)}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${expandEscalable ? 'rotate-180' : ''}`} />
                      </button>
                      {expandEscalable && (
                        <div className="mb-3 rounded-2xl px-5 py-4 text-sm" style={{ background: '#F6F6F6', color: '#7A7A7A' }}>
                          <div className="flex justify-between py-1.5">
                            <span>Tarifa x km x tn</span><span>${formatNum(tarifaEfectiva)}</span>
                          </div>
                          <div className="flex justify-between py-1.5">
                            <span>Distancia</span><span>{formatNum(distanciaKm)} km</span>
                          </div>
                          <div className="flex justify-between py-1.5">
                            <span>Toneladas por camión</span><span>37,5 tn</span>
                          </div>
                          <div className="flex justify-between py-1.5">
                            <span>Cantidad</span><span>{nEscalables} camiones</span>
                          </div>
                          <div className="border-t my-2" style={{ borderColor: '#E0E0E0' }} />
                          <div className="flex justify-between py-1.5 font-medium">
                            <span>Subtotal escalables</span>
                            <span>{formatNum(tarifaPropuesta
                              ? TN_ESCALABLE * distanciaKm * tarifaPropuesta * nEscalables
                              : totalEscalables)}</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex justify-between items-center py-3">
                    <span className="text-base font-bold text-gray-900">Total</span>
                    <span className="text-base font-bold text-gray-900">
                      {formatPrice(totalEfectivo)}
                    </span>
                  </div>
                </>
              )}

              <div className="flex items-start gap-2 bg-yellow-50 text-yellow-700 text-xs px-4 py-3 rounded-xl">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  No se realizará ningún cobro ahora. Nos contactaremos para avanzar con el pago.
                </span>
              </div>
            </div>

            {/* Buttons - desktop only */}
            <div className="hidden sm:flex gap-3 border-t border-gray-100 mt-5 pt-5">
              <Button variant="secondary" size="lg" onClick={() => editarStep(3)}>
                Atrás
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={handleFinalizar}
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Finalizar pedido'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom button */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3 bg-white">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleFinalizar}
          disabled={loading}
        >
          {loading ? 'Procesando...' : 'Finalizar pedido'}
        </Button>
      </div>
      {showNegociar && (
        <NegociarModal
          tarifaActual={pricing?.tarifaKmTn}
          onClose={() => setShowNegociar(false)}
          onConfirm={(valor) => {
            setTarifaPropuesta(valor);
            setShowNegociar(false);
          }}
        />
      )}
    </div>
  );
};
