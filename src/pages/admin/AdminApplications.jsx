import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Mail, Code2 } from 'lucide-react';
import { SectionCard, ConfirmModal, IconBtn } from './AdminShared';
import { GitHubIcon } from './AdminIcons';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = 'https://ebyimwixrytwgvdvgmmz.supabase.co';
const supabaseKey = 'sb_publishable_eu5e4DIZf8t3XwV1lJp9rQ_JNsF5k3N';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminApplications() {
  const [apps, setApps] = useState([]);
  const [selected, setSelected] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('applicants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
    } else {
      setApps(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from('applicants')
      .delete()
      .eq('id', confirm);

    if (error) {
      alert('Error deleting application');
    } else {
      setApps(apps.filter(a => a.id !== confirm));
      if (selected?.id === confirm) setSelected(null);
    }
    setConfirm(null);
  };

  const fmt = (iso) => new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <SectionCard
      title="Live Applications"
      subtitle={`${apps.length} total submission${apps.length !== 1 ? 's' : ''}`}
    >
      {loading ? (
        <div className="adm-empty">Connecting to intelligence network...</div>
      ) : apps.length === 0 ? (
        <div className="adm-empty">No catalysts found in the registry yet.</div>
      ) : (
        <div className="adm-apps-layout">
          {/* List panel */}
          <div className="adm-apps-list">
            {apps.map(app => (
              <button
                key={app.id}
                className={`adm-app-row ${selected?.id === app.id ? 'adm-app-row--active' : ''}`}
                onClick={() => setSelected(app)}
              >
                <div className="adm-app-avatar">{app.name.split(' ').map(n => n[0]).join('')}</div>
                <div className="adm-app-brief">
                  <span className="adm-app-name">{app.name}</span>
                  <span className="adm-app-email">{app.email}</span>
                  <span className="adm-app-meta">{app.college} · Year {app.year} · {fmt(app.created_at)}</span>
                </div>
                <div className="adm-row-actions" onClick={e => e.stopPropagation()}>
                  <IconBtn icon={Trash2} onClick={() => setConfirm(app.id)} title="Delete" danger />
                </div>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="adm-app-detail">
            {!selected ? (
              <div className="adm-app-detail-empty">
                <Eye size={32} />
                <p>Select a node to inspect application data</p>
              </div>
            ) : (
              <>
                <div className="adm-app-detail-header">
                  <div className="adm-app-detail-avatar">{selected.name.split(' ').map(n => n[0]).join('')}</div>
                  <div>
                    <h3 className="adm-app-detail-name">{selected.name}</h3>
                    <span className="adm-app-detail-sub">{selected.college} · Year {selected.year}</span>
                  </div>
                </div>

                <div className="adm-app-detail-section">
                  <div className="adm-app-detail-label"><Mail size={12} /> Contact</div>
                  <a href={`mailto:${selected.email}`} className="adm-app-detail-link">{selected.email}</a>
                </div>

                <div className="adm-app-detail-section">
                   <div style={{ display: 'flex', gap: '2rem' }}>
                      {selected.linkedin_url && (
                        <div>
                          <div className="adm-app-detail-label">LinkedIn</div>
                          <a href={selected.linkedin_url} target="_blank" rel="noreferrer" className="adm-app-detail-link">Profile Interface</a>
                        </div>
                      )}
                      {selected.github_url && (
                        <div>
                          <div className="adm-app-detail-label">GitHub</div>
                          <a href={selected.github_url} target="_blank" rel="noreferrer" className="adm-app-detail-link">Repository Access</a>
                        </div>
                      )}
                   </div>
                </div>

                <div className="adm-app-detail-section">
                  <div className="adm-app-detail-label"><Code2 size={12} /> Specialization</div>
                  <p className="adm-app-detail-text" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{selected.domain}</p>
                  <p className="adm-app-detail-text" style={{ marginTop: '0.5rem' }}>Arsenal: {selected.tech_stack}</p>
                </div>

                <div className="adm-app-detail-section">
                  <div className="adm-app-detail-label">The Why</div>
                  <p className="adm-app-detail-text" style={{ whiteSpace: 'pre-wrap' }}>{selected.why_join}</p>
                </div>
                
                <div className="adm-app-detail-section">
                  <div className="adm-app-detail-label">Timestamp</div>
                  <p className="adm-app-detail-text">{fmt(selected.created_at)}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!confirm}
        title="Delete Node Data"
        message="This applicant data will be removed from the registry. This action is irreversible."
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
      />

      <style>{`
        .adm-apps-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; align-items: start; }
        .adm-apps-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .adm-app-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem 1rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.02); cursor: pointer; text-align: left; width: 100%; transition: all 0.2s ease; }
        .adm-app-row:hover { border-color: rgba(0,240,255,0.3); background: rgba(0,240,255,0.05); }
        .adm-app-row--active { border-color: rgba(0,240,255,0.5); background: rgba(0,240,255,0.08); }
        .adm-app-avatar { width: 36px; height: 36px; border-radius: 10px; background: rgba(0,240,255,0.1); border: 1px solid rgba(0,240,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; color: var(--primary); flex-shrink: 0; }
        .adm-app-brief { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; overflow: hidden; }
        .adm-app-name { font-size: 0.9rem; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .adm-app-email { font-size: 0.75rem; color: rgba(255,255,255,0.4); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .adm-app-meta { font-size: 0.65rem; color: rgba(255,255,255,0.25); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .adm-app-detail { border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 1.5rem; background: rgba(255,255,255,0.02); min-height: 300px; position: sticky; top: 0; }
        .adm-app-detail-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; min-height: 300px; color: rgba(255,255,255,0.2); font-size: 0.85rem; text-align: center; }
        .adm-app-detail-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .adm-app-detail-avatar { width: 48px; height: 48px; border-radius: 14px; background: rgba(0,240,255,0.1); border: 1px solid rgba(0,240,255,0.25); display: flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 800; color: var(--primary); flex-shrink: 0; }
        .adm-app-detail-name { font-size: 1.1rem; font-weight: 800; color: #fff; margin: 0 0 3px; }
        .adm-app-detail-sub { font-size: 0.72rem; color: rgba(255,255,255,0.35); }
        .adm-app-detail-section { margin-bottom: 1.5rem; }
        .adm-app-detail-label { display: flex; align-items: center; gap: 5px; font-size: 0.62rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.25); margin-bottom: 0.4rem; }
        .adm-app-detail-text { font-size: 0.85rem; color: rgba(255,255,255,0.55); line-height: 1.65; margin: 0; }
        .adm-app-detail-link { font-size: 0.85rem; color: var(--primary); text-decoration: none; }
        .adm-app-detail-link:hover { text-decoration: underline; }

        @media (max-width: 800px) { .adm-apps-layout { grid-template-columns: 1fr; } }
      `}</style>
    </SectionCard>
  );
}
