import React, { useState } from 'react';
import { Save, Plus, Trash2, Edit2, Link, Globe, Mail } from 'lucide-react';
import {
  SectionCard, Field, AdmInput, AdmTextarea, DragList, FormModal, ConfirmModal, IconBtn, AddButton
} from './AdminShared';
import { LinkedInIcon, GitHubIcon, InstagramIcon } from './AdminIcons';

const emptyFooterLink = () => ({ id: Date.now(), label: '', href: '#' });

export default function AdminGlobalSettings({ settings, onSave }) {
  const [form, setForm] = useState(settings || {});
  const [dirty, setDirty] = useState(false);

  // Footer Links modal state
  const [linkModal, setLinkModal] = useState(null); // { mode: 'add'|'edit', idx }
  const [linkForm, setLinkForm] = useState(emptyFooterLink());
  const [confirmDelete, setConfirmDelete] = useState(null); // idx

  const set = (k) => (v) => {
    setForm(f => ({ ...f, [k]: v }));
    setDirty(true);
  };

  const saveAll = () => {
    onSave(form);
    setDirty(false);
  };

  // ── Footer Link Handlers ──
  const openAddLink = () => {
    setLinkForm(emptyFooterLink());
    setLinkModal({ mode: 'add' });
  };
  const openEditLink = (idx, link) => {
    setLinkForm({ ...link });
    setLinkModal({ mode: 'edit', idx });
  };
  const saveLink = () => {
    const updatedLinks = [...(form.footerLinks || [])];
    if (linkModal.mode === 'add') {
      updatedLinks.push({ ...linkForm, id: Date.now() });
    } else {
      updatedLinks[linkModal.idx] = linkForm;
    }
    set('footerLinks')(updatedLinks);
    setLinkModal(null);
  };
  const deleteLink = () => {
    const updatedLinks = (form.footerLinks || []).filter((_, i) => i !== confirmDelete);
    set('footerLinks')(updatedLinks);
    setConfirmDelete(null);
  };

  return (
    <div className="adm-settings-container">
      <SectionCard
        title="Global Settings"
        subtitle="Manage contact info, social links, and branding"
        action={<button className="adm-btn adm-btn--primary" onClick={saveAll} disabled={!dirty}><Save size={15} /> Save All Settings</button>}
      >
        <div className="adm-settings-grid">
          <div className="adm-settings-col">
            <h3 className="adm-settings-sub">Contact & Socials</h3>
            <Field label="Contact Email">
              <div className="adm-input-icon-wrap">
                <Mail size={14} className="adm-field-icon" />
                <AdmInput value={form.contactEmail || ''} onChange={set('contactEmail')} placeholder="team@example.com" />
              </div>
            </Field>
            <Field label="LinkedIn URL">
              <div className="adm-input-icon-wrap">
                <LinkedInIcon size={14} className="adm-field-icon" />
                <AdmInput value={form.linkedinUrl || ''} onChange={set('linkedinUrl')} placeholder="https://linkedin.com/…" />
              </div>
            </Field>
            <Field label="GitHub URL">
              <div className="adm-input-icon-wrap">
                <GitHubIcon size={14} className="adm-field-icon" />
                <AdmInput value={form.githubUrl || ''} onChange={set('githubUrl')} placeholder="https://github.com/…" />
              </div>
            </Field>
            <Field label="Instagram URL">
              <div className="adm-input-icon-wrap">
                <InstagramIcon size={14} className="adm-field-icon" />
                <AdmInput value={form.instagramUrl || ''} onChange={set('instagramUrl')} placeholder="https://instagram.com/…" />
              </div>
            </Field>
          </div>

          <div className="adm-settings-col">
            <h3 className="adm-settings-sub">Footer Branding</h3>
            <Field label="Footer Tagline">
              <AdmTextarea value={form.footerTagline || ''} onChange={set('footerTagline')} rows={3} placeholder="Footer description text" />
            </Field>
            <Field label="Copyright Text">
              <AdmInput value={form.footerCopyright || ''} onChange={set('footerCopyright')} placeholder="© 2025 Code Catalysts…" />
            </Field>
          </div>
        </div>
      </SectionCard>

      <div style={{ marginTop: '2rem' }}>
        <SectionCard
          title="Footer Links"
          subtitle="Manage the navigation links in the website footer — drag to reorder"
          action={<AddButton label="Add Link" onClick={openAddLink} />}
        >
          <DragList
            items={form.footerLinks || []}
            keyFn={l => l.id}
            onReorder={(r) => set('footerLinks')(r)}
            renderItem={(item, i) => (
              <div className="adm-footer-link-row">
                <div className="adm-footer-link-info">
                  <span className="adm-footer-link-label">{item?.label || 'Untitled'}</span>
                  <span className="adm-footer-link-href">{item?.href || '#'}</span>
                </div>
                <div className="adm-row-actions">
                  <IconBtn icon={Edit2} onClick={() => openEditLink(i, item)} title="Edit" />
                  <IconBtn icon={Trash2} onClick={() => setConfirmDelete(i)} title="Delete" danger />
                </div>
              </div>
            )}
          />
        </SectionCard>
      </div>

      <FormModal open={!!linkModal} title={linkModal?.mode === 'add' ? 'Add Footer Link' : 'Edit Footer Link'} onClose={() => setLinkModal(null)} onSave={saveLink}>
        <Field label="Link Label"><AdmInput value={linkForm.label} onChange={v => setLinkForm(f => ({ ...f, label: v }))} placeholder="e.g. Terms of Service" /></Field>
        <Field label="Destination (URL or Anchor)"><AdmInput value={linkForm.href} onChange={v => setLinkForm(f => ({ ...f, href: v }))} placeholder="e.g. /terms or #home" /></Field>
      </FormModal>

      <ConfirmModal
        open={confirmDelete !== null}
        title="Delete Footer Link"
        message="This footer link will be removed from the website."
        onConfirm={deleteLink}
        onCancel={() => setConfirmDelete(null)}
      />

      <style>{`
        .adm-settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; }
        .adm-settings-sub { font-size: 0.7rem; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; color: var(--adm-cyan); margin-bottom: 1.5rem; border-bottom: 1px solid rgba(0,212,255,0.1); padding-bottom: 0.5rem; }
        .adm-input-icon-wrap { position: relative; }
        .adm-field-icon { position: absolute; left: 12px; top: 13px; color: rgba(255,255,255,0.2); pointer-events: none; }
        .adm-settings-col .adm-input { padding-left: 38px; }

        .adm-footer-link-row { display: flex; align-items: center; justify-content: space-between; flex: 1; min-width: 0; }
        .adm-footer-link-info { display: flex; flex-direction: column; gap: 2px; }
        .adm-footer-link-label { font-size: 0.95rem; font-weight: 700; color: #fff; }
        .adm-footer-link-href { font-size: 0.75rem; color: rgba(255,255,255,0.3); font-family: monospace; }

        @media (max-width: 768px) { .adm-settings-grid { grid-template-columns: 1fr; gap: 2rem; } }
      `}</style>
    </div>
  );
}
