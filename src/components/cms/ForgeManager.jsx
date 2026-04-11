import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../../lib/supabase-browser';
import { Plus, Trash2, ArrowUp, ArrowDown, ExternalLink, Edit3, X, Code2, Sparkles } from 'lucide-react';
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

    if (loading) return <div className="flex justify-center p-20"><Code2 className="animate-spin text-indigo-500" size={32} /></div>;

    return (
        <div className="space-y-12 pb-20 text-left text-white">
            {/* Header / Title Editor */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full group-hover:bg-indigo-500/10 transition-colors" />
                
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                        <Sparkles size={16} />
                    </div>
                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Production Sector</h3>
                </div>

                <div className="flex gap-4 items-end relative z-10">
                    <div className="flex-1 space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Chapter Identity</label>
                        <input 
                            value={chapterTitle} 
                            onChange={(e) => setChapterTitle(e.target.value)} 
                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-3 text-[13px] font-black uppercase tracking-widest focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/10 shadow-inner" 
                        />
                    </div>
                    <button 
                        onClick={handleSaveTitle} 
                        disabled={isSaving} 
                        className="px-8 py-3.5 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? 'Synching...' : 'Update Title'}
                    </button>
                </div>
            </div>

            {/* Project Registry */}
            <div className="space-y-6">
                <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Project Repository</h3>
                    </div>
                    <button 
                        onClick={() => setEditingProject({ image_url: '' })} 
                        className="flex items-center gap-2 px-6 py-3 bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-xl active:scale-95 group"
                    >
                        <Plus size={16} className="text-indigo-400 group-hover:rotate-90 transition-transform" /> Deploy Project
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((project, index) => (
                        <div key={project.id} className="group relative bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-[32px] overflow-hidden hover:border-indigo-500/30 hover:bg-white/[0.05] transition-all duration-500 shadow-xl flex flex-col">
                            <div className="p-8 flex-1">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex flex-wrap gap-2">
                                        {project.tech_stack?.slice(0, 3).map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest text-indigo-400">{tag}</span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditingProject(project)} className="p-2.5 bg-white/5 hover:bg-indigo-600 rounded-xl transition-all text-white/40 hover:text-white border border-white/5" title="Modify"><Edit3 size={14} /></button>
                                        <button onClick={() => handleDelete(project.id)} className="p-2.5 bg-white/5 hover:bg-rose-600 rounded-xl transition-all text-white/40 hover:text-white border border-white/5" title="Purge"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <h4 className="text-[18px] font-black text-white uppercase tracking-widest mb-3 group-hover:text-indigo-400 transition-colors">{project.name}</h4>
                                <p className="text-[13px] font-bold text-white/20 tracking-tight line-clamp-2 leading-relaxed">{project.description}</p>
                            </div>
                            <div className="px-8 py-5 bg-black/40 border-t border-white/5 flex justify-between items-center mt-auto">
                                <div className="flex gap-3">
                                    <button onClick={() => moveProject(index, -1)} className="p-2 hover:bg-white/10 rounded-xl text-white/20 hover:text-indigo-400 transition-all border border-transparent hover:border-white/5" title="Sequence Up"><ArrowUp size={14} /></button>
                                    <button onClick={() => moveProject(index, 1)} className="p-2 hover:bg-white/10 rounded-xl text-white/20 hover:text-indigo-400 transition-all border border-transparent hover:border-white/5" title="Sequence Down"><ArrowDown size={14} /></button>
                                </div>
                                <div className="flex gap-4 items-center">
                                    {project.github_link && <GitHubIcon size={18} className="text-white/20 hover:text-white transition-all transform hover:scale-110" />}
                                    {project.live_link && <ExternalLink size={18} className="text-white/20 hover:text-white transition-all transform hover:scale-110" />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modals via Portals */}
            {createPortal(
                <AnimatePresence>
                    {editingProject && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 overflow-hidden">
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setEditingProject(null)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
                            />

                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 30 }} 
                                animate={{ opacity: 1, scale: 1, y: 0 }} 
                                exit={{ opacity: 0, scale: 0.95, y: 30 }} 
                                className="relative bg-black/40 border border-white/5 rounded-[40px] w-full max-w-4xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                            >
                                <form onSubmit={handleSaveProject} className="text-white">
                                    <div className="p-10 flex justify-between items-center border-b border-white/5 bg-white/[0.02]">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                                <Code2 size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black uppercase tracking-widest">{editingProject?.id ? 'Adjust Project' : 'Initialize Build'}</h3>
                                                <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mt-1">Project Deployment Matrix</p>
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => setEditingProject(null)} className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all flex items-center justify-center border border-white/5 group">
                                            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                                        </button>
                                    </div>

                                    <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-8">
                                            <ImageUpload 
                                                folder="projects" 
                                                currentImageUrl={editingProject.image_url} 
                                                onUpload={(url) => setEditingProject(prev => prev ? { ...prev, image_url: url } : prev)}
                                                label="Contextual Preview Visual"
                                                aspect={16/9}
                                            />
                                            <div className="space-y-2 text-left">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Project Identity</label>
                                                <input name="name" defaultValue={editingProject.name} required className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-[13px] font-black uppercase tracking-widest focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/10" placeholder="e.g. CORE_SYSTEM_2.0..." />
                                            </div>
                                            <div className="space-y-2 text-left">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Mission Details</label>
                                                <textarea name="description" defaultValue={editingProject.description} required rows={4} className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-[13px] font-bold tracking-tight focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white/60 placeholder:text-white/10 resize-none leading-relaxed" placeholder="Summarize project objectives..." />
                                            </div>
                                        </div>
                                        <div className="space-y-8">
                                            <div className="space-y-2 text-left">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Technological Stack (JSON_ARRAY)</label>
                                                <input name="tech_stack" defaultValue={editingProject.tech_stack?.join(', ')} className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-[13px] font-black uppercase tracking-widest focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/10" placeholder="REACT, MOTIONS, SHADERS" />
                                            </div>
                                            <div className="space-y-6">
                                                <div className="space-y-2 text-left">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Live Transmission Link</label>
                                                    <div className="relative">
                                                        <input name="live_link" defaultValue={editingProject.live_link} className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 pl-12 text-[13px] font-bold tracking-widest focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white/60 placeholder:text-white/10" placeholder="https://..." />
                                                        <ExternalLink size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2 text-left">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Source Repository Link</label>
                                                    <div className="relative">
                                                        <input name="github_link" defaultValue={editingProject.github_link} className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 pl-12 text-[13px] font-bold tracking-widest focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white/60 placeholder:text-white/10" placeholder="https://github.com/..." />
                                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                                                            <GitHubIcon size={16} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-10 bg-white/[0.02] border-t border-white/5 flex gap-6 mt-4">
                                        <button type="button" onClick={() => setEditingProject(null)} className="flex-1 py-4.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white/40 transition-all active:scale-95">Abstain</button>
                                        <button type="submit" disabled={isSaving} className="flex-[2] py-4.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:bg-indigo-500 hover:shadow-[0_0_60px_rgba(79,70,229,0.5)] transition-all active:scale-95 disabled:opacity-50 transform hover:-translate-y-1">
                                            {isSaving ? 'Compiling...' : (editingProject?.id ? 'COMMIT BUILD' : 'DEPLOY BUILD')}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export default ForgeManager;
