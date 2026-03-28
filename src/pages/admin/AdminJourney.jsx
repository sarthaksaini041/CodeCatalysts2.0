import React, { useState } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import {
  SectionCard, DragList, FormModal, ConfirmModal, Field,
  AdmInput, AdmTextarea, IconBtn, AddButton
} from './AdminShared';

const emptyMilestone = () => ({ id: Date.now(), date: '', title: '', description: '' });

export default function AdminJourney({ data, onSave }) {
  const [items, setItems] = useState(data);
  const [modal, setModal] = useState(null); // null | { mode:'add'|'edit', item }
  const [confirm, setConfirm] = useState(null); // null | id
  const [form, setForm] = useState(emptyMilestone());

  const openAdd = () => { setForm(emptyMilestone()); setModal({ mode: 'add' }); };
  const openEdit = (item) => { setForm({ ...item }); setModal({ mode: 'edit', item }); };
  const openDelete = (id) => setConfirm(id);

  const saveForm = () => {
    if (!form.title.trim() || !form.date.trim()) return;
    if (modal.mode === 'add') {
      const updated = [...items, { ...form, id: Date.now() }];
      setItems(updated); onSave(updated);
    } else {
      const updated = items.map(i => i.id === form.id ? form : i);
      setItems(updated); onSave(updated);
    }
    setModal(null);
  };

  const confirmDelete = () => {
    const updated = items.filter(i => i.id !== confirm);
    setItems(updated); onSave(updated);
    setConfirm(null);
  };

  return (
    <SectionCard
      title="Our Journey"
      subtitle="Manage timeline milestones — drag to reorder"
      action={<AddButton label="Add Milestone" onClick={openAdd} />}
    >
      <DragList
        items={items}
        keyFn={i => i.id}
        onReorder={(reordered) => { setItems(reordered); onSave(reordered); }}
        renderItem={(item) => (
          <div className="adm-journey-row">
            <div className="adm-journey-info">
              <span className="adm-journey-date">{item.date || '—'}</span>
              <span className="adm-journey-title">{item.title}</span>
              <span className="adm-journey-desc">{item.description}</span>
            </div>
            <div className="adm-row-actions">
              <IconBtn icon={Edit2} onClick={() => openEdit(item)} title="Edit" />
              <IconBtn icon={Trash2} onClick={() => openDelete(item.id)} title="Delete" danger />
            </div>
          </div>
        )}
      />

      <FormModal open={!!modal} title={modal?.mode === 'add' ? 'Add Milestone' : 'Edit Milestone'} onClose={() => setModal(null)} onSave={saveForm}>
        <Field label="Date Label" hint="e.g. OCTOBER 28, 2025">
          <AdmInput value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} placeholder="MONTH DD, YYYY" />
        </Field>
        <Field label="Title">
          <AdmInput value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="Milestone title" />
        </Field>
        <Field label="Description">
          <AdmTextarea value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} rows={4} placeholder="Describe this milestone…" />
        </Field>
      </FormModal>

      <ConfirmModal
        open={!!confirm}
        title="Delete Milestone"
        message="This milestone will be permanently removed from the journey timeline."
        onConfirm={confirmDelete}
        onCancel={() => setConfirm(null)}
      />

      <style>{`
        .adm-journey-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex: 1; min-width: 0; }
        .adm-journey-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
        .adm-journey-date { font-size: 0.62rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: var(--adm-cyan); }
        .adm-journey-title { font-size: 1rem; font-weight: 800; color: #fff; }
        .adm-journey-desc { font-size: 0.82rem; color: rgba(255,255,255,0.4); line-height: 1.5; }
      `}</style>
    </SectionCard>
  );
}
