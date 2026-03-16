/**
 * Reusable Badge component for labels and tags.
 *
 * Variants:
 * - sale: Cadetblue background (for "Продажба")
 * - rent: Graphite background (for "Наем")
 * - neutral: White/light background (for property types)
 * - success: Green background
 * - warning: Yellow background
 * - error: Red background
 *
 * Sizes: sm, md, lg
 */

import { getTranslations } from '@/lib/translations';

const variants = {
  sale: 'bg-cadetblue text-white',
  rent: 'bg-graphite text-white',
  neutral: 'bg-white/90 text-gray-700 shadow-sm',
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-500 text-white',
  error: 'bg-red-500 text-white',
  outline: 'bg-transparent border border-graphite text-graphite',
  'outline-light': 'bg-transparent border border-white/50 text-white',
};

const sizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-xs',
  lg: 'px-4 py-2 text-sm',
};

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full';

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

/**
 * Pre-configured badge for property categories
 */
Badge.Category = function CategoryBadge({ category, size = 'md', className = '', locale }) {
  const t = locale ? getTranslations(locale)?.property : null;
  const labels = t
    ? { sale: t.sale, rent: t.rent }
    : { sale: 'Продажба', rent: 'Наем' };

  return (
    <Badge variant={category} size={size} className={`font-semibold ${className}`}>
      {labels[category] || category}
    </Badge>
  );
};

/**
 * Pre-configured badge for property types
 */
Badge.Type = function TypeBadge({ type, size = 'md', className = '', locale }) {
  const t = locale ? getTranslations(locale)?.property : null;
  const label = t && t[type] != null ? t[type] : type;

  return (
    <Badge variant="neutral" size={size} className={className}>
      {label}
    </Badge>
  );
};
