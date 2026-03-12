/**
 * Reusable Container component for consistent max-width and padding.
 *
 * Sizes:
 * - sm: max-w-screen-sm (640px)
 * - md: max-w-screen-md (768px)
 * - lg: max-w-screen-lg (1024px)
 * - xl: max-w-screen-xl (1280px) - default
 * - full: w-full (no max-width)
 */

const sizes = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  full: 'w-full',
};

export default function Container({
  children,
  size = 'xl',
  className = '',
  ...props
}) {
  return (
    <div
      className={`mx-auto px-4 ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
