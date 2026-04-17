/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, ArrowUp, ArrowDown, Code2, ExternalLink } from 'lucide-react';
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
  triggerRevalidation,
} from '@/core/services/admin';

const ForgeEditor = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({});

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchTableData('projects');
      setProjects(data);
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openModal = (project = null) => {
    setFormData(
      project || {
        title: '',
        description: '',
        tech_stack: '',
        live_url: '',
        github_url: '',
        image_url: '',
        status: 'active',
      }
    );
    setEditingProject(project || {});
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        order_index: editingProject?.id ? editingProject.order_index : projects.length,
      };
      if (editingProject?.id) payload.id = editingProject.id;
      await saveTableItem('projects', payload);
      triggerRevalidation('/');
      setEditingProject(null);
      loadData();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    await deleteTableItem('projects', id);
    triggerRevalidation('/');
    loadData();
  };

  const moveProject = async (index, direction) => {
    const arr = [...projects];
    const target = index + direction;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    await reorderTableItems('projects', arr);
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
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Projects</h3>
          <p className="text-xs text-slate-400 mt-0.5">Manage the Forge project showcase</p>
        </div>
        <AdminButton variant="outline" size="sm" onClick={() => openModal()}>
          <Plus size={14} /> Add Project
        </AdminButton>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {projects.map((project, i) => (
          <div key={project.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm group hover:border-slate-300 transition-colors">
            {project.image_url && (
              <div className="p-6 pb-0 flex justify-center">
                <div className="aspect-square w-[75%] bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                  <img src={project.image_url} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{project.title}</p>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{project.description}</p>
                </div>
                {project.status && (
                  <span className={`flex-shrink-0 text-[11px] px-2 py-0.5 rounded font-medium ${project.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    {project.status}
                  </span>
                )}
              </div>
              {project.tech_stack && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {String(project.tech_stack || '').split(',').filter(Boolean).slice(0, 4).map((t, j) => (
                    <span key={j} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[11px] font-medium">{t.trim()}</span>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                <div className="flex gap-1.5">
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                      Live <ExternalLink size={10} />
                    </a>
                  )}
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 ml-2">
                      GitHub <ExternalLink size={10} />
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => moveProject(i, -1)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400"><ArrowUp size={14} /></button>
                  <button onClick={() => moveProject(i, 1)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400"><ArrowDown size={14} /></button>
                  <button onClick={() => openModal(project)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400"><Edit3 size={14} /></button>
                  <button onClick={() => handleDelete(project.id)} className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AdminModal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        title={editingProject?.id ? 'Edit Project' : 'Add Project'}
        maxWidth="max-w-2xl"
        footer={
          <>
            <AdminButton variant="outline" size="sm" onClick={() => setEditingProject(null)}>Cancel</AdminButton>
            <AdminButton size="sm" onClick={handleSave} loading={saving}>Save</AdminButton>
          </>
        }
      >
        <div className="space-y-4">
          <ImageUploader
            folder="projects"
            currentImageUrl={formData.image_url}
            onUpload={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
            label="Project Image"
            variant="square"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput label="Title" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            <AdminInput
              label="Status"
              type="select"
              value={formData.status || 'active'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={['active', 'completed', 'archived']}
            />
          </div>
          <AdminInput label="Description" type="textarea" rows={3} value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          <AdminInput label="Tech Stack" value={formData.tech_stack || ''} onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })} placeholder="React, Node.js, PostgreSQL" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput label="Live URL" value={formData.live_url || ''} onChange={(e) => setFormData({ ...formData, live_url: e.target.value })} placeholder="https://..." />
            <AdminInput label="GitHub URL" value={formData.github_url || ''} onChange={(e) => setFormData({ ...formData, github_url: e.target.value })} placeholder="https://github.com/..." />
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

export default ForgeEditor;
