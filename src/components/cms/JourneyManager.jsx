import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { Plus, Trash2, ArrowUp, ArrowDown, Save, Edit3, X, Map } from 'lucide-react';
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
                    <h3 className="text-xs font-black uppercase tracking-widest text-white/40">CHRONICLE_STEPS</h3>
                    <button onClick={() => setEditingStep({ image_url: '', layout_type: 'image-left' })} className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-white">
                        <Plus size={14} /> ADD_STEP
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {steps.map((step, index) => (
                        <div key={step.id} className="group flex items-center gap-6 bg-white/[0.02] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.04] transition-all">
                            <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center text-primary border border-white/5 overflow-hidden">
                                {step.image_url ? (
                                    <img src={step.image_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <Map size={24} />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-black text-white">{step.title}</h4>
                                <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">{step.layout_type?.replace('-', ' ')}</p>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => moveStep(index, -1)} className="p-2 hover:text-primary transition-colors text-white/20"><ArrowUp size={16} /></button>
                                <button onClick={() => moveStep(index, 1)} className="p-2 hover:text-primary transition-colors text-white/20"><ArrowDown size={16} /></button>
                                <button onClick={() => setEditingStep(step)} className="p-2 hover:text-primary transition-colors text-white/20"><Edit3 size={16} /></button>
                                <button onClick={() => handleDelete(step.id)} className="p-2 hover:text-red-500 transition-colors text-white/20"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {editingStep && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-[#050505]/80 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0a0a0a] border border-white/10 rounded-[32px] w-full max-w-3xl p-8 shadow-2xl maxHeight-[90vh] overflow-y-auto">
                            <form onSubmit={handleSaveItem} className="space-y-6 text-white">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-primary">EDIT_JOURNEY_STEP</h3>
                                    <button type="button" onClick={() => setEditingStep(null)} className="text-white/20 hover:text-white"><X size={20} /></button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <ImageUpload 
                                            folder="journey" 
                                            currentImageUrl={editingStep.image_url} 
                                            onUpload={(url) => setEditingStep(prev => ({ ...prev, image_url: url }))}
                                            label="STEP_VISUAL"
                                        />
                                        <div className="space-y-2 text-left">
                                            <label className="text-[10px] font-black uppercase tracking-wider text-white/30 ml-2">Title</label>
                                            <input name="title" defaultValue={editingStep.title} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-white" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2 text-left">
                                            <label className="text-[10px] font-black uppercase tracking-wider text-white/30 ml-2">Description</label>
                                            <textarea name="description" defaultValue={editingStep.description} required rows={5} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-white" />
                                        </div>
                                        <div className="space-y-2 text-left">
                                            <label className="text-[10px] font-black uppercase tracking-wider text-white/30 ml-2">Layout Type</label>
                                            <select name="layout_type" defaultValue={editingStep.layout_type || 'image-left'} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-white appearance-none">
                                                <option value="image-left" className="bg-[#0a0a0a]">Image Left</option>
                                                <option value="image-right" className="bg-[#0a0a0a]">Image Right</option>
                                                <option value="full-width" className="bg-[#0a0a0a]">Full Width</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4 text-white">
                                    <button type="button" onClick={() => setEditingStep(null)} className="flex-1 py-4 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">CANCEL</button>
                                    <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-primary text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all font-bold">SAVE_STEP</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default JourneyManager;
