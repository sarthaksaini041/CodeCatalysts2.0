import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../../lib/supabase-browser';
import { Plus, Trash2, ArrowUp, ArrowDown, Save, Edit3, X, History, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from './ImageUpload';
import { triggerRevalidation } from '../../utils/revalidate';

const GenesisManager = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);
    const [chapterTitle, setChapterTitle] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const fetchGenesisData = async () => {
        setLoading(true);
        const { data: itemsData } = await supabase.from('chapter1_items').select('*').order('order_index', { ascending: true });
        const { data: titleData } = await supabase.from('site_content').select('*').eq('key', 'chapter1_title').maybeSingle();
        
        setItems(itemsData || []);
        setChapterTitle(titleData?.content || 'THE GENESIS');
        setLoading(false);
    };

    useEffect(() => {
        if (editingItem) {
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
    }, [editingItem]);

    useEffect(() => {
        fetchGenesisData();
    }, []);


    const handleSaveTitle = async () => {
        setIsSaving(true);
        await supabase.from('site_content').upsert({ key: 'chapter1_title', content: chapterTitle });
        setIsSaving(false);
        // Trigger instant site refresh (Home page)
        triggerRevalidation('/');
    };

    const handleSaveItem = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.target);
        const itemData = {
            title: formData.get('title'),
            description: formData.get('description'),
            image_url: editingItem.image_url,
            order_index: editingItem?.id ? editingItem.order_index : items.length
        };

        if (editingItem?.id) {
            await supabase.from('chapter1_items').update(itemData).eq('id', editingItem.id);
        } else {
            await supabase.from('chapter1_items').insert(itemData);
        }

        setEditingItem(null);
        fetchGenesisData();
        setIsSaving(false);
        // Trigger instant site refresh (Home page)
        triggerRevalidation('/');
    };

    const handleDeleteItem = async (id) => {
        if (!window.confirm('Delete this story point?')) return;
        await supabase.from('chapter1_items').delete().eq('id', id);
        fetchGenesisData();
        // Trigger instant site refresh (Home page)
        triggerRevalidation('/');
    };

    const moveItem = async (index, direction) => {
        const newItems = [...items];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= items.length) return;

        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

        const updates = newItems.map((item, idx) => ({ id: item.id, order_index: idx }));
        await supabase.from('chapter1_items').upsert(updates);
        fetchGenesisData();
        // Trigger instant site refresh (Home page)
        triggerRevalidation('/');
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-500" size={32} /></div>;

    return (
        <div className="space-y-10 pb-20 text-left">
            {/* Header / Title Editor */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full group-hover:bg-indigo-500/10 transition-colors" />
                
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                        <Sparkles size={16} />
                    </div>
                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Section Configuration</h3>
                </div>

                <div className="flex gap-4 items-end relative z-10">
                    <div className="flex-1 space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Chapter Identity</label>
                        <input 
                            value={chapterTitle} 
                            onChange={(e) => setChapterTitle(e.target.value)} 
                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-3 text-[13px] font-black uppercase tracking-widest focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/10 shadow-inner" 
                            placeholder="e.g. THE GENESIS"
                        />
                    </div>
                    <button 
                        onClick={handleSaveTitle} 
                        disabled={isSaving} 
                        className="px-8 py-3.5 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? 'Syncing...' : 'Update Title'}
                    </button>
                </div>
            </div>

            {/* Content List */}
            <div className="space-y-6">
                <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Narrative Registry</h3>
                    </div>
                    <button 
                        onClick={() => setEditingItem({ image_url: '' })} 
                        className="flex items-center gap-2 px-6 py-3 bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-xl active:scale-95 group"
                    >
                        <Plus size={16} className="text-indigo-400 group-hover:rotate-90 transition-transform" /> Add Point
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {items.map((item, index) => (
                        <div key={item.id} className="group flex items-center gap-6 bg-white/[0.02] backdrop-blur-md border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.05] rounded-[32px] p-6 transition-all duration-500 shadow-xl relative overflow-hidden">
                            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full group-hover:bg-indigo-500/10 transition-colors" />
                            
                            <div className="w-24 h-18 rounded-2xl bg-black/40 overflow-hidden flex-shrink-0 border border-white/5 relative z-10 group-hover:scale-105 transition-transform duration-500">
                                {item.image_url ? (
                                    <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/10">
                                        <History size={24} />
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex-1 min-w-0 relative z-10">
                                <h4 className="text-[13px] font-black text-white uppercase tracking-widest mb-1 group-hover:text-indigo-400 transition-colors truncate">{item.title}</h4>
                                <p className="text-[11px] font-bold text-white/30 line-clamp-1 tracking-tight">{item.description}</p>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500 relative z-10">
                                <div className="flex bg-black/40 backdrop-blur-xl rounded-2xl p-1.5 border border-white/5 shadow-2xl">
                                    <button onClick={() => moveItem(index, -1)} className="p-2.5 hover:bg-white/10 rounded-xl text-white/40 hover:text-indigo-400 transition-all" title="Shift Up"><ArrowUp size={16} /></button>
                                    <button onClick={() => moveItem(index, 1)} className="p-2.5 hover:bg-white/10 rounded-xl text-white/40 hover:text-indigo-400 transition-all" title="Shift Down"><ArrowDown size={16} /></button>
                                    <div className="w-px h-8 bg-white/5 self-center mx-1" />
                                    <button onClick={() => setEditingItem(item)} className="p-2.5 hover:bg-white/10 rounded-xl text-white/40 hover:text-indigo-400 transition-all" title="Modify"><Edit3 size={16} /></button>
                                    <button onClick={() => handleDeleteItem(item.id)} className="p-2.5 hover:bg-rose-500/10 rounded-xl text-white/40 hover:text-rose-400 transition-all" title="Purge"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modals via Portals */}
            {createPortal(
                <AnimatePresence>
                    {editingItem && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 overflow-hidden">
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setEditingItem(null)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
                            />

                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 30 }} 
                                animate={{ opacity: 1, scale: 1, y: 0 }} 
                                exit={{ opacity: 0, scale: 0.95, y: 30 }} 
                                className="relative bg-black/40 border border-white/5 rounded-[40px] w-full max-w-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                            >
                                <form onSubmit={handleSaveItem} className="text-white">
                                    <div className="p-10 flex justify-between items-center border-b border-white/5 bg-white/[0.02]">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                                <Edit3 size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black uppercase tracking-widest">{editingItem?.id ? 'Modify Signal' : 'Initialize Point'}</h3>
                                                <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mt-1">Genesis Protocol Content</p>
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => setEditingItem(null)} className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all flex items-center justify-center border border-white/5 group">
                                            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                                        </button>
                                    </div>

                                    <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-8">
                                            <ImageUpload 
                                                folder="genesis" 
                                                currentImageUrl={editingItem.image_url} 
                                                onUpload={(url) => setEditingItem(prev => prev ? { ...prev, image_url: url } : prev)}
                                                label="Narrative Visual"
                                                aspect={4/3}
                                            />
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Main Descriptor</label>
                                                <input 
                                                    name="title" 
                                                    defaultValue={editingItem.title} 
                                                    required 
                                                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-[13px] font-black uppercase tracking-widest focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/10" 
                                                    placeholder="SIGNAL IDENTITY..." 
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-3 h-full flex flex-col">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Narrative Core</label>
                                                <textarea 
                                                    name="description" 
                                                    defaultValue={editingItem.description} 
                                                    required 
                                                    className="flex-1 w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-5 text-[14px] font-bold tracking-tight focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white/60 placeholder:text-white/10 min-h-[220px] resize-none leading-relaxed" 
                                                    placeholder="Input story core data..." 
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-10 bg-white/[0.02] border-t border-white/5 flex gap-6">
                                        <button type="button" onClick={() => setEditingItem(null)} className="flex-1 py-4.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white/40 transition-all active:scale-95">Abort Mission</button>
                                        <button 
                                            type="submit" 
                                            disabled={isSaving} 
                                            className="flex-[2] py-4.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:bg-indigo-500 hover:shadow-[0_0_60px_rgba(79,70,229,0.5)] transition-all active:scale-95 disabled:opacity-50 transform hover:-translate-y-1"
                                        >
                                            {isSaving ? 'Synchronizing...' : (editingItem?.id ? 'COMMIT CHANGES' : 'DEPLOY SIGNAL')}
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

export default GenesisManager;
