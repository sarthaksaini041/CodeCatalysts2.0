import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
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

    useEffect(() => {
        fetchProjectsData();
    }, []);

    const fetchProjectsData = async () => {
        setLoading(true);
        const { data: projectsData } = await supabase.from('projects').select('*').order('order_index', { ascending: true });
        const { data: titleData } = await supabase.from('site_content').select('*').eq('key', 'chapter4_title').maybeSingle();
        
        setProjects(projectsData || []);
        setChapterTitle(titleData?.content || 'THE FORGE');
        setLoading(false);
    };

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

    if (loading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

    return (
        <div className="space-y-12">
            <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-6">SECTION_SETTINGS</h3>
                <div className="flex gap-4 items-end">
                    <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-white/30 ml-2">Chapter Title</label>
                        <input value={chapterTitle} onChange={(e) => setChapterTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary transition-all text-white" />
                    </div>
                    <button onClick={handleSaveTitle} disabled={isSaving} className="px-6 py-3 bg-primary text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 transition-all">SAVE_TITLE</button>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex justify-between items-center px-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-white/40">PROJECT_REGISTRY</h3>
                    <button onClick={() => setEditingProject({ image_url: '' })} className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-white">
                        <Plus size={14} /> ADD_PROJECT
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((project, index) => (
                        <div key={project.id} className="group relative bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:bg-white/[0.04] transition-all">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex gap-2">
                                        {project.tech_stack?.slice(0, 3).map(tag => (
                                            <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[8px] font-black uppercase tracking-wider text-white/40">{tag}</span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditingProject(project)} className="p-2 bg-white/5 hover:bg-primary hover:text-black rounded-lg transition-all text-white/40"><Edit3 size={14} /></button>
                                        <button onClick={() => handleDelete(project.id)} className="p-2 bg-white/5 hover:bg-red-500 hover:text-white rounded-lg transition-all text-white/40"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <h4 className="text-lg font-black text-white mb-2">{project.name}</h4>
                                <p className="text-xs text-white/40 line-clamp-2 h-8">{project.description}</p>
                            </div>
                            <div className="px-6 py-3 bg-white/[0.03] border-t border-white/5 flex justify-between items-center">
                                <div className="flex gap-4">
                                    <button onClick={() => moveProject(index, -1)} className="p-1 hover:text-primary transition-colors text-white/20"><ArrowUp size={14} /></button>
                                    <button onClick={() => moveProject(index, 1)} className="p-1 hover:text-primary transition-colors text-white/20"><ArrowDown size={14} /></button>
                                </div>
                                <div className="flex gap-3 text-white/30">
                                    {project.github_link && <GitHubIcon size={14} />}
                                    {project.live_link && <ExternalLink size={14} />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {editingProject && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-[#050505]/80 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0a0a0a] border border-white/10 rounded-[32px] w-full max-w-3xl p-8 shadow-2xl maxHeight-[90vh] overflow-y-auto">
                            <form onSubmit={handleSaveProject} className="space-y-6 text-white">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-primary">EDIT_PROJECT_PROFILE</h3>
                                    <button type="button" onClick={() => setEditingProject(null)} className="text-white/20 hover:text-white"><X size={20} /></button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <ImageUpload 
                                            folder="projects" 
                                            currentImageUrl={editingProject.image_url} 
                                            onUpload={(url) => setEditingProject(prev => ({ ...prev, image_url: url }))}
                                            label="PROJECT_BANNER"
                                        />
                                        <div className="space-y-2 text-left">
                                            <label className="text-[10px] font-black uppercase tracking-wider text-white/30 ml-2">Project Name</label>
                                            <input name="name" defaultValue={editingProject.name} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-white" />
                                        </div>
                                        <div className="space-y-2 text-left">
                                            <label className="text-[10px] font-black uppercase tracking-wider text-white/30 ml-2">Description</label>
                                            <textarea name="description" defaultValue={editingProject.description} required rows={5} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-white" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2 text-left">
                                            <label className="text-[10px] font-black uppercase tracking-wider text-white/30 ml-2">Tech Stack (comma separated)</label>
                                            <input name="tech_stack" defaultValue={editingProject.tech_stack?.join(', ')} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-white" placeholder="React, Three.js, Tailwind" />
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="space-y-2 text-left">
                                                <label className="text-[10px] font-black uppercase tracking-wider text-white/30 ml-2">Live Demo URL</label>
                                                <input name="live_link" defaultValue={editingProject.live_link} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-white" placeholder="https://..." />
                                            </div>
                                            <div className="space-y-2 text-left">
                                                <label className="text-[10px] font-black uppercase tracking-wider text-white/30 ml-2">GitHub Repository URL</label>
                                                <input name="github_link" defaultValue={editingProject.github_link} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-white" placeholder="https://github.com/..." />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4 text-white">
                                    <button type="button" onClick={() => setEditingProject(null)} className="flex-1 py-4 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">CANCEL</button>
                                    <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-primary text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all font-bold">SAVE_PROJECT</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ForgeManager;
