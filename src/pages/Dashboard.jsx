import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import tripService from '../services/trip.service';
import { TRIP_STATUS } from '../constants/trip';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/ui';
import { UrgentTripCard } from '../components/UrgentTripCard';
import { ActiveTripCard } from '../components/ActiveTripCard';
import { PendingTripCard } from '../components/PendingTripCard';
import ArrowUpCircle from '../assets/ArrowUpCircle.svg';
import AlertRectangle from '../assets/AlertRectangle.svg';

/* ── helpers ──────────────────────────────────────────────── */

const fmtDateTime = (d) => {
  if (!d) return '-';
  const dt = new Date(d);
  const dd = String(dt.getDate()).padStart(2, '0');
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const yyyy = dt.getFullYear();
  const hh = String(dt.getHours()).padStart(2, '0');
  const min = String(dt.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min} hs`;
};

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('es-AR') : '-');

/** Returns the single most important problem for a trip, or null */
const getProblema = (trip) => {
  if (!trip.cartaDePorte) return 'Sin carta de porte';
  if (!trip.choferesAsignados?.length && !trip.transportista) return 'Sin choferes';
  return null;
};

const DonutChart = ({ segments, size = 200, stroke = 30 }) => {
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const total = segments.reduce((s, d) => s + d.value, 0);
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EBEBEB" strokeWidth={stroke} />
      {total > 0 && segments.map((seg, i) => {
        if (!seg.value) return null;
        const dash = (seg.value / total) * C;
        const el = (
          <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={seg.color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${C - dash}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
};

/* ── Dashboard ────────────────────────────────────────────── */

export const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripService
      .getMyTrips()
      .then(setTrips)
      .catch((e) => console.error('Error loading trips:', e))
      .finally(() => setLoading(false));
  }, []);

  /* derived */
  const viajesUrgentes = useMemo(
    () =>
      trips.filter(
        (t) =>
          [TRIP_STATUS.CONFIRMADO, TRIP_STATUS.EN_ASIGNACION, TRIP_STATUS.EN_CURSO].includes(t.estado) &&
          getProblema(t) !== null,
      ),
    [trips],
  );

  const viajesEnCurso = useMemo(
    () => trips.filter((t) => [TRIP_STATUS.EN_CURSO, TRIP_STATUS.EN_ASIGNACION].includes(t.estado)),
    [trips],
  );

  const pendientes = useMemo(
    () => trips.filter((t) => [TRIP_STATUS.SOLICITADO, TRIP_STATUS.COTIZANDO, TRIP_STATUS.CONFIRMADO].includes(t.estado)),
    [trips],
  );

  const stats = useMemo(() => {
    const finalizados = trips.filter((t) => t.estado === TRIP_STATUS.FINALIZADO).length;
    const enCurso = trips.filter((t) => t.estado === TRIP_STATUS.EN_CURSO).length;
    const enAsignacion = trips.filter((t) => t.estado === TRIP_STATUS.EN_ASIGNACION).length;
    const solicitados = trips.filter((t) =>
      [TRIP_STATUS.SOLICITADO, TRIP_STATUS.COTIZANDO].includes(t.estado),
    ).length;
    return { total: trips.length, finalizados, enCurso, enAsignacion, solicitados };
  }, [trips]);

  const completedPct = stats.total > 0 ? Math.round((stats.finalizados / stats.total) * 100) : 0;

  const donutSegments = [
    { label: 'Finalizados', value: stats.finalizados, color: '#5EAF74' },
    { label: 'En curso', value: stats.enCurso, color: '#8CD19E' },
    { label: 'En asignación', value: stats.enAsignacion, color: '#E6A817' },
    { label: 'Solicitados', value: stats.solicitados, color: '#F6D35B' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#45845C]" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Aquí encontrarás los puntos prioritarios a revisar en tus viajes.</p>
        </div>
        <Link to="/solicitar-viaje" className="hidden md:block">
          <Button variant="primary" size="lg">
            Solicitar viaje
          </Button>
        </Link>
      </div>

      {/* ─── 1. Revisar urgente ──────────────────────────────── */}
      <section className="md:bg-white md:rounded-[16px] md:shadow-lg md:p-6">
        <h2 className="text-[22px] font-semibold text-gray-900 mb-4">Revisar urgente</h2>

        {viajesUrgentes.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="w-28 h-28 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-5">
              <Package className="w-10 h-10" />
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-1">No hay viajes urgentes</h3>
            <p className="text-sm text-gray-500">Todos los viajes están en orden</p>
          </div>
        ) : (
          <>
            {/* Yellow warning banner */}
            <div className="flex items-center gap-3 rounded-xl bg-[#FFFAE5] px-5 py-3 mb-6">
              <img src={AlertRectangle} alt="Alerta" className="w-5 h-5 shrink-0" />
              <p className="text-sm text-[#BFA300]">
                Hay viajes que no pueden iniciarse porque falta cargar la carta de porte. Revisalos cuanto antes para poder comenzar.
              </p>
            </div>

            {/* Mobile cards */}
            <div className="flex flex-col gap-4 md:hidden">
              {viajesUrgentes.map((trip) => (
                <UrgentTripCard key={trip._id} trip={trip} problema={getProblema(trip)} />
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block rounded-2xl border border-[#DEDEDE] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[#363636]">
                  <thead>
                    <tr className="bg-[#F6F6F6]">
                      <th className="px-6 py-3 text-left text-sm font-medium">ID Viaje</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Problema</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">N° Camiones</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Origen</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Destino</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Tipo de carga</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Fecha y hora</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Accionable</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {viajesUrgentes.map((trip) => (
                      <tr key={trip._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm">{trip.numeroViaje || '-'}</td>
                        <td className="px-6 py-4 text-sm">
                          <StatusBadge label={getProblema(trip)} variant="yellow" />
                        </td>
                        <td className="px-6 py-4 text-sm">{trip.camionesSolicitados ?? '-'} camiones</td>
                        <td className="px-6 py-4 text-sm">{trip.origen?.ciudad}{trip.origen?.provincia ? `, ${trip.origen.provincia}` : ''}</td>
                        <td className="px-6 py-4 text-sm">{trip.destino?.ciudad}{trip.destino?.provincia ? `, ${trip.destino.provincia}` : ''}</td>
                        <td className="px-6 py-4 text-sm capitalize">{trip.tipoCarga || '-'}</td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap">{fmtDateTime(trip.fechaProgramada)}</td>
                        <td className="px-6 py-4 text-sm">
                          <Link to={`/viajes/${trip._id}`}>
                            <Button variant="outline" size="sm">Ver detalle</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </section>

      {/* ─── 2. Viajes en curso ──────────────────────────────── */}
      <section className="md:bg-white md:rounded-[16px] md:shadow-lg md:p-6">
        <h2 className="text-[22px] font-semibold text-gray-900 mb-4">Viajes en curso</h2>

        {viajesEnCurso.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="w-28 h-28 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-5">
              <Package className="w-10 h-10" />
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-1">No hay viajes en curso</h3>
            <p className="text-sm text-gray-500">Los viajes activos se mostrarán en esta sección</p>
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="flex flex-col gap-4 md:hidden">
              {viajesEnCurso.map((trip) => {
                const camiones = Array.isArray(trip.camiones) ? trip.camiones : [];
                const enCursoCount = camiones.filter(c => c.estado === TRIP_STATUS.EN_CURSO).length;
                const finalizadoCount = camiones.filter(c => c.estado === TRIP_STATUS.FINALIZADO).length;
                return (
                  <ActiveTripCard
                    key={trip._id}
                    trip={trip}
                    enCursoCount={enCursoCount}
                    finalizadoCount={finalizadoCount}
                  />
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block rounded-2xl border border-[#DEDEDE] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[#363636]">
                <thead>
                  <tr className="bg-[#F6F6F6]">
                    <th className="px-6 py-3 text-left text-sm font-medium">ID Viaje</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Estados de los viajes</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Origen</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Destino</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Tipo de carga</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Fecha y hora</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Accionable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {viajesEnCurso.map((trip) => {
                    const camiones = Array.isArray(trip.camiones) ? trip.camiones : [];
                    const enCursoCount = camiones.filter(c => c.estado === TRIP_STATUS.EN_CURSO).length;
                    const finalizadoCount = camiones.filter(c => c.estado === TRIP_STATUS.FINALIZADO).length;
                    const showCounts = camiones.length > 0;

                    return (
                      <tr key={trip._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm">{trip.numeroViaje || '-'}</td>
                        <td className="px-6 py-4 text-sm">
                          {showCounts ? (
                            <span className="flex items-center gap-2">
                              <span className="flex items-center gap-1">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="12" cy="12" r="10" stroke="#E6A817" strokeWidth="2"/>
                                  <path d="M12 6v6l4 2" stroke="#E6A817" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                <span>{enCursoCount} en curso</span>
                              </span>
                              <span className="text-gray-400">/</span>
                              <span className="flex items-center gap-1">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="12" cy="12" r="10" stroke="#37784C" strokeWidth="2"/>
                                  <path d="M8 12l3 3 5-5" stroke="#37784C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>{finalizadoCount} finalizados</span>
                              </span>
                            </span>
                          ) : (
                            <StatusBadge status={trip.estado} />
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">{trip.origen?.ciudad}{trip.origen?.provincia ? `, ${trip.origen.provincia}` : ''}</td>
                        <td className="px-6 py-4 text-sm">{trip.destino?.ciudad}{trip.destino?.provincia ? `, ${trip.destino.provincia}` : ''}</td>
                        <td className="px-6 py-4 text-sm capitalize">{trip.tipoCarga || '-'}</td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap">{fmtDateTime(trip.fechaProgramada)}</td>
                        <td className="px-6 py-4 text-sm">
                          <Link to={`/viajes/${trip._id}`}>
                            <Button variant="outline" size="sm">Ver detalle</Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          </>
        )}
      </section>

      {/* ─── 3. Pendientes + Estado de viajes ────────────────── */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Pendientes de aprobación — scrolleable */}
        <section className="flex-1 md:bg-white md:rounded-[16px] md:shadow-lg md:p-6 flex flex-col min-h-0">
          <div className="flex items-center gap-3 mb-4 shrink-0">
            <h2 className="text-[22px] font-semibold text-gray-900">Pendientes de aprobación</h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#F6F6F6] text-[#888888]">
              {pendientes.length} viajes
            </span>
          </div>

          {pendientes.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <div className="w-28 h-28 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-5">
                <Package className="w-10 h-10" />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-1">No hay viajes pendientes</h3>
              <p className="text-sm text-gray-500">Cuando tengas viajes pendientes de aprobación, aparecerán acá</p>
            </div>
          ) : (
            <>
              {/* Mobile cards */}
              <div className="flex flex-col gap-4 md:hidden">
                {pendientes.map((trip) => (
                  <PendingTripCard key={trip._id} trip={trip} />
                ))}
              </div>

              {/* Desktop list */}
              <div className="hidden md:block overflow-y-auto max-h-[360px] pr-1 divide-y divide-gray-200">
                {pendientes.map((trip) => (
                  <div key={trip._id} className="flex items-center justify-between py-5 first:pt-0">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <span className="text-base font-medium text-gray-900">
                          {trip.camionesSolicitados || '—'} camiones
                        </span>
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-[#F6F6F6] text-[#888888]">
                          Fecha: {fmtDate(trip.fechaProgramada)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {trip.origen?.ciudad || '-'} → {trip.destino?.ciudad || '-'}
                      </p>
                    </div>
                    <Link to={`/viajes/${trip._id}`} className="ml-4 shrink-0">
                      <Button variant="outline" size="md">Ver detalle</Button>
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Estado de viajes — replica exacta del dashboard */}
        <section className="flex-1 md:bg-white md:rounded-[16px] md:shadow-lg md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Estado de viajes</h2>
            <div className="hidden md:flex items-center bg-[#F6F6F6] rounded-[16px] px-4 py-2">
              <img src={ArrowUpCircle} alt="Completado" className="w-5 h-5 mr-2" />
              <span className="text-[#888888]">{completedPct}% completados</span>
            </div>
          </div>

          {/* Mobile: donut centered + 2x2 legend */}
          <div className="md:hidden bg-white rounded-[16px] shadow-sm border border-[#E8E8E8] pb-[50px]">
            <div className="flex justify-center py-6">
              <div className="relative">
                <DonutChart segments={donutSegments} size={220} stroke={34} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-gray-900">{stats.total}</span>
                    <span className="text-sm text-gray-500 ml-1">viajes</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 px-[45px]">
              {donutSegments.map((seg) => (
                <div key={seg.label} className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full shrink-0" style={{ background: seg.color }} />
                  <span className="text-sm text-gray-700">{seg.label}: {seg.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: colored donut + side legend */}
          <div className="hidden md:flex items-center py-8">
            <div className="relative shrink-0">
              <DonutChart segments={donutSegments} size={200} stroke={30} />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <span className="text-3xl font-semibold text-gray-900">{stats.total}</span>
                  <span className="text-base text-gray-500 ml-1">viajes</span>
                </div>
              </div>
            </div>
            <div className="ml-8 flex flex-col justify-center">
              {donutSegments.map((seg) => (
                <div key={seg.label} className="flex items-center mb-3 last:mb-0">
                  <div className="w-4 h-4 rounded-full mr-3 shrink-0" style={{ background: seg.color }} />
                  <span className="text-gray-700 text-base">{seg.label}: {seg.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
