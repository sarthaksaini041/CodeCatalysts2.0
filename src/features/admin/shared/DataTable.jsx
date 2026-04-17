import React, { useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';

const DataTable = ({
  columns,
  data,
  loading = false,
  searchTerm = '',
  onSearchChange,
  filters = [],
  emptyMessage = 'No records found',
  renderActions,
}) => {
  return (
    <div className="space-y-4">
      {/* Controls */}
      {(onSearchChange || filters.length > 0) && (
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
          {onSearchChange && (
            <div className="relative w-full md:w-80">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search..."
                className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors shadow-sm"
              />
            </div>
          )}

          <div className="flex items-center gap-2 w-full md:w-auto">
            {filters.map((filter) => (
              <div key={filter.label} className="relative w-full md:w-44">
                <select
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className="appearance-none w-full bg-white border border-slate-200 rounded-lg py-2 pl-3 pr-8 text-sm text-slate-600 cursor-pointer outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors shadow-sm"
                >
                  {filter.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={14}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide ${col.align === 'right' ? 'text-right' : ''} ${col.className || ''}`}
                  >
                    {col.label}
                  </th>
                ))}
                {renderActions && (
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide text-right">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className="hover:bg-slate-50 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-sm ${col.align === 'right' ? 'text-right' : ''} ${col.cellClassName || ''}`}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {renderActions && (
                    <td className="px-4 py-3 text-right">
                      {renderActions(row)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {!loading && data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Search className="text-slate-300" size={24} />
            </div>
            <p className="text-sm text-slate-400 font-medium">{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(DataTable);
