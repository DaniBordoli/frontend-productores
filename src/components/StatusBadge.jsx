import { TRIP_STATUS, TRIP_STATUS_LABELS } from '../constants/trip';

const VARIANT_STYLES = {
  blue: { background: '#EDF2F8', color: '#3590F3' },
  yellow: { background: '#FFFAE5', color: '#BFA300' },
  green: { background: '#EDF8F0', color: '#5EAF74' },
  red: { background: '#FDEFEE', color: '#F35F50' },
  gray: { background: '#F6F6F6', color: '#888888' },
};

const STATUS_VARIANT_MAP = {
  [TRIP_STATUS.SOLICITADO]: 'blue',
  [TRIP_STATUS.COTIZANDO]: 'blue',
  [TRIP_STATUS.CONFIRMADO]: 'blue',
  [TRIP_STATUS.EN_ASIGNACION]: 'blue',
  [TRIP_STATUS.EN_CURSO]: 'yellow',
  [TRIP_STATUS.FINALIZADO]: 'green',
  pendiente: 'yellow',
  aprobada: 'green',
  confirmada: 'green',
  propuesta: 'yellow',
};

const capitalize = (str) =>
  str ? str.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase()) : '—';

export const StatusBadge = ({ status, variant, label }) => {
  const resolvedVariant = variant ?? STATUS_VARIANT_MAP[status] ?? 'blue';
  const resolvedLabel = label ?? TRIP_STATUS_LABELS[status] ?? (status ? capitalize(status) : '—');
  const styles = VARIANT_STYLES[resolvedVariant];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 9999,
        fontSize: 13,
        fontWeight: 500,
        lineHeight: '20px',
        whiteSpace: 'nowrap',
        background: styles.background,
        color: styles.color,
      }}
    >
      {resolvedLabel}
    </span>
  );
};
