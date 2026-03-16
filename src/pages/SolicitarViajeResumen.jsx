import { useState, useEffect } from 'react';
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

function NegociarModal({ onClose, onConfirm }) {
  const [valor, setValor] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        className="bg-white rounded-2xl flex flex-col pb-8"
        style={{
          width: '565px',
          border: '1px solid #DDE1E6',
        }}
      >
        {/* Modal header */}
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

        {/* Description */}
        <p className="px-8 mt-3 text-sm text-gray-500 leading-relaxed">
          Ingresá tu propuesta de tarifa total para el viaje. Luego será evaluada
          por el equipo&nbsp; de logística y te contactarán para definir la tarifa final.
        </p>

        {/* Tarifa actual */}
        <div className="mx-8 mt-6 bg-gray-50 rounded-2xl px-5 py-4">
          <p className="text-sm text-gray-500">Tarifa actual</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">$4.000 x km x tn</p>
        </div>

        {/* Tu tarifa propuesta */}
        <div className="mx-8 mt-5">
          <label className="text-sm font-medium text-gray-800">Tu tarifa propuesta*</label>
          <div className="mt-2">
            <PillInput
              icon={<PlusCircle className="w-4 h-4" />}
              type="number"
              min={0}
              placeholder="1000"
              value={valor}
              onChange={e => setValor(e.target.value)}
            />
          </div>
        </div>

        {/* Confirm button */}
        <div className="mx-8 mt-6">
          <button
            type="button"
            disabled={!valor || Number(valor) <= 0}
            onClick={() => onConfirm(valor)}
            className="w-full py-3.5 rounded-full text-sm font-semibold transition-colors focus:outline-none"
            style={{
              background: !valor || Number(valor) <= 0 ? '#F0F1F3' : '#45845C',
              color: !valor || Number(valor) <= 0 ? '#A0A7B1' : '#ffffff',
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

  // Use backend price if available, else fall back to null
  const precioUnitario = pricing?.basePrice ?? null;
  const totalComun = precioUnitario !== null ? nComunes * precioUnitario : null;
  const totalEscalable = precioUnitario !== null ? nEscalables * precioUnitario : null;
  const total = precioUnitario !== null ? (totalComun + totalEscalable) : null;

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
          peso: formData.peso ? Number(formData.peso) : null,
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
      const result = await tripService.create({
        origen: formData.origen,
        destino: formData.destino,
        tipoDestino: formData.tipoDestino,
        fechaProgramada: `${formData.fecha}T${formData.hora}`,
        tipoCarga: formData.grano,
        peso: Number(formData.peso),
        camionesSolicitados: camionesTotal,
        camionesRecomendados: camionesTotal,
        camionesComunes: nComunes,
        camionesEscalables: nEscalables,
        notas: formData.notas,
        ...(total !== null ? { precios: { precioBase: total } } : {}),
      });
      const tripId = result?.trip?._id || result?._id;
      setCreatedTripId(tripId);
      // If user proposed a custom price, send it
      if (tarifaPropuesta && tripId) {
        try {
          await tripService.proposePrice(tripId, Number(tarifaPropuesta));
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
        <img src={logo} alt="Ruta y Campo" className="w-10 h-10 flex-shrink-0" />
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
        <div className="lg:hidden mx-4 mb-4 bg-gray-200 flex items-center justify-center" style={{ height: '220px', borderRadius: '20px' }}>
          <span className="text-gray-400 text-sm">Mapa</span>
        </div>
        <div className="hidden lg:flex m-4 bg-gray-200 items-center justify-center flex-shrink-0" style={{ width: '475px', height: '498px', borderRadius: '24px' }}>
          <span className="text-gray-400 text-sm">Mapa</span>
        </div>

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

              {!pricingLoading && !pricingError && precioUnitario !== null && (
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
                          <p className="text-xs text-gray-400">{nComunes} unidades</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 mr-1">
                          {formatPrice(totalComun)}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${expandComun ? 'rotate-180' : ''}`} />
                      </button>
                      {expandComun && (
                        <div className="mb-3 rounded-2xl px-5 py-4 text-sm" style={{ background: '#F6F6F6', color: '#7A7A7A' }}>
                          <div className="flex justify-between py-1.5">
                            <span>Precio base por camión</span><span>{formatNum(precioUnitario)}</span>
                          </div>
                          <div className="border-t my-2" style={{ borderColor: '#E0E0E0' }} />
                          <div className="flex justify-between py-1.5">
                            <span>Valor {nComunes} camiones</span><span>{formatNum(totalComun)}</span>
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
                          <p className="text-xs text-gray-400">{nEscalables} unidades</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 mr-1">
                          {formatPrice(totalEscalable)}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${expandEscalable ? 'rotate-180' : ''}`} />
                      </button>
                      {expandEscalable && (
                        <div className="mb-3 rounded-2xl px-5 py-4 text-sm" style={{ background: '#F6F6F6', color: '#7A7A7A' }}>
                          <div className="flex justify-between py-1.5">
                            <span>Precio base por camión</span><span>{formatNum(precioUnitario)}</span>
                          </div>
                          <div className="border-t my-2" style={{ borderColor: '#E0E0E0' }} />
                          <div className="flex justify-between py-1.5">
                            <span>Valor {nEscalables} camiones</span><span>{formatNum(totalEscalable)}</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex justify-between items-center py-3">
                    <span className="text-base font-bold text-gray-900">Total</span>
                    <span className="text-base font-bold text-gray-900">
                      {tarifaPropuesta ? formatPrice(Number(tarifaPropuesta)) : formatPrice(total)}
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
