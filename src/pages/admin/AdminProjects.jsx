import React, { useState } from 'react';
import { Edit2, Trash2, Star } from 'lucide-react';
import {
  SectionCard, DragList, FormModal, ConfirmModal, Field,
  AdmInput, AdmTextarea, AdmSelect, TagInput, Toggle, IconBtn, AddButton
} from './AdminShared';

const STATUS_OPTIONS = [
  { value: 'Released', label: 'Released' },
  { value: 'MVP', label: 'MVP' },
  { value: 'In Development', label: 'In Development' },
  { value: 'Archived', label: 'Archived' },
];

const emptyProject = () => ({
  id: Date.now(), title: '', category: '', status: 'In Development', featured: false,
  shortDescription: '', techStack: [], githubUrl: '', liveUrl: '',
});

export default function AdminProjects({ data, onSave }) {
  const [items, setItems] = useState(data);
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState(emptyProject());

  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  const openAdd = () => { setForm(emptyProject()); setModal({ mode: 'add' }); };
  const openEdit = (item) => { setForm({ ...item }); setModal({ mode: 'edit' }); };

  const saveForm = () => {
    if (!form.title.trim()) return;
    const updated = modal.mode === 'add'
      ? [...items, { ...form, id: Date.now() }]
      : items.map(i => i.id === form.id ? form : i);
    setItems(updated); onSave(updated);
    setModal(null);
  };

  const confirmDelete = () => {
    const updated = items.filter(i => i.id !== confirm);
    setItems(updated); onSave(updated); setConfirm(null);
  };

  return (
    <SectionCard
      title="Projects"
      subtitle="Manage all project entries — drag to reorder display order"
      action={<AddButton label="Add Project" onClick={openAdd} />}
    >
      <DragList
        items={items}
        keyFn={i => i.id}
        onReorder={(r) => { setItems(r); onSave(r); }}
        renderItem={(item) => (
          <div className="adm-proj-row">
            <div className="adm-proj-info">
              <div className="adm-proj-top-row">
                <span className="adm-proj-title">{item.title}</span>
                {item.featured && <span className="adm-proj-featured"><Star size={11} /> Featured</span>}
                <span className="adm-proj-status">{item.status}</span>
              </div>
              <span className="adm-proj-category">{item.category}</span>
              <span className="adm-proj-desc">{item.shortDescription}</span>
              <div className="adm-proj-chips">
                {(item.techStack || []).slice(0, 5).map(t => (
                  <span key={t} className="adm-proj-chip">{t}</span>
                ))}
              </div>
            </div>
            <div className="adm-row-actions">
              <IconBtn icon={Edit2} onClick={() => openEdit(item)} title="Edit" />
              <IconBtn icon={Trash2} onClick={() => setConfirm(item.id)} title="Delete" danger />
            </div>
          </div>
        )}
      />

      <FormModal
        open={!!modal}
        title={modal?.mode === 'add' ? 'Add Project' : 'Edit Project'}
        onClose={() => setModal(null)}
        onSave={saveForm}
      >
        <div className="adm-form-row2">
          <Field label="Title">
            <AdmInput value={form.title} onChange={set('title')} placeholder="Project name" />
          </Field>
          <Field label="Category">
            <AdmInput value={form.category} onChange={set('category')} placeholder="e.g. Web Platform" />
          </Field>
        </div>
        <div className="adm-form-row2">
          <Field label="Status">
            <AdmSelect value={form.status} onChange={set('status')} options={STATUS_OPTIONS} />
          </Field>
          <Field label="Featured">
            <div style={{ paddingTop: '0.6rem' }}>
              <Toggle checked={form.featured} onChange={set('featured')} label="Mark as featured" />
            </div>
          </Field>
        </div>
        <Field label="Short Description">
          <AdmTextarea value={form.shortDescription} onChange={set('shortDescription')} rows={3} placeholder="One-liner summary…" />
        </Field>
        <Field label="Tech Stack" hint="Press Enter or comma to add a tag">
          <div className="adm-tag-input-wrap">
            <TagInput tags={form.techStack} onChange={set('techStack')} />
          </div>
        </Field>
        <div className="adm-form-row2">
          <Field label="GitHub URL">
            <AdmInput value={form.githubUrl} onChange={set('githubUrl')} placeholder="https://github.com/…" type="url" />
          </Field>
          <Field label="Live URL">
            <AdmInput value={form.liveUrl} onChange={set('liveUrl')} placeholder="https://yoursite.dev" type="url" />
          </Field>
        </div>
      </FormModal>

      <ConfirmModal
        open={!!confirm}
        title="Delete Project"
        message="This project entry will be permanently deleted."
        onConfirm={confirmDelete}
        onCancel={() => setConfirm(null)}
      />

      <style>{`
        .adm-proj-row { display: flex; align-items: flex-start; gap: 1rem; flex: 1; min-width: 0; }
        .adm-proj-info { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0; }
        .adm-proj-top-row { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
        .adm-proj-title { font-size: 1rem; font-weight: 800; color: #fff; }
        .adm-proj-featured { display: inline-flex; align-items: center; gap: 3px; font-size: 0.6rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: var(--adm-cyan); background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.25); border-radius: 100px; padding: 2px 8px; }
        .adm-proj-status { font-size: 0.6rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 2px 6px; }
        .adm-proj-category { font-size: 0.72rem; color: var(--adm-purple); font-weight: 600; }
        .adm-proj-desc { font-size: 0.82rem; color: rgba(255,255,255,0.4); line-height: 1.4; }
        .adm-proj-chips { display: flex; flex-wrap: wrap; gap: 4px; }
        .adm-proj-chip { font-size: 0.65rem; padding: 2px 8px; border-radius: 100px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.45); }
      `}</style>
    </SectionCard>
  );
}
