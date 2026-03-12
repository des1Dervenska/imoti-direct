/**
 * Reusable Section component for page sections.
 *
 * Provides consistent vertical spacing and optional background colors.
 */

const backgrounds = {
  white: 'bg-white',
  light: 'bg-gray-50',
  dark: 'bg-[#495464] text-[#f8f6f2]',
  gradient: 'bg-gradient-to-r from-[#495464] to-[#6b7a8f] text-[#f8f6f2]',
};

const paddings = {
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
  xl: 'py-20',
};

export default function Section({
  children,
  background = 'white',
  padding = 'lg',
  className = '',
  ...props
}) {
  return (
    <section
      className={`${backgrounds[background]} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}

/**
 * Section.Header - Centered section header with title and subtitle
 */
Section.Header = function SectionHeader({
  title,
  subtitle,
  centered = true,
  className = '',
}) {
  return (
    <div className={`mb-10 ${centered ? 'text-center' : ''} ${className}`}>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg opacity-80 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};
