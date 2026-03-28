import React, { useState, useEffect } from 'react';
import { X, Check, AlertTriangle, Trash2, GripVertical, Plus, Edit2, ChevronDown, ChevronUp } from 'lucide-react';

/* ── Toast Notification ───────────────────────────────────────── */
export function Toast({ toasts, removeToast }) {
  return (
    <div className="adm-toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`adm-toast adm-toast--${t.type}`}>
          {t.type === 'success' ? <Check size={15} /> : <AlertTriangle size={15} />}
          <span>{t.message}</span>
          <button className="adm-toast-close" onClick={() => removeToast(t.id)}><X size={13} /></button>
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));
  return { toasts, addToast, removeToast };
}

/* ── Confirm Delete Modal ─────────────────────────────────────── */
export function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onCancel]);
  if (!open) return null;
  return (
    <div className="adm-overlay" onClick={onCancel}>
      <div className="adm-confirm-modal" onClick={e => e.stopPropagation()}>
        <div className="adm-confirm-icon"><Trash2 size={24} /></div>
        <h3 className="adm-confirm-title">{title || 'Delete Item'}</h3>
        <p className="adm-confirm-msg">{message || 'This action cannot be undone.'}</p>
        <div className="adm-confirm-actions">
          <button className="adm-btn adm-btn--ghost" onClick={onCancel}>Cancel</button>
          <button className="adm-btn adm-btn--danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ── Generic Form Modal ───────────────────────────────────────── */
export function FormModal({ open, title, onClose, onSave, children }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="adm-overlay" onClick={onClose}>
      <div className="adm-form-modal" onClick={e => e.stopPropagation()}>
        <div className="adm-form-modal-header">
          <h2 className="adm-form-modal-title">{title}</h2>
          <button className="adm-modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="adm-form-modal-body">{children}</div>
        <div className="adm-form-modal-footer">
          <button className="adm-btn adm-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="adm-btn adm-btn--primary" onClick={onSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

/* ── Field Components ─────────────────────────────────────────── */
export function Field({ label, children, hint }) {
  return (
    <div className="adm-field">
      <label className="adm-field-label">{label}</label>
      {children}
      {hint && <span className="adm-field-hint">{hint}</span>}
    </div>
  );
}

export function AdmInput({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      className="adm-input"
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

export function AdmTextarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      className="adm-input adm-textarea"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
    />
  );
}

/* ── Tag Input (tech stack chips) ─────────────────────────────── */
export function TagInput({ tags, onChange, placeholder = 'Type skill, press Enter…' }) {
  const [input, setInput] = useState('');
  const add = () => {
    const v = input.trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setInput('');
  };
  const remove = (t) => onChange(tags.filter(x => x !== t));
  return (
    <div className="adm-tag-input-wrap">
      {tags.map(t => (
        <span key={t} className="adm-tag-chip">
          {t}
          <button type="button" onClick={() => remove(t)} className="adm-tag-remove"><X size={10} /></button>
        </span>
      ))}
      <input
        className="adm-tag-bare-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }}
        placeholder={tags.length === 0 ? placeholder : 'Add more…'}
      />
    </div>
  );
}

/* ── Drag-sortable List ───────────────────────────────────────── */
export function DragList({ items, onReorder, renderItem, keyFn }) {
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);

  const onDragStart = (i) => setDragIdx(i);
  const onDragOver = (e, i) => { e.preventDefault(); setOverIdx(i); };
  const onDrop = (i) => {
    if (dragIdx === null || dragIdx === i) { setDragIdx(null); setOverIdx(null); return; }
    const reordered = [...items];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(i, 0, moved);
    onReorder(reordered);
    setDragIdx(null); setOverIdx(null);
  };

  return (
    <div className="adm-drag-list">
      {items.map((item, i) => (
        <div
          key={keyFn(item)}
          className={`adm-drag-item ${overIdx === i ? 'adm-drag-item--over' : ''} ${dragIdx === i ? 'adm-drag-item--dragging' : ''}`}
          draggable
          onDragStart={() => onDragStart(i)}
          onDragOver={e => onDragOver(e, i)}
          onDrop={() => onDrop(i)}
          onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
        >
          <div className="adm-drag-handle"><GripVertical size={16} /></div>
          {renderItem(item, i)}
        </div>
      ))}
    </div>
  );
}

/* ── Section Card wrapper ─────────────────────────────────────── */
export function SectionCard({ title, subtitle, action, children }) {
  return (
    <div className="adm-section-card">
      <div className="adm-section-card-header">
        <div>
          <h2 className="adm-section-title">{title}</h2>
          {subtitle && <p className="adm-section-subtitle">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="adm-section-card-body">{children}</div>
    </div>
  );
}

/* ── Collapsible Accordion ────────────────────────────────────── */
export function Accordion({ title, accent = 'var(--adm-cyan)', badge, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="adm-accordion" style={{ '--acc-accent': accent }}>
      <button className="adm-accordion-header" onClick={() => setOpen(o => !o)}>
        <span className="adm-accordion-title">{title}</span>
        {badge && <span className="adm-accordion-badge">{badge}</span>}
        <span className="adm-accordion-chevron">{open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
      </button>
      {open && <div className="adm-accordion-body">{children}</div>}
    </div>
  );
}

/* ── Small utility button ─────────────────────────────────────── */
export function IconBtn({ icon: Icon, onClick, title, danger = false, size = 15 }) {
  return (
    <button
      className={`adm-icon-btn ${danger ? 'adm-icon-btn--danger' : ''}`}
      onClick={onClick}
      title={title}
      type="button"
    >
      <Icon size={size} />
    </button>
  );
}

export function AddButton({ label, onClick }) {
  return (
    <button className="adm-btn adm-btn--primary" onClick={onClick} type="button">
      <Plus size={15} /> {label}
    </button>
  );
}

/* ── Select Input ─────────────────────────────────────────────── */
export function AdmSelect({ value, onChange, options }) {
  return (
    <select className="adm-input adm-select" value={value} onChange={e => onChange(e.target.value)}>
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

/* ── Toggle / Checkbox ────────────────────────────────────────── */
export function Toggle({ checked, onChange, label }) {
  return (
    <label className="adm-toggle-wrap">
      <div className={`adm-toggle ${checked ? 'adm-toggle--on' : ''}`} onClick={() => onChange(!checked)}>
        <div className="adm-toggle-thumb" />
      </div>
      {label && <span className="adm-toggle-label">{label}</span>}
    </label>
  );
}
