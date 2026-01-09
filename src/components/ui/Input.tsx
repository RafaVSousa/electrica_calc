// TransCalc - Input Component

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { HelpCircle } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  tooltip?: string;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      tooltip,
      leftAddon,
      rightAddon,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <div className="flex items-center gap-1 mb-1">
            <label
              htmlFor={inputId}
              className="block text-sm font-medium text-gray-700"
            >
              {label}
            </label>
            {tooltip && (
              <div className="relative group">
                <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute z-10 hidden group-hover:block w-64 p-2 mt-1 text-sm text-white bg-gray-900 rounded-lg shadow-lg -left-28 top-full">
                  {tooltip}
                  <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -top-1 left-1/2 -translate-x-1/2" />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="relative flex">
          {leftAddon && (
            <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg">
              {leftAddon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`
              flex-1 px-3 py-2 border rounded-lg outline-none transition-all duration-200
              ${leftAddon ? 'rounded-l-none' : ''}
              ${rightAddon ? 'rounded-r-none' : ''}
              ${error
                ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
              }
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          />

          {rightAddon && (
            <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-l-0 border-gray-300 rounded-r-lg">
              {rightAddon}
            </span>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {hint && !error && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
