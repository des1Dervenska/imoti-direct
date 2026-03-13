/**
 * Reusable Card component for content containers.
 *
 * Variants:
 * - default: White background with subtle shadow
 * - outlined: Border only, no shadow
 * - elevated: Stronger shadow for emphasis
 * - light: Light gray background, no shadow
 */

const variants = {
  default: 'bg-white shadow-sm',
  outlined: 'bg-white border border-gray-200',
  elevated: 'bg-white shadow-lg',
  light: 'bg-gray-50',
};

export default function Card({
  children,
  variant = 'default',
  className = '',
  padding = true,
  ...props
}) {
  const baseStyles = 'rounded-xl overflow-hidden';
  const paddingStyles = padding ? 'p-6' : '';

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${paddingStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card.Header - Optional header section
 */
Card.Header = function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
};

/**
 * Card.Body - Main content area
 */
Card.Body = function CardBody({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

/**
 * Card.Footer - Optional footer section
 */
Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-4 pt-4 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  );
};
