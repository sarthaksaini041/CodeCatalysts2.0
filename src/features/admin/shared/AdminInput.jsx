import React from 'react';

const AdminInput = React.forwardRef(
  (
    {
      label,
      error,
      required = false,
      type = 'text',
      rows = 4,
      options,
      className = '',
      containerClassName = '',
      ...props
    },
    ref
  ) => {
    const baseClass = `
      w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5
      text-sm text-slate-900 placeholder:text-slate-400
      outline-none transition-colors duration-200
      focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
      disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
      ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}
      ${className}
    `;

    const renderInput = () => {
      if (type === 'textarea') {
        return (
          <textarea
            ref={ref}
            rows={rows}
            className={`${baseClass} resize-none`}
            {...props}
          />
        );
      }

      if (type === 'select') {
        return (
          <select ref={ref} className={`${baseClass} cursor-pointer`} {...props}>
            {options?.map((opt) => {
              const value = typeof opt === 'string' ? opt : opt.value;
              const label = typeof opt === 'string' ? opt : opt.label;
              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
        );
      }

      return <input ref={ref} type={type} className={baseClass} {...props} />;
    };

    return (
      <div className={`space-y-1.5 ${containerClassName}`}>
        {label && (
          <label className="block text-xs font-medium text-slate-600">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        {renderInput()}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

AdminInput.displayName = 'AdminInput';
export default AdminInput;
