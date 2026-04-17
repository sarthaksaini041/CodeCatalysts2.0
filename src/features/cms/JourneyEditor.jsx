/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, ArrowUp, ArrowDown, Map } from 'lucide-react';
import AdminCard from '@/features/admin/shared/AdminCard';
import AdminInput from '@/features/admin/shared/AdminInput';
import AdminButton from '@/features/admin/shared/AdminButton';
import AdminModal from '@/features/admin/shared/AdminModal';
import ImageUploader from './ImageUploader';
import {
  fetchTableData,
  saveTableItem,
  deleteTableItem,
  reorderTableItems,
  fetchSiteContent,
  saveSiteContent,
  triggerRevalidation,
} from '@/core/services/admin';

const JourneyEditor = () => {
  const [steps, setSteps] = useState([]);
  const [chapterTitle, setChapterTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [formData, setFormData] = useState({});

  const loadData = async () => {
    setLoading(true);
    try {
      const [stepsData, titleData] = await Promise.all([
        fetchTableData('chapter3_steps'),
        fetchSiteContent(['chapter3_title']),
      ]);
      setSteps(stepsData);
      setChapterTitle(titleData.chapter3_title || 'THE JOURNEY');
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSaveTitle = async () => {
    setSaving(true);
    await saveSiteContent({ chapter3_title: chapterTitle });
    triggerRevalidation('/');
    setSaving(false);
  };

  const openModal = (step = null) => {
    setFormData(step || { title: '', description: '', image_url: '', layout_type: 'image-left' });
    setEditingStep(step || {});
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        order_index: editingStep?.id ? editingStep.order_index : steps.length,
      };
      if (editingStep?.id) payload.id = editingStep.id;
      await saveTableItem('chapter3_steps', payload);
      triggerRevalidation('/');
      setEditingStep(null);
      loadData();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this step?')) return;
    await deleteTableItem('chapter3_steps', id);
    triggerRevalidation('/');
    loadData();
  };

  const moveStep = async (index, direction) => {
    const arr = [...steps];
    const target = index + direction;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    await reorderTableItems('chapter3_steps', arr);
    triggerRevalidation('/');
    loadData();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Title */}
      <AdminCard title="Section Title">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <AdminInput label="Chapter Title" value={chapterTitle} onChange={(e) => setChapterTitle(e.target.value)} />
          </div>
          <AdminButton onClick={handleSaveTitle} loading={saving} size="md">Update</AdminButton>
        </div>
      </AdminCard>

      {/* Steps */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Journey Steps</h3>
          <AdminButton variant="outline" size="sm" onClick={() => openModal()}>
            <Plus size={14} /> Add Step
          </AdminButton>
        </div>

        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-4 bg-white border border-slate-200 rounded-lg p-4 shadow-sm group hover:border-slate-300 transition-colors">
              <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-200">
                {step.image_url ? (
                  <img src={step.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Map size={20} className="text-slate-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{step.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-medium">
                    {step.layout_type?.replace('-', ' ')}
                  </span>
                  <p className="text-xs text-slate-400 truncate">{step.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => moveStep(i, -1)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400"><ArrowUp size={14} /></button>
                <button onClick={() => moveStep(i, 1)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400"><ArrowDown size={14} /></button>
                <button onClick={() => openModal(step)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400"><Edit3 size={14} /></button>
                <button onClick={() => handleDelete(step.id)} className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AdminModal
        isOpen={!!editingStep}
        onClose={() => setEditingStep(null)}
        title={editingStep?.id ? 'Edit Step' : 'Add Step'}
        maxWidth="max-w-2xl"
        footer={
          <>
            <AdminButton variant="outline" size="sm" onClick={() => setEditingStep(null)}>Cancel</AdminButton>
            <AdminButton size="sm" onClick={handleSave} loading={saving}>Save</AdminButton>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <ImageUploader
              folder="journey"
              currentImageUrl={formData.image_url}
              onUpload={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
              label="Step Image"
              variant="wide"
            />
            <AdminInput label="Title" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div className="space-y-4">
            <AdminInput
              label="Description"
              type="textarea"
              rows={5}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            <AdminInput
              label="Image Alignment"
              type="select"
              value={formData.layout_type || 'image-left'}
              onChange={(e) => setFormData({ ...formData, layout_type: e.target.value })}
              options={[
                { value: 'image-left', label: 'Left' },
                { value: 'image-right', label: 'Right' },
                { value: 'full-width', label: 'Full Width' },
              ]}
            />
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

export default JourneyEditor;
