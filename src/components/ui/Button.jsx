/**
 * Reusable Button component with variants.
 *
 * Variants:
 *  - "primary"  → green gradient pill (e.g. "Agregar transportista")
 *  - "outline"  → white border pill   (e.g. "Ver detalle")
 *  - "danger"   → red solid           (e.g. "Eliminar")
 *  - "ghost"    → transparent hover   (e.g. icon-only action buttons)
 *  - "secondary"→ gray border pill    (e.g. "Cancelar", "Agregar nuevo rango")
 */

const BASE =
  'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

const VARIANT_CLASSES = {
  primary: 'text-white shadow-sm',
  outline:
    'text-gray-700 bg-white border border-[#DEDEDE] shadow-sm hover:bg-gray-50',
  danger: 'text-white bg-red-600 hover:bg-red-700',
  ghost: 'text-gray-500 hover:bg-gray-100',
  secondary:
    'text-gray-700 border border-[#DEDEDE] hover:bg-gray-50',
};

const SIZE_CLASSES = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-5 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const PILL_STYLE = { borderRadius: 80 };

const PRIMARY_BG = {
  background: 'linear-gradient(135deg, #37784C 0%, #5F9C73 100%)',
};

const PRIMARY_DISABLED_BG = {
  background: '#F4F4F4',
  color: '#D3D4D5',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  pill = true,
  children,
  className = '',
  disabled,
  style: customStyle,
  ...props
}) => {
  const classes = [
    BASE,
    VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary,
    SIZE_CLASSES[size] || SIZE_CLASSES.md,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  let inlineStyle = pill ? { ...PILL_STYLE } : {};

  if (variant === 'primary') {
    Object.assign(
      inlineStyle,
      disabled ? PRIMARY_DISABLED_BG : PRIMARY_BG
    );
  }

  if (customStyle) {
    Object.assign(inlineStyle, customStyle);
  }

  return (
    <button className={classes} disabled={disabled} style={inlineStyle} {...props}>
      {children}
    </button>
  );
};

export default Button;
