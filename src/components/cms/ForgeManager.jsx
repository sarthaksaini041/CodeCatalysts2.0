import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../../lib/supabase-browser';
import { Plus, Trash2, ArrowUp, ArrowDown, ExternalLink, Edit3, X, Code2 } from 'lucide-react';
import { GitHubIcon } from '../icons/TechnicalIcons';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from './ImageUpload';

const ForgeManager = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProject, setEditingProject] = useState(null);
    const [chapterTitle, setChapterTitle] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const fetchProjectsData = async () => {
        setLoading(true);
        const { data: projectsData } = await supabase.from('projects').select('*').order('order_index', { ascending: true });
        const { data: titleData } = await supabase.from('site_content').select('*').eq('key', 'chapter4_title').maybeSingle();
        
        setProjects(projectsData || []);
        setChapterTitle(titleData?.content || 'THE FORGE');
        setLoading(false);
    };

    useEffect(() => {
        if (editingProject) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        };
    }, [editingProject]);

    useEffect(() => {
        fetchProjectsData();
    }, []);


    const handleSaveTitle = async () => {
        setIsSaving(true);
        await supabase.from('site_content').upsert({ key: 'chapter4_title', content: chapterTitle });
        setIsSaving(false);
    };

    const handleSaveProject = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.target);
        
        const techStackString = formData.get('tech_stack');
        const techStack = techStackString.split(',').map(s => s.trim()).filter(s => s !== '');

        const projectData = {
            name: formData.get('name'),
            description: formData.get('description'),
            image_url: editingProject.image_url,
            live_link: formData.get('live_link'),
            github_link: formData.get('github_link'),
            tech_stack: techStack,
            order_index: editingProject?.id ? editingProject.order_index : projects.length
        };

        if (editingProject?.id) {
            await supabase.from('projects').update(projectData).eq('id', editingProject.id);
        } else {
            await supabase.from('projects').insert(projectData);
        }

        setEditingProject(null);
        fetchProjectsData();
        setIsSaving(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this project?')) return;
        await supabase.from('projects').delete().eq('id', id);
        fetchProjectsData();
    };

    const moveProject = async (index, direction) => {
        const newProjects = [...projects];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= projects.length) return;
        [newProjects[index], newProjects[targetIndex]] = [newProjects[targetIndex], newProjects[index]];
        const updates = newProjects.map((p, idx) => ({ id: p.id, order_index: idx }));
        await supabase.from('projects').upsert(updates);
        fetchProjectsData();
    };

    if (loading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;

    return (
        <div className="space-y-10 pb-20 text-left">
            {/* Header / Title Editor */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-6">Section Settings</h3>
                <div className="flex gap-4 items-end">
                    <div className="flex-1 space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Chapter Title</label>
                        <input value={chapterTitle} onChange={(e) => setChapterTitle(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all text-slate-900" />
                    </div>
                    <button onClick={handleSaveTitle} disabled={isSaving} className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">Save Title</button>
                </div>
            </div>

            {/* Project Registry */}
            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-sm font-bold text-slate-400">Project Registry</h3>
                    <button onClick={() => setEditingProject({ image_url: '' })} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-all shadow-sm">
                        <Plus size={16} /> Add New Project
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((project, index) => (
                        <div key={project.id} className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-indigo-200 hover:shadow-md transition-all">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex flex-wrap gap-1.5">
                                        {project.tech_stack?.slice(0, 3).map(tag => (
                                            <span key={tag} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[9px] font-bold uppercase tracking-wider text-slate-500">{tag}</span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditingProject(project)} className="p-2 bg-slate-50 hover:bg-indigo-600 hover:text-white rounded-lg transition-all text-slate-400" title="Edit"><Edit3 size={14} /></button>
                                        <button onClick={() => handleDelete(project.id)} className="p-2 bg-slate-50 hover:bg-rose-600 hover:text-white rounded-lg transition-all text-slate-400" title="Delete"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 mb-2">{project.name}</h4>
                                <p className="text-sm text-slate-500 line-clamp-2 h-10">{project.description}</p>
                            </div>
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                                <div className="flex gap-3">
                                    <button onClick={() => moveProject(index, -1)} className="p-1.5 hover:bg-white rounded-md text-slate-400 hover:text-indigo-600 transition-all" title="Move Up"><ArrowUp size={14} /></button>
                                    <button onClick={() => moveProject(index, 1)} className="p-1.5 hover:bg-white rounded-md text-slate-400 hover:text-indigo-600 transition-all" title="Move Down"><ArrowDown size={14} /></button>
                                </div>
                                <div className="flex gap-3 text-slate-300">
                                    {project.github_link && <GitHubIcon size={16} className="hover:text-slate-900 transition-colors" />}
                                    {project.live_link && <ExternalLink size={16} className="hover:text-slate-900 transition-colors" />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modals */}
            {createPortal(
                <AnimatePresence>
                    {editingProject && (
                        <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-900/20 backdrop-blur-sm">
                            <div className="min-h-full flex items-center justify-center p-4 md:p-6">
                                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white border border-slate-200 rounded-[32px] w-full max-w-3xl p-8 shadow-2xl relative my-8 text-left">
                                <form onSubmit={handleSaveProject} className="space-y-6 text-slate-900 text-left">
                                    <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                                        <h3 className="text-lg font-bold text-slate-900">{editingProject?.id ? 'Edit Project' : 'Add New Project'}</h3>
                                        <button type="button" onClick={() => setEditingProject(null)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-2 rounded-xl transition-all"><X size={20} /></button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <ImageUpload 
                                                folder="projects" 
                                                currentImageUrl={editingProject.image_url} 
                                                onUpload={(url) => setEditingProject(prev => prev ? { ...prev, image_url: url } : prev)}
                                                label="Preview Image"
                                                aspect={16/9}
                                            />
                                            <div className="space-y-2 text-left">
                                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Project Name</label>
                                                <input name="name" defaultValue={editingProject.name} required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all text-slate-900" placeholder="e.g. CodeCatalysts 2.0" />
                                            </div>
                                            <div className="space-y-2 text-left">
                                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Description</label>
                                                <textarea name="description" defaultValue={editingProject.description} required rows={5} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all text-slate-900" placeholder="Summary of the project..." />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-2 text-left">
                                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Tech Stack (comma separated)</label>
                                                <input name="tech_stack" defaultValue={editingProject.tech_stack?.join(', ')} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all text-slate-900" placeholder="React, Three.js, Tailwind" />
                                            </div>
                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="space-y-2 text-left">
                                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Live Demo URL</label>
                                                    <input name="live_link" defaultValue={editingProject.live_link} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all text-slate-900" placeholder="https://..." />
                                                </div>
                                                <div className="space-y-2 text-left">
                                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">GitHub URL</label>
                                                    <input name="github_link" defaultValue={editingProject.github_link} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all text-slate-900" placeholder="https://github.com/..." />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pt-6 mt-4 border-t border-slate-100">
                                        <button type="button" onClick={() => setEditingProject(null)} className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                                        <button type="submit" disabled={isSaving} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                                            {editingProject?.id ? 'Save Changes' : 'Add Project'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export default ForgeManager;
