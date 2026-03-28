import React, { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import {
  SectionCard, DragList, FormModal, ConfirmModal, Field,
  AdmInput, AdmTextarea, AdmSelect, IconBtn, AddButton
} from './AdminShared';
import { ICON_OPTIONS as ICONS } from './adminData';

const emptyCard = () => ({ id: Date.now(), title: '', tag: '', description: '', icon: 'Lightbulb' });

export default function AdminBuild({ data, onSave }) {
  const [items, setItems] = useState(data);
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState(emptyCard());

  const openAdd = () => { setForm(emptyCard()); setModal({ mode: 'add' }); };
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
    setItems(updated); onSave(updated);
    setConfirm(null);
  };

  return (
    <SectionCard
      title="How We Build"
      subtitle="Manage feature cards shown on the landing page — drag to reorder"
      action={<AddButton label="Add Card" onClick={openAdd} />}
    >
      <DragList
        items={items}
        keyFn={i => i.id}
        onReorder={(r) => { setItems(r); onSave(r); }}
        renderItem={(item) => (
          <div className="adm-build-row">
            <div className="adm-build-icon-badge">{item.icon}</div>
            <div className="adm-build-info">
              <span className="adm-build-tag">{item.tag}</span>
              <span className="adm-build-title">{item.title}</span>
              <span className="adm-build-desc">{item.description}</span>
            </div>
            <div className="adm-row-actions">
              <IconBtn icon={Edit2} onClick={() => openEdit(item)} title="Edit" />
              <IconBtn icon={Trash2} onClick={() => setConfirm(item.id)} title="Delete" danger />
            </div>
          </div>
        )}
      />

      <FormModal open={!!modal} title={modal?.mode === 'add' ? 'Add Build Card' : 'Edit Build Card'} onClose={() => setModal(null)} onSave={saveForm}>
        <Field label="Icon">
          <AdmSelect
            value={form.icon}
            onChange={v => setForm(f => ({ ...f, icon: v }))}
            options={ICONS.map(i => ({ value: i, label: i }))}
          />
        </Field>
        <Field label="Tag / Category">
          <AdmInput value={form.tag} onChange={v => setForm(f => ({ ...f, tag: v }))} placeholder="e.g. Engineering" />
        </Field>
        <Field label="Title">
          <AdmInput value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="Card title" />
        </Field>
        <Field label="Description">
          <AdmTextarea value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} rows={3} placeholder="Short description" />
        </Field>
      </FormModal>

      <ConfirmModal
        open={!!confirm}
        title="Delete Build Card"
        message="This card will be removed from the How We Build section."
        onConfirm={confirmDelete}
        onCancel={() => setConfirm(null)}
      />

      <style>{`
        .adm-build-row { display: flex; align-items: center; gap: 1rem; flex: 1; min-width: 0; }
        .adm-build-icon-badge { width: 40px; height: 40px; border-radius: 10px; background: rgba(0,212,255,0.08); border: 1px solid rgba(0,212,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 700; color: var(--adm-cyan); text-align: center; flex-shrink: 0; }
        .adm-build-info { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
        .adm-build-tag { font-size: 0.6rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: var(--adm-green); }
        .adm-build-title { font-size: 0.95rem; font-weight: 800; color: #fff; }
        .adm-build-desc { font-size: 0.8rem; color: rgba(255,255,255,0.4); }
      `}</style>
    </SectionCard>
  );
}
