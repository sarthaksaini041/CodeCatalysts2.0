import React from 'react';

const AdminCard = ({ children, title, description, icon: Icon, headerAction, className = '' }) => {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl shadow-sm ${className}`}>
      {(title || headerAction) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Icon size={18} />
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
              )}
              {description && (
                <p className="text-xs text-slate-400 mt-0.5">{description}</p>
              )}
            </div>
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default AdminCard;
