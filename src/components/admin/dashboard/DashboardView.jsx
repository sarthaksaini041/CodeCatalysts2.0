import React, { useMemo } from 'react';
import { Users, Clock, CheckCircle, XCircle, ArrowRight, Download } from 'lucide-react';
import AdminStatCard from '../shared/AdminStatCard';
import AdminCard from '../shared/AdminCard';
import AdminButton from '../shared/AdminButton';
import StatusBadge from '../shared/StatusBadge';
import { exportApplicationsCSV, toggleRecruitment } from '../../../services/admin';
import { useCMS } from '../../../hooks/useCMS';

const DashboardView = ({ applications, loading, onViewApplication, setActiveTab }) => {
  const { siteContent } = useCMS();

  const stats = useMemo(() => {
    const total = applications.length;
    const approved = applications.filter((a) => a.status === 'approved').length;
    const rejected = applications.filter((a) => a.status === 'rejected').length;
    const pending = applications.filter((a) => !a.status || a.status === 'pending').length;
    return { total, approved, rejected, pending };
  }, [applications]);

  const recentApplications = useMemo(
    () => applications.slice(0, 8),
    [applications]
  );

  const isRecruitmentOpen = siteContent.applyPageEnabled !== 'false';

  const handleToggleRecruitment = async () => {
    try {
      await toggleRecruitment(siteContent.applyPageEnabled);
      window.location.reload();
    } catch (err) {
      alert('Failed to update: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard title="Total Applications" value={stats.total} icon={Users} color="slate" />
        <AdminStatCard title="Pending Review" value={stats.pending} icon={Clock} color="amber" />
        <AdminStatCard title="Approved" value={stats.approved} icon={CheckCircle} color="emerald" />
        <AdminStatCard title="Rejected" value={stats.rejected} icon={XCircle} color="rose" />
      </div>

      {/* Recruitment Status */}
      <AdminCard>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                isRecruitmentOpen
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                  : 'bg-slate-100 border-slate-200 text-slate-400'
              }`}
            >
              <Users size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Recruitment Status</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isRecruitmentOpen ? 'Accepting new applications' : 'Applications are closed'}
              </p>
            </div>
          </div>
          <AdminButton
            variant={isRecruitmentOpen ? 'danger' : 'primary'}
            size="sm"
            onClick={handleToggleRecruitment}
          >
            {isRecruitmentOpen ? 'Close Applications' : 'Open Applications'}
          </AdminButton>
        </div>
      </AdminCard>

      {/* Recent Applications */}
      <AdminCard
        title="Recent Applications"
        headerAction={
          <div className="flex items-center gap-2">
            <AdminButton variant="outline" size="sm" onClick={() => exportApplicationsCSV(applications)}>
              <Download size={14} /> Export CSV
            </AdminButton>
            <AdminButton variant="ghost" size="sm" onClick={() => setActiveTab('applications')}>
              View All <ArrowRight size={14} />
            </AdminButton>
          </div>
        }
      >
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : recentApplications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-slate-400">No applications yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto -m-6 mt-0">
            <table className="w-full text-left min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Domain</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentApplications.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => onViewApplication(app)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-semibold">
                          {app.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{app.name}</p>
                          <p className="text-xs text-slate-400">{app.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-flex px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                        {app.domain}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-500 tabular-nums">
                      {new Date(app.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-3">
                      <StatusBadge status={app.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
};

export default DashboardView;
