/**
 * FeatureCard - Reusable card for features, services, benefits.
 *
 * Used for:
 * - About page services
 * - Rent page info cards
 * - Home page "Why Choose Us"
 *
 * Hover effects:
 * - lift: Card lifts up with shadow (default)
 * - glow: Subtle glow effect
 * - border: Border color change
 * - none: No hover effect
 */

const hoverEffects = {
  lift: 'hover:-translate-y-2 hover:shadow-lg',
  glow: 'hover:shadow-[0_0_20px_rgba(0,151,178,0.3)]',
  border: 'hover:border-cadetblue',
  none: '',
};

const backgroundStyles = {
  white: 'bg-white rounded-xl border border-gray-100',
  light: 'bg-gray-50 rounded-xl border border-gray-100',
  transparent: '',
};

const iconContainerStyles = {
  rounded: 'rounded-lg',
  square: 'rounded-lg',
};

export default function FeatureCard({
  title,
  description,
  icon,
  iconShape = 'rounded',
  background = 'white',
  hoverEffect = 'lift',
  centered = true,
  className = '',
}) {
  const baseStyles = 'p-6 transition-all duration-300 group';
  const alignmentStyles = centered ? 'text-center' : '';
  const iconAlignment = centered ? 'mx-auto' : '';

  return (
    <div className={`${baseStyles} ${backgroundStyles[background]} ${hoverEffects[hoverEffect]} ${alignmentStyles} ${className}`}>
      {/* Icon */}
      <div
        className={`w-14 h-14 bg-cadetblue/15 rounded-lg flex items-center justify-center mb-4 ${iconAlignment} transition-colors duration-300 group-hover:bg-cadetblue/25`}
      >
        {typeof icon === 'string' ? (
          <svg
            className="w-6 h-6 text-graphite"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={icon}
            />
          </svg>
        ) : (
          icon
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-graphite mb-2">{title}</h3>

      {/* Description */}
      <p className="text-graphite-light text-sm">{description}</p>
    </div>
  );
}

/**
 * FeatureCard.Grid - Wrapper for feature card grids
 */
FeatureCard.Grid = function FeatureCardGrid({
  children,
  columns = 3,
  className = '',
}) {
  const columnStyles = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid grid-cols-1 ${columnStyles[columns]} gap-8 ${className}`}>
      {children}
    </div>
  );
};
