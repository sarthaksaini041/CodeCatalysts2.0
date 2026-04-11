import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../../lib/supabase-browser';
import { Plus, Trash2, ArrowUp, ArrowDown, Save, Edit3, X, Map, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from './ImageUpload';

const JourneyManager = () => {
    const [steps, setSteps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingStep, setEditingStep] = useState(null);
    const [chapterTitle, setChapterTitle] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const fetchJourneyData = async () => {
        setLoading(true);
        const { data: stepsData } = await supabase.from('chapter3_steps').select('*').order('order_index', { ascending: true });
        const { data: titleData } = await supabase.from('site_content').select('*').eq('key', 'chapter3_title').maybeSingle();
        
        setSteps(stepsData || []);
        setChapterTitle(titleData?.content || 'THE JOURNEY');
        setLoading(false);
    };

    useEffect(() => {
        if (editingStep) {
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
    }, [editingStep]);

    useEffect(() => {
        fetchJourneyData();
    }, []);


    const handleSaveTitle = async () => {
        setIsSaving(true);
        await supabase.from('site_content').upsert({ key: 'chapter3_title', content: chapterTitle });
        setIsSaving(false);
    };

    const handleSaveItem = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.target);
        const stepData = {
            title: formData.get('title'),
            description: formData.get('description'),
            image_url: editingStep.image_url,
            layout_type: formData.get('layout_type'),
            order_index: editingStep?.id ? editingStep.order_index : steps.length
        };

        if (editingStep?.id) {
            await supabase.from('chapter3_steps').update(stepData).eq('id', editingStep.id);
        } else {
            await supabase.from('chapter3_steps').insert(stepData);
        }

        setEditingStep(null);
        fetchJourneyData();
        setIsSaving(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this journey step?')) return;
        await supabase.from('chapter3_steps').delete().eq('id', id);
        fetchJourneyData();
    };

    const moveStep = async (index, direction) => {
        const newSteps = [...steps];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= steps.length) return;
        [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
        const updates = newSteps.map((s, idx) => ({ id: s.id, order_index: idx }));
        await supabase.from('chapter3_steps').upsert(updates);
        fetchJourneyData();
    };

    if (loading) return <div className="flex justify-center p-20"><Map className="animate-spin text-indigo-500" size={32} /></div>;

    return (
        <div className="space-y-12 pb-20 text-left">
            {/* Header / Title Editor */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full group-hover:bg-indigo-500/10 transition-colors" />
                
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                        <Sparkles size={16} />
                    </div>
                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Temporal Mapping</h3>
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

            {/* Journey Steps */}
            <div className="space-y-6">
                <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Step Deployment Registry</h3>
                    </div>
                    <button 
                        onClick={() => setEditingStep({ image_url: '', layout_type: 'image-left' })} 
                        className="flex items-center gap-2 px-6 py-3 bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-xl active:scale-95 group"
                    >
                        <Plus size={16} className="text-indigo-400 group-hover:rotate-90 transition-transform" /> Add Step Unit
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {steps.map((step, index) => (
                        <div key={step.id} className="group flex items-center gap-6 bg-white/[0.02] backdrop-blur-md border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.05] rounded-[32px] p-6 transition-all duration-500 shadow-xl relative overflow-hidden">
                             <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full group-hover:bg-indigo-500/10 transition-colors" />
                             
                            <div className="w-20 h-20 rounded-2xl bg-black/40 flex items-center justify-center text-indigo-400 border border-white/5 overflow-hidden relative z-10 group-hover:scale-105 transition-transform duration-500">
                                {step.image_url ? (
                                    <img src={step.image_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <Map size={28} className="opacity-20" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0 relative z-10">
                                <h4 className="text-[13px] font-black text-white uppercase tracking-widest mb-1 group-hover:text-indigo-400 transition-colors">{step.title}</h4>
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[8px] font-black text-indigo-400 uppercase tracking-widest">
                                        {step.layout_type?.replace('-', ' ')}
                                    </span>
                                    <p className="text-[11px] font-bold text-white/20 tracking-tight line-clamp-1">{step.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500 relative z-10">
                                <div className="flex bg-black/40 backdrop-blur-xl rounded-2xl p-1.5 border border-white/5 shadow-2xl">
                                    <button onClick={() => moveStep(index, -1)} className="p-2.5 hover:bg-white/10 rounded-xl text-white/40 hover:text-indigo-400 transition-all" title="Sequence Up"><ArrowUp size={16} /></button>
                                    <button onClick={() => moveStep(index, 1)} className="p-2.5 hover:bg-white/10 rounded-xl text-white/40 hover:text-indigo-400 transition-all" title="Sequence Down"><ArrowDown size={16} /></button>
                                    <div className="w-px h-8 bg-white/5 self-center mx-1" />
                                    <button onClick={() => setEditingStep(step)} className="p-2.5 hover:bg-white/10 rounded-xl text-white/40 hover:text-indigo-400 transition-all" title="Modify"><Edit3 size={16} /></button>
                                    <button onClick={() => handleDelete(step.id)} className="p-2.5 hover:bg-rose-500/10 rounded-xl text-white/40 hover:text-rose-400 transition-all" title="Purge"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modals via Portals */}
            {createPortal(
                <AnimatePresence>
                    {editingStep && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 overflow-hidden">
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setEditingStep(null)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
                            />

                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 30 }} 
                                animate={{ opacity: 1, scale: 1, y: 0 }} 
                                exit={{ opacity: 0, scale: 0.95, y: 30 }} 
                                className="relative bg-black/40 border border-white/5 rounded-[40px] w-full max-w-4xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                            >
                                <form onSubmit={handleSaveItem} className="text-white">
                                    <div className="p-10 flex justify-between items-center border-b border-white/5 bg-white/[0.02]">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                                <Map size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black uppercase tracking-widest">{editingStep?.id ? 'Modify Sequence' : 'Initialize Step'}</h3>
                                                <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mt-1">Journey Protocol Content</p>
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => setEditingStep(null)} className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all flex items-center justify-center border border-white/5 group">
                                            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                                        </button>
                                    </div>

                                    <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-8">
                                            <ImageUpload 
                                                folder="journey" 
                                                currentImageUrl={editingStep.image_url} 
                                                onUpload={(url) => setEditingStep(prev => prev ? { ...prev, image_url: url } : prev)}
                                                label="Contextual Interface Visual"
                                                aspect={16/9}
                                            />
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Step identity</label>
                                                <input 
                                                    name="title" 
                                                    defaultValue={editingStep.title} 
                                                    required 
                                                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-[13px] font-black uppercase tracking-widest focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/10" 
                                                    placeholder="e.g. PHASE_01_REBIRTH..." 
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-6 flex flex-col">
                                            <div className="space-y-3 flex-1">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Narrative Core</label>
                                                <textarea 
                                                    name="description" 
                                                    defaultValue={editingStep.description} 
                                                    required 
                                                    className="w-full h-[180px] bg-black/40 border border-white/5 rounded-2xl px-6 py-5 text-[14px] font-bold tracking-tight focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white/60 placeholder:text-white/10 resize-none leading-relaxed" 
                                                    placeholder="Input step mission data..." 
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Visual Alignment</label>
                                                <div className="relative">
                                                    <select 
                                                        name="layout_type" 
                                                        defaultValue={editingStep.layout_type || 'image-left'} 
                                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-[12px] font-black uppercase tracking-widest focus:outline-none focus:border-indigo-500/50 transition-all text-white/80 appearance-none cursor-pointer"
                                                    >
                                                        <option value="image-left">Image Primary Left</option>
                                                        <option value="image-right">Image Primary Right</option>
                                                        <option value="full-width">Atmospheric Full Width</option>
                                                    </select>
                                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                                                        <ArrowDown size={14} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-10 bg-white/[0.02] border-t border-white/5 flex gap-6">
                                        <button type="button" onClick={() => setEditingStep(null)} className="flex-1 py-4.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white/40 transition-all active:scale-95">Abort Mission</button>
                                        <button 
                                            type="submit" 
                                            disabled={isSaving} 
                                            className="flex-[2] py-4.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:bg-indigo-500 hover:shadow-[0_0_60px_rgba(79,70,229,0.5)] transition-all active:scale-95 disabled:opacity-50 transform hover:-translate-y-1"
                                        >
                                            {isSaving ? 'Compiling...' : (editingStep?.id ? 'COMMIT CHANGES' : 'DEPLOY STEP')}
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

export default JourneyManager;
