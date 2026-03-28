import React, { useState } from 'react';
import { 
  LayoutDashboard, History, Hammer, Briefcase, 
  FileText, Users, Settings, LogOut, Bell 
} from 'lucide-react';

// Data & Styles
import './admin/AdminPage.css';
import * as InitialData from './admin/adminData';

// Shared
import { Toast, useToast, IconBtn } from './admin/AdminShared';

// Sections
import AdminStory from './admin/AdminStory';
import AdminJourney from './admin/AdminJourney';
import AdminBuild from './admin/AdminBuild';
import AdminProjects from './admin/AdminProjects';
import AdminApplications from './admin/AdminApplications';
import AdminTeam from './admin/AdminTeam';
import AdminGlobalSettings from './admin/AdminGlobalSettings';

const NAVIGATION = [
  { id: 'story', label: 'Our Story', icon: LayoutDashboard },
  { id: 'journey', label: 'Our Journey', icon: History },
  { id: 'build', label: 'How We Build', icon: Hammer },
  { id: 'projects', label: 'Projects', icon: Briefcase },
  { id: 'applications', label: 'Applications', icon: FileText },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('story');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { toasts, addToast, removeToast } = useToast();

  // ── Global State ──
  const [story, setStory] = useState({ text: InitialData.INITIAL_STORY, images: InitialData.INITIAL_STORY_IMAGES });
  const [journey, setJourney] = useState(InitialData.INITIAL_JOURNEY);
  const [buildCards, setBuildCards] = useState(InitialData.INITIAL_BUILD_CARDS);
  const [projects, setProjects] = useState(InitialData.INITIAL_PROJECTS);
  const [applications, setApplications] = useState(InitialData.INITIAL_APPLICATIONS);
  const [leader, setLeader] = useState(InitialData.INITIAL_LEADER);
  const [reps, setReps] = useState(InitialData.INITIAL_REPS);
  const [settings, setSettings] = useState(InitialData.INITIAL_SETTINGS);

  // ── Logic ──
  const activeNavItem = NAVIGATION.find(n => n.id === activeTab);

  const handleSave = (sectionName) => {
    addToast(`${sectionName} saved successfully!`, 'success');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout from the Admin Portal?')) {
      window.location.href = '/';
    }
  };

  const renderCurrentSection = () => {
    switch (activeTab) {
      case 'story':        return <AdminStory data={story} onSave={(v) => { setStory(v); handleSave('Our Story'); }} />;
      case 'journey':      return <AdminJourney data={journey} onSave={(v) => { setJourney(v); handleSave('Our Journey'); }} />;
      case 'build':        return <AdminBuild data={buildCards} onSave={(v) => { setBuildCards(v); handleSave('How We Build'); }} />;
      case 'projects':     return <AdminProjects data={projects} onSave={(v) => { setProjects(v); handleSave('Projects'); }} />;
      case 'applications': return <AdminApplications data={applications} onDelete={(v) => { setApplications(v); handleSave('Applications (deleted)'); }} />;
      case 'team':         return <AdminTeam leader={leader} reps={reps} onSaveLeader={(v) => { setLeader(v); handleSave('Leader info'); }} onSaveReps={(v) => { setReps(v); handleSave('Hub representatives'); }} />;
      case 'settings':     return <AdminGlobalSettings settings={settings} onSave={(v) => { setSettings(v); handleSave('Global Settings'); }} />;
      default:             return <div className="adm-empty">Section under construction.</div>;
    }
  };

  return (
    <div className="adm-page">
      {/* ── SIDEBAR ── */}
      <aside className={`adm-sidebar ${isSidebarOpen ? 'adm-sidebar--open' : ''}`}>
        <div className="adm-sidebar-header">
          <div className="adm-logo-mini" />
          <span className="adm-brand">ADMIN <span style={{ color: 'var(--adm-cyan)' }}>PORTAL</span></span>
        </div>

        <nav className="adm-nav">
          {NAVIGATION.map((item) => (
            <div
              key={item.id}
              className={`adm-nav-item ${activeTab === item.id ? 'adm-nav-item--active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <button className="adm-nav-item" onClick={handleLogout} style={{ width: '100%', justifyContent: 'flex-start', background: 'transparent', border: 'none' }}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
          <p style={{ marginTop: '1rem', opacity: 0.3 }}>Code Catalysts v1.0</p>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="adm-main">
        <header className="adm-header">
          <div>
            <div className="adm-current-tag">MANAGEMENT / {activeNavItem?.label}</div>
            <h1 className="adm-title">{activeNavItem?.label}</h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <IconBtn icon={Bell} onClick={() => addToast('No new notifications', 'info')} title="Notifications" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.04)', padding: '6px 16px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--adm-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>AD</div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Admin User</span>
            </div>
          </div>
        </header>

        <section className="adm-content-wrapper" key={activeTab}>
          {renderCurrentSection()}
        </section>
      </main>

      {/* ── TOASTS ── */}
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
