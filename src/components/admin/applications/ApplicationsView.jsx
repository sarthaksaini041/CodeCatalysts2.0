import React, { useMemo } from 'react';
import { Eye, CheckCircle, XCircle, Trash2, Download } from 'lucide-react';
import DataTable from '../shared/DataTable';
import StatusBadge from '../shared/StatusBadge';
import AdminButton from '../shared/AdminButton';
import { exportApplicationsCSV } from '../../../services/admin';

const ApplicationsView = ({
  applications,
  loading,
  onView,
  onUpdateStatus,
  onDelete,
  searchTerm,
  setSearchTerm,
  filterDomain,
  setFilterDomain,
  filterYear,
  setFilterYear,
}) => {
  const domains = useMemo(
    () => ['All Domains', ...new Set(applications.map((a) => a.domain).filter(Boolean))],
    [applications]
  );

  const years = useMemo(
    () => ['All Years', ...new Set(applications.map((a) => a.year).filter(Boolean))],
    [applications]
  );

  const filteredData = useMemo(() => {
    return applications.filter((app) => {
      const search = searchTerm.toLowerCase();
      const matchSearch =
        !search ||
        (app.name + ' ' + app.email).toLowerCase().includes(search);
      const matchDomain = filterDomain === 'All Domains' || app.domain === filterDomain;
      const matchYear = filterYear === 'All Years' || app.year === filterYear;
      return matchSearch && matchDomain && matchYear;
    });
  }, [applications, searchTerm, filterDomain, filterYear]);

  const columns = [
    {
      key: 'name',
      label: 'Applicant',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-semibold flex-shrink-0">
            {row.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{row.name}</p>
            <p className="text-xs text-slate-400 truncate">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'domain',
      label: 'Domain',
      render: (row) => (
        <span className="inline-flex px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs font-medium">
          {row.domain}
        </span>
      ),
    },
    {
      key: 'year',
      label: 'Year',
      cellClassName: 'text-sm text-slate-600 tabular-nums',
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (row) => (
        <span className="text-sm text-slate-500 tabular-nums">
          {new Date(row.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AdminButton variant="outline" size="sm" onClick={() => exportApplicationsCSV(applications)}>
          <Download size={14} /> Export CSV
        </AdminButton>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            label: 'Domain',
            value: filterDomain,
            onChange: setFilterDomain,
            options: domains,
          },
          {
            label: 'Year',
            value: filterYear,
            onChange: setFilterYear,
            options: years,
          },
        ]}
        emptyMessage="No applications match your search"
        renderActions={(row) => (
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => onView(row)}
              className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              title="View details"
            >
              <Eye size={15} />
            </button>
            <button
              onClick={() => onUpdateStatus(row.id, 'approved')}
              className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
              title="Approve"
            >
              <CheckCircle size={15} />
            </button>
            <button
              onClick={() => onUpdateStatus(row.id, 'rejected')}
              className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Reject"
            >
              <XCircle size={15} />
            </button>
            <button
              onClick={() => onDelete(row.id)}
              className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Delete"
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
      />
    </div>
  );
};

export default ApplicationsView;
