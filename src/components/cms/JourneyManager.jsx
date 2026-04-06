import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

            {/* Journey Steps */}
            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-sm font-bold text-slate-400">Journey Steps</h3>
                    <button onClick={() => setEditingStep({ image_url: '', layout_type: 'image-left' })} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-all shadow-sm">
                        <Plus size={16} /> Add New Step
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {steps.map((step, index) => (
                        <div key={step.id} className="group flex items-center gap-6 bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-md rounded-2xl p-4 transition-all">
                            <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center text-indigo-600 border border-slate-100 overflow-hidden">
                                {step.image_url ? (
                                    <img src={step.image_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <Map size={24} />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{step.layout_type?.replace('-', ' ')}</p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => moveStep(index, -1)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all" title="Move Up"><ArrowUp size={16} /></button>
                                <button onClick={() => moveStep(index, 1)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all" title="Move Down"><ArrowDown size={16} /></button>
                                <button onClick={() => setEditingStep(step)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all" title="Edit"><Edit3 size={16} /></button>
                                <button onClick={() => handleDelete(step.id)} className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-all" title="Delete"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modals */}
            {createPortal(
                <AnimatePresence>
                    {editingStep && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/20 backdrop-blur-sm px-4">
                            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white border border-slate-200 rounded-[32px] w-full max-w-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                                <form onSubmit={handleSaveItem} className="space-y-6 text-slate-900">
                                    <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                                        <h3 className="text-lg font-bold text-slate-900">Edit Journey Step</h3>
                                        <button type="button" onClick={() => setEditingStep(null)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-2 rounded-xl transition-all"><X size={20} /></button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <ImageUpload 
                                                folder="journey" 
                                                currentImageUrl={editingStep.image_url} 
                                                onUpload={(url) => setEditingStep(prev => ({ ...prev, image_url: url }))}
                                                label="Step Image"
                                            />
                                            <div className="space-y-2 text-left">
                                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Title</label>
                                                <input name="title" defaultValue={editingStep.title} required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all text-slate-900" placeholder="e.g. Phase 1: Planning" />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-2 text-left">
                                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Description</label>
                                                <textarea name="description" defaultValue={editingStep.description} required rows={5} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all text-slate-900" placeholder="Describe this stage of the journey..." />
                                            </div>
                                            <div className="space-y-2 text-left">
                                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Layout Type</label>
                                                <select name="layout_type" defaultValue={editingStep.layout_type || 'image-left'} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-indigo-500 transition-all text-slate-700 appearance-none shadow-sm">
                                                    <option value="image-left">Image Left</option>
                                                    <option value="image-right">Image Right</option>
                                                    <option value="full-width">Full Width</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pt-6 mt-4 border-t border-slate-100">
                                        <button type="button" onClick={() => setEditingStep(null)} className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                                        <button type="submit" disabled={isSaving} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Save Step</button>
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
