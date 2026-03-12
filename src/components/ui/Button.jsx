'use client';

/**
 * Reusable Button component with elegant graphite styling.
 *
 * Variants:
 * - primary: Soft graphite background with white text
 * - secondary: Outlined style with graphite border
 * - ghost: Minimal style, no background
 * - accent: Cadetblue accent color
 *
 * Sizes: sm, md, lg
 */

const variants = {
  primary:
    'bg-graphite hover:bg-graphite-dark text-white shadow-sm hover:shadow-md',
  secondary:
    'bg-transparent border-2 border-graphite text-graphite hover:bg-graphite hover:text-white',
  ghost:
    'bg-transparent text-graphite hover:bg-graphite/10',
  accent:
    'bg-cadetblue hover:bg-cadetblue-dark text-white shadow-sm hover:shadow-md',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-graphite/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
