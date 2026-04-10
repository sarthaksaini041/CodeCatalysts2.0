import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../../lib/supabase-browser';
import { Plus, Trash2, ArrowUp, ArrowDown, Save, Edit3, X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ShiftManager = () => {
    const [cards, setCards] = useState([]);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCard, setEditingCard] = useState(null);
    const [editingStat, setEditingStat] = useState(null);
    const [chapterTitle, setChapterTitle] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const fetchShiftData = async () => {
        setLoading(true);
        const { data: cardsData } = await supabase.from('chapter2_cards').select('*').order('order_index', { ascending: true });
        const { data: statsData } = await supabase.from('chapter2_stats').select('*').order('order_index', { ascending: true });
        const { data: titleData } = await supabase.from('site_content').select('*').eq('key', 'chapter2_title').maybeSingle();
        
        setCards(cardsData || []);
        setStats(statsData || []);
        setChapterTitle(titleData?.content || 'THE SHIFT');
        setLoading(false);
    };

    useEffect(() => {
        if (editingCard || editingStat) {
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
    }, [editingCard, editingStat]);

    useEffect(() => {
        fetchShiftData();
    }, []);

    const handleSaveTitle = async () => {
        setIsSaving(true);
        await supabase.from('site_content').upsert({ key: 'chapter2_title', content: chapterTitle });
        setIsSaving(false);
    };

    const handleSaveCard = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.target);
        const cardData = {
            title: formData.get('title'),
            subtitle: formData.get('subtitle'),
            order_index: editingCard?.id ? editingCard.order_index : cards.length
        };

        if (editingCard?.id) {
            await supabase.from('chapter2_cards').update(cardData).eq('id', editingCard.id);
        } else {
            await supabase.from('chapter2_cards').insert(cardData);
        }

        setEditingCard(null);
        fetchShiftData();
        setIsSaving(false);
    };

    const handleDeleteCard = async (id) => {
        if (!window.confirm('Delete this card?')) return;
        await supabase.from('chapter2_cards').delete().eq('id', id);
        fetchShiftData();
    };

    const moveCard = async (index, direction) => {
        const newCards = [...cards];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= cards.length) return;
        [newCards[index], newCards[targetIndex]] = [newCards[targetIndex], newCards[index]];
        const updates = newCards.map((c, idx) => ({ ...c, order_index: idx }));
        await supabase.from('chapter2_cards').upsert(updates);
        fetchShiftData();
    };

    const handleSaveStat = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.target);
        const statData = {
            label: formData.get('label'),
            value: formData.get('value'),
            description: formData.get('description'),
            order_index: editingStat?.id ? editingStat.order_index : stats.length
        };

        if (editingStat?.id) {
            await supabase.from('chapter2_stats').update(statData).eq('id', editingStat.id);
        } else {
            await supabase.from('chapter2_stats').insert(statData);
        }

        setEditingStat(null);
        fetchShiftData();
        setIsSaving(false);
    };

    const handleDeleteStat = async (id) => {
        if (!window.confirm('Delete this stat?')) return;
        await supabase.from('chapter2_stats').delete().eq('id', id);
        fetchShiftData();
    };

    const moveStat = async (index, direction) => {
        const newStats = [...stats];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= stats.length) return;
        [newStats[index], newStats[targetIndex]] = [newStats[targetIndex], newStats[index]];
        const updates = newStats.map((s, idx) => ({ ...s, order_index: idx }));
        await supabase.from('chapter2_stats').upsert(updates);
        fetchShiftData();
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

            {/* Principle Cards */}
            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-sm font-bold text-slate-400">Key Principles</h3>
                    <button onClick={() => setEditingCard({})} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-all shadow-sm">
                        <Plus size={16} /> Add New Card
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cards.map((card, i) => (
                        <div key={card.id} className="group flex items-center gap-6 bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-md rounded-2xl p-6 transition-all">
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-slate-900">{card.title}</h4>
                                <p className="text-xs text-slate-500 font-medium">{card.subtitle}</p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => moveCard(i, -1)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all" title="Move Up"><ArrowUp size={16} /></button>
                                <button onClick={() => moveCard(i, 1)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all" title="Move Down"><ArrowDown size={16} /></button>
                                <button onClick={() => setEditingCard(card)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all" title="Edit"><Edit3 size={16} /></button>
                                <button onClick={() => handleDeleteCard(card.id)} className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-all" title="Delete"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Editor */}
            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-sm font-bold text-slate-400">Analytics</h3>
                    <button onClick={() => setEditingStat({})} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-all shadow-sm">
                        <Plus size={16} /> Add Stat
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <div key={stat.id} className="bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-2 relative group hover:border-indigo-200 hover:shadow-md transition-all">
                            <span className="text-2xl font-bold text-indigo-600 block">{stat.value}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{stat.label}</span>
                            <p className="text-[10px] text-slate-400 line-clamp-1 italic">{stat.description || 'No sub-text'}</p>
                            
                            <div className="absolute inset-x-0 -bottom-2 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                <div className="bg-white border border-slate-200 rounded-lg shadow-xl flex p-1">
                                    <button onClick={() => moveStat(i, -1)} className="p-1.5 hover:bg-slate-50 rounded-md text-slate-400 hover:text-indigo-600 transition-all"><ArrowUp size={12} /></button>
                                    <button onClick={() => moveStat(i, 1)} className="p-1.5 hover:bg-slate-50 rounded-md text-slate-400 hover:text-indigo-600 transition-all"><ArrowDown size={12} /></button>
                                    <button onClick={() => setEditingStat(stat)} className="p-1.5 hover:bg-slate-50 rounded-md text-slate-400 hover:text-indigo-600 transition-all"><Edit3 size={12} /></button>
                                    <button onClick={() => handleDeleteStat(stat.id)} className="p-1.5 hover:bg-rose-50 rounded-md text-slate-400 hover:text-rose-600 transition-all"><Trash2 size={12} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modals */}
            {createPortal(
                <AnimatePresence>
                    {editingCard && (
                        <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-900/20 backdrop-blur-sm">
                            <div className="min-h-full flex items-center justify-center p-4 md:p-6">
                                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white border border-slate-200 rounded-[32px] w-full max-w-lg p-8 shadow-2xl relative my-8">
                                <form onSubmit={handleSaveCard} className="space-y-6 text-slate-900">
                                    <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                                        <h3 className="text-lg font-bold text-slate-900">Edit Principle Card</h3>
                                        <button type="button" onClick={() => setEditingCard(null)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-2 rounded-xl transition-all"><X size={20} /></button>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2 text-left">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Title</label>
                                            <input name="title" defaultValue={editingCard.title} required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all text-slate-900" placeholder="e.g. Innovation" />
                                        </div>
                                        <div className="space-y-2 text-left">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Subtitle</label>
                                            <input name="subtitle" defaultValue={editingCard.subtitle} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all text-slate-900" placeholder="e.g. Pushing boundaries" />
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pt-6 mt-4 border-t border-slate-100">
                                        <button type="button" onClick={() => setEditingCard(null)} className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                                        <button type="submit" disabled={isSaving} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Save Principle</button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {createPortal(
                <AnimatePresence>
                    {editingStat && (
                        <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-900/20 backdrop-blur-sm">
                            <div className="min-h-full flex items-center justify-center p-4 md:p-6">
                                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white border border-slate-200 rounded-[32px] w-full max-w-sm p-8 shadow-2xl relative my-8">
                                <form onSubmit={handleSaveStat} className="space-y-6 text-slate-900">
                                    <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                                        <h3 className="text-lg font-bold text-slate-900">Edit Analytic Stat</h3>
                                        <button type="button" onClick={() => setEditingStat(null)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-2 rounded-xl transition-all"><X size={20} /></button>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2 text-left">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Value (e.g. 50+)</label>
                                            <input name="value" defaultValue={editingStat.value} required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all text-slate-900" />
                                        </div>
                                        <div className="space-y-2 text-left">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Label</label>
                                            <input name="label" defaultValue={editingStat.label} required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all text-slate-900" />
                                        </div>
                                        <div className="space-y-2 text-left">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Sub-text</label>
                                            <input name="description" defaultValue={editingStat.description} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all text-slate-900" />
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pt-6 mt-4 border-t border-slate-100">
                                        <button type="button" onClick={() => setEditingStat(null)} className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                                        <button type="submit" disabled={isSaving} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Save Stat</button>
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

export default ShiftManager;
