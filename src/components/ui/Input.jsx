'use client';

import { forwardRef } from 'react';

/**
 * Reusable Input component with consistent styling.
 *
 * Supports: text, email, tel, password, number, textarea
 */

const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    type = 'text',
    className = '',
    containerClassName = '',
    required = false,
    ...props
  },
  ref
) {
  const baseStyles =
    'w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-graphite placeholder-graphite-light transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-graphite/30 focus:border-graphite';

  const errorStyles = error
    ? 'border-red-400 focus:ring-red-300 focus:border-red-400'
    : '';

  const isTextarea = type === 'textarea';
  const Component = isTextarea ? 'textarea' : 'input';

  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-graphite mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <Component
        ref={ref}
        type={isTextarea ? undefined : type}
        className={`${baseStyles} ${errorStyles} ${className}`}
        {...props}
      />

      {(error || helperText) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-red-500' : 'text-graphite-light'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

export default Input;
