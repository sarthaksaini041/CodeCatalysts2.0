import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
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

    useEffect(() => {
        fetchShiftData();
    }, []);

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

    if (loading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

    return (
        <div className="space-y-12 pb-20">
            {/* Header / Title Editor */}
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

            {/* Principle Cards */}
            <div className="space-y-6">
                <div className="flex justify-between items-center px-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-white/40">PRINCIPLE_CARDS</h3>
                    <button onClick={() => setEditingCard({})} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-white">
                        <Plus size={14} /> ADD_PROTOCOL
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cards.map((card, i) => (
                        <div key={card.id} className="group flex items-center gap-6 bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] transition-all">
                            <div className="flex-1">
                                <h4 className="text-sm font-black text-white">{card.title}</h4>
                                <p className="text-xs text-white/40 uppercase tracking-widest">{card.subtitle}</p>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => moveCard(i, -1)} className="p-2 hover:text-primary transition-colors text-white/20"><ArrowUp size={16} /></button>
                                <button onClick={() => moveCard(i, 1)} className="p-2 hover:text-primary transition-colors text-white/20"><ArrowDown size={16} /></button>
                                <button onClick={() => setEditingCard(card)} className="p-2 hover:text-primary transition-colors text-white/20"><Edit3 size={16} /></button>
                                <button onClick={() => handleDeleteCard(card.id)} className="p-2 hover:text-red-500 transition-colors text-white/20"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Editor */}
            <div className="space-y-6">
                <div className="flex justify-between items-center px-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-white/40">ANALYTIC_STATS</h3>
                    <button onClick={() => setEditingStat({})} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-white">
                        <Plus size={14} /> ADD_STAT
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <div key={stat.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-center space-y-2 relative group hover:bg-white/[0.04] transition-all">
                            <span className="text-2xl font-black text-primary block">{stat.value}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary block">{stat.label}</span>
                            <p className="text-[9px] text-white/40 line-clamp-1">{stat.description || 'No description'}</p>
                            
                            <div className="absolute inset-x-0 bottom-2 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => moveStat(i, -1)} className="p-1 hover:text-primary text-white/20"><ArrowUp size={12} /></button>
                                <button onClick={() => moveStat(i, 1)} className="p-1 hover:text-primary text-white/20"><ArrowDown size={12} /></button>
                                <button onClick={() => setEditingStat(stat)} className="p-1 hover:text-primary text-white/20"><Edit3 size={12} /></button>
                                <button onClick={() => handleDeleteStat(stat.id)} className="p-1 hover:text-red-500 text-white/20"><Trash2 size={12} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {editingCard && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-[#050505]/80 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0a0a0a] border border-white/10 rounded-[32px] w-full max-w-lg p-8 shadow-2xl">
                            <form onSubmit={handleSaveCard} className="space-y-6 text-white">
                                <h3 className="text-sm font-black uppercase tracking-widest text-primary">EDIT_PROTOCOL_CARD</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2 text-left">
                                        <label className="text-[10px] font-black uppercase tracking-wider text-white/30 ml-2">Title</label>
                                        <input name="title" defaultValue={editingCard.title} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-white" />
                                    </div>
                                    <div className="space-y-2 text-left">
                                        <label className="text-[10px] font-black uppercase tracking-wider text-white/30 ml-2">Subtitle</label>
                                        <input name="subtitle" defaultValue={editingCard.subtitle} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-white" />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setEditingCard(null)} className="flex-1 py-4 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">CANCEL</button>
                                    <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-primary text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all">SAVE_PROTOCOL</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {editingStat && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-[#050505]/80 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0a0a0a] border border-white/10 rounded-[32px] w-full max-w-sm p-8 shadow-2xl">
                            <form onSubmit={handleSaveStat} className="space-y-6 text-white">
                                <h3 className="text-sm font-black uppercase tracking-widest text-primary">EDIT_ANALYTIC_STAT</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2 text-left">
                                        <label className="text-[10px] font-black uppercase tracking-wider text-white/30 ml-2">Value (e.g. 50+)</label>
                                        <input name="value" defaultValue={editingStat.value} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-white" />
                                    </div>
                                    <div className="space-y-2 text-left">
                                        <label className="text-[10px] font-black uppercase tracking-wider text-white/30 ml-2">Label</label>
                                        <input name="label" defaultValue={editingStat.label} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-white" />
                                    </div>
                                    <div className="space-y-2 text-left">
                                        <label className="text-[10px] font-black uppercase tracking-wider text-white/30 ml-2">Description / Sub-text</label>
                                        <input name="description" defaultValue={editingStat.description} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-white" />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setEditingStat(null)} className="flex-1 py-4 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all text-white">CANCEL</button>
                                    <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-primary text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all">SAVE_STAT</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ShiftManager;
