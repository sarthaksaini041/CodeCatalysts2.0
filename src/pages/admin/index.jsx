import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import {
  getSession,
  onAuthStateChange,
  fetchApplications,
  updateApplicationStatus,
  deleteApplication,
} from '@/core/services/admin';
import { useDebounce } from '@/core/hooks/useDebounce';

// Lazy-load heavy components
const AdminLayout = dynamic(() => import('@/features/admin/layout/AdminLayout'), { ssr: false });
const DashboardView = dynamic(() => import('@/features/admin/dashboard/DashboardView'), { ssr: false });
const ApplicationsView = dynamic(() => import('@/features/admin/applications/ApplicationsView'), { ssr: false });
const ApplicationDetail = dynamic(() => import('@/features/admin/applications/ApplicationDetail'), { ssr: false });

// CMS Editors
const HeroEditor = dynamic(() => import('@/features/cms/HeroEditor'), { ssr: false });
const GenesisEditor = dynamic(() => import('@/features/cms/GenesisEditor'), { ssr: false });
const ShiftEditor = dynamic(() => import('@/features/cms/ShiftEditor'), { ssr: false });
const JourneyEditor = dynamic(() => import('@/features/cms/JourneyEditor'), { ssr: false });
const ForgeEditor = dynamic(() => import('@/features/cms/ForgeEditor'), { ssr: false });
const ArchitectsEditor = dynamic(() => import('@/features/cms/ArchitectsEditor'), { ssr: false });
const TeamEditor = dynamic(() => import('@/features/cms/TeamEditor'), { ssr: false });
const FooterEditor = dynamic(() => import('@/features/cms/FooterEditor'), { ssr: false });

const CMS_TABS = {
  hero: HeroEditor,
  genesis: GenesisEditor,
  shift: ShiftEditor,
  journey: JourneyEditor,
  projects: ForgeEditor,
  architects: ArchitectsEditor,
  team: TeamEditor,
  footer: FooterEditor,
};

export default function AdminPage() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // Dashboard state (Synced with URL to enable scroll restoration and back/forward)
  const activeTab = router.query.tab || 'dashboard';
  
  const handleTabChange = useCallback((tab) => {
    router.push({
      pathname: '/admin',
      query: { tab }
    }, undefined, { shallow: true });
  }, [router]);

  const [applications, setApplications] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState('All Domains');
  const [filterYear, setFilterYear] = useState('All Years');

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Auth
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await getSession();
        if (!session) {
          router.replace('/admin/login');
          return;
        }
        setAuthenticated(true);
      } catch {
        router.replace('/admin/login');
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();

    const subscription = onAuthStateChange((session) => {
      if (!session) router.replace('/admin/login');
      setAuthenticated(!!session);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // Data
  const loadApplications = useCallback(async () => {
    setDataLoading(true);
    try {
      const data = await fetchApplications();
      setApplications(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) loadApplications();
  }, [authenticated, loadApplications]);

  // Actions
  const handleUpdateStatus = useCallback(async (id, status) => {
    try {
      await updateApplicationStatus(id, status);
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      setSelectedApp((prev) => (prev?.id === id ? { ...prev, status } : prev));
    } catch (err) {
      console.error('Update error:', err);
    }
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Delete this application? This cannot be undone.')) return;
    try {
      await deleteApplication(id);
      setApplications((prev) => prev.filter((a) => a.id !== id));
      setSelectedApp(null);
    } catch (err) {
      console.error('Delete error:', err);
    }
  }, []);

  // Loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) return null;

  // Resolve CMS component
  const CmsComponent = CMS_TABS[activeTab] ?? null;

  return (
    <>
      <Head>
        <title>Admin | Code Catalysts</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminLayout activeTab={activeTab} setActiveTab={handleTabChange}>
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <DashboardView
            applications={applications}
            loading={dataLoading}
            onViewApplication={setSelectedApp}
            setActiveTab={handleTabChange}
          />
        )}

        {/* Applications */}
        {activeTab === 'applications' && (
          <ApplicationsView
            applications={applications}
            loading={dataLoading}
            onView={setSelectedApp}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDelete}
            searchTerm={debouncedSearch}
            setSearchTerm={setSearchTerm}
            filterDomain={filterDomain}
            setFilterDomain={setFilterDomain}
            filterYear={filterYear}
            setFilterYear={setFilterYear}
          />
        )}

        {/* CMS Editors */}
        {CmsComponent && <CmsComponent />}
      </AdminLayout>

      {/* Application detail modal */}
      <ApplicationDetail
        app={selectedApp}
        onClose={() => setSelectedApp(null)}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDelete}
      />
    </>
  );
}
