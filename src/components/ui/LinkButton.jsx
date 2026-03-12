import Link from 'next/link';

/**
 * Reusable LinkButton component - combines Next.js Link with Button styling.
 *
 * Use this for navigation links that should look like buttons.
 * For actual form submit buttons, use the Button component instead.
 *
 * Variants:
 * - primary: Graphite background
 * - secondary: Outlined style
 * - ghost: Minimal style
 * - accent: Cadetblue background (for CTAs)
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
  'accent-outline':
    'bg-transparent border-2 border-cadetblue text-cadetblue hover:bg-cadetblue hover:text-white',
  white:
    'bg-white hover:bg-gray-100 text-graphite shadow-sm',
  'white-outline':
    'bg-transparent border-2 border-white text-white hover:bg-white hover:text-graphite',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
};

export default function LinkButton({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  external = false,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-graphite/50 focus:ring-offset-2';

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  // External links use <a> tag
  if (external) {
    return (
      <a
        href={href}
        className={combinedClassName}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  // Internal links use Next.js Link
  return (
    <Link href={href} className={combinedClassName} {...props}>
      {children}
    </Link>
  );
}
