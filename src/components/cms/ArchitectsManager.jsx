import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { Plus, Trash2, ArrowUp, ArrowDown, Save, Edit3, X, Network } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from './ImageUpload';

const ArchitectsManager = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);
    const [chapterTitle, setChapterTitle] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const fetchArchitectsData = async () => {
        setLoading(true);
        const { data: itemsData } = await supabase.from('chapter5_showcase').select('*').order('order_index', { ascending: true });
        const { data: titleData } = await supabase.from('site_content').select('*').eq('key', 'chapter5_title').maybeSingle();
        
        setItems(itemsData || []);
        setChapterTitle(titleData?.content || 'THE NETWORK');
        setLoading(false);
    };

    useEffect(() => {
        fetchArchitectsData();
    }, []);


    const handleSaveTitle = async () => {
        setIsSaving(true);
        await supabase.from('site_content').upsert({ key: 'chapter5_title', content: chapterTitle });
        setIsSaving(false);
    };

    const handleSaveItem = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.target);
        
        const itemData = {
            title: formData.get('title'),
            image_url: editingItem.image_url,
            order_index: editingItem?.id ? editingItem.order_index : items.length
        };

        if (editingItem?.id) {
            await supabase.from('chapter5_showcase').update(itemData).eq('id', editingItem.id);
        } else {
            await supabase.from('chapter5_showcase').insert(itemData);
        }

        setEditingItem(null);
        fetchArchitectsData();
        setIsSaving(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this showcase item?')) return;
        await supabase.from('chapter5_showcase').delete().eq('id', id);
        fetchArchitectsData();
    };

    const moveItem = async (index, direction) => {
        const newItems = [...items];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= items.length) return;
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
        const updates = newItems.map((s, idx) => ({ id: s.id, order_index: idx }));
        await supabase.from('chapter5_showcase').upsert(updates);
        fetchArchitectsData();
    };

    if (loading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

    return (
        <div className="space-y-12">
            <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 text-white">
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
                    <h3 className="text-xs font-black uppercase tracking-widest text-white/40">SHOWCASE_VAULT</h3>
                    <button onClick={() => setEditingItem({ image_url: '' })} className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-white font-bold">
                        <Plus size={14} /> ADD_ITEM
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {items.map((item, index) => (
                        <div key={item.id} className="group relative bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:bg-white/[0.04] transition-all">
                            <div className="aspect-square bg-white/5 overflow-hidden">
                                {item.image_url ? (
                                    <img src={item.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/10">
                                        <Network size={40} />
                                    </div>
                                )}
                            </div>
                            <div className="p-4 flex flex-col gap-4">
                                <h4 className="text-xs font-black text-white/60 tracking-widest uppercase">{item.title}</h4>
                                <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all">
                                    <div className="flex gap-1">
                                        <button onClick={() => moveItem(index, -1)} className="p-2 hover:text-primary transition-colors text-white/20"><ArrowUp size={14} /></button>
                                        <button onClick={() => moveItem(index, 1)} className="p-2 hover:text-primary transition-colors text-white/20"><ArrowDown size={14} /></button>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => setEditingItem(item)} className="p-2 hover:text-primary transition-colors text-white/20"><Edit3 size={14} /></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 hover:text-red-500 transition-colors text-white/20"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {editingItem && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-[#050505]/80 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0a0a0a] border border-white/10 rounded-[32px] w-full max-w-sm p-8 shadow-2xl">
                            <form onSubmit={handleSaveItem} className="space-y-6 text-white">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-primary">EDIT_SHOWCASE_ITEM</h3>
                                    <button type="button" onClick={() => setEditingItem(null)} className="text-white/20 hover:text-white"><X size={20} /></button>
                                </div>
                                <div className="space-y-6">
                                    <ImageUpload 
                                        folder="showcase" 
                                        currentImageUrl={editingItem.image_url} 
                                        onUpload={(url) => setEditingItem(prev => ({ ...prev, image_url: url }))}
                                        label="SHOWCASE_IMAGE"
                                    />
                                    <div className="space-y-2 text-left">
                                        <label className="text-[10px] font-black uppercase tracking-wider text-white/30 ml-2">Item Title</label>
                                        <input name="title" defaultValue={editingItem.title} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-white" />
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setEditingItem(null)} className="flex-1 py-4 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">CANCEL</button>
                                    <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-primary text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all font-bold">SAVE_ITEM</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ArchitectsManager;
