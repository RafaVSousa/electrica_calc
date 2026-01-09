// TransCalc - Select Component

import { forwardRef, type SelectHTMLAttributes } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  tooltip?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      tooltip,
      options,
      placeholder = 'Selecione...',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <div className="flex items-center gap-1 mb-1">
            <label
              htmlFor={selectId}
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

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`
              w-full px-3 py-2 pr-10 border rounded-lg outline-none transition-all duration-200 appearance-none bg-white
              ${error
                ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
              }
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {hint && !error && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
