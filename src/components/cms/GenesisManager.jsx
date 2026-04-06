import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../../utils/supabase';
import { Plus, Trash2, ArrowUp, ArrowDown, Save, Edit3, X, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from './ImageUpload';

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
        fetchGenesisData();
    }, []);


    const handleSaveTitle = async () => {
        setIsSaving(true);
        await supabase.from('site_content').upsert({ key: 'chapter1_title', content: chapterTitle });
        setIsSaving(false);
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
    };

    const handleDeleteItem = async (id) => {
        if (!window.confirm('Delete this story point?')) return;
        await supabase.from('chapter1_items').delete().eq('id', id);
        fetchGenesisData();
    };

    const moveItem = async (index, direction) => {
        const newItems = [...items];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= items.length) return;

        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

        const updates = newItems.map((item, idx) => ({ id: item.id, order_index: idx }));
        await supabase.from('chapter1_items').upsert(updates);
        fetchGenesisData();
    };

    if (loading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;

    return (
        <div className="space-y-8 text-left">
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

            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-sm font-bold text-slate-400">Stories</h3>
                    <button onClick={() => setEditingItem({ image_url: '' })} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-all shadow-sm">
                        <Plus size={16} /> Add New
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {items.map((item, index) => (
                        <div key={item.id} className="group flex items-center gap-6 bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-md rounded-2xl p-4 transition-all">
                            <div className="w-20 h-14 rounded-lg bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-100">
                                {item.image_url ? (
                                    <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                                        <History size={20} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-slate-900 truncate">{item.title}</h4>
                                <p className="text-xs text-slate-500 line-clamp-1">{item.description}</p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => moveItem(index, -1)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all" title="Move Up"><ArrowUp size={16} /></button>
                                <button onClick={() => moveItem(index, 1)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all" title="Move Down"><ArrowDown size={16} /></button>
                                <button onClick={() => setEditingItem(item)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all" title="Edit"><Edit3 size={16} /></button>
                                <button onClick={() => handleDeleteItem(item.id)} className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-all" title="Delete"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {createPortal(
                <AnimatePresence>
                    {editingItem && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/20 backdrop-blur-sm px-4">
                            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white border border-slate-200 rounded-[32px] w-full max-w-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                                <form onSubmit={handleSaveItem} className="space-y-6 text-slate-900">
                                    <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                                        <h3 className="text-lg font-bold text-slate-900">Edit Story</h3>
                                        <button type="button" onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-2 rounded-xl transition-all"><X size={20} /></button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <ImageUpload 
                                                folder="genesis" 
                                                currentImageUrl={editingItem.image_url} 
                                                onUpload={(url) => setEditingItem(prev => ({ ...prev, image_url: url }))}
                                                label="Social Visual"
                                            />
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Title</label>
                                                <input name="title" defaultValue={editingItem.title} required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all text-slate-900" placeholder="Enter story title..." />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Description</label>
                                                <textarea name="description" defaultValue={editingItem.description} required rows={5} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all text-slate-900" placeholder="Share the core narrative..." />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6 mt-4 border-t border-slate-100">
                                        <button type="button" onClick={() => setEditingItem(null)} className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                                        <button type="submit" disabled={isSaving} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Save Changes</button>
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
