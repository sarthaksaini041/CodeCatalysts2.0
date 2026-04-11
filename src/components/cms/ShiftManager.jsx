import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../../lib/supabase-browser';
import { Plus, Trash2, ArrowUp, ArrowDown, Save, Edit3, X, Zap, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerRevalidation } from '../../utils/revalidate';

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
        // Trigger instant site refresh (Home page)
        triggerRevalidation('/');
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
        // Trigger instant site refresh (Home page)
        triggerRevalidation('/');
    };

    const handleDeleteCard = async (id) => {
        if (!window.confirm('Delete this card?')) return;
        await supabase.from('chapter2_cards').delete().eq('id', id);
        fetchShiftData();
        // Trigger instant site refresh (Home page)
        triggerRevalidation('/');
    };

    const moveCard = async (index, direction) => {
        const newCards = [...cards];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= cards.length) return;
        [newCards[index], newCards[targetIndex]] = [newCards[targetIndex], newCards[index]];
        const updates = newCards.map((c, idx) => ({ ...c, order_index: idx }));
        await supabase.from('chapter2_cards').upsert(updates);
        fetchShiftData();
        // Trigger instant site refresh (Home page)
        triggerRevalidation('/');
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
        // Trigger instant site refresh (Home page)
        triggerRevalidation('/');
    };

    const handleDeleteStat = async (id) => {
        if (!window.confirm('Delete this stat?')) return;
        await supabase.from('chapter2_stats').delete().eq('id', id);
        fetchShiftData();
        // Trigger instant site refresh (Home page)
        triggerRevalidation('/');
    };

    const moveStat = async (index, direction) => {
        const newStats = [...stats];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= stats.length) return;
        [newStats[index], newStats[targetIndex]] = [newStats[targetIndex], newStats[index]];
        const updates = newStats.map((s, idx) => ({ ...s, order_index: idx }));
        await supabase.from('chapter2_stats').upsert(updates);
        fetchShiftData();
        // Trigger instant site refresh (Home page)
        triggerRevalidation('/');
    };

    if (loading) return <div className="flex justify-center p-20"><Zap className="animate-spin text-indigo-500" size={32} /></div>;

    return (
        <div className="space-y-12 pb-20 text-left">
            {/* Header / Title Editor */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full group-hover:bg-indigo-500/10 transition-colors" />
                
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                        <Sparkles size={16} />
                    </div>
                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Sector Identification</h3>
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
                        {isSaving ? 'Syncing...' : 'Update Title'}
                    </button>
                </div>
            </div>

            {/* Principle Cards */}
            <div className="space-y-6">
                <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Foundational Logic</h3>
                    </div>
                    <button 
                        onClick={() => setEditingCard({})} 
                        className="flex items-center gap-2 px-6 py-3 bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-xl active:scale-95 group"
                    >
                        <Plus size={16} className="text-indigo-400 group-hover:rotate-90 transition-transform" /> Add Logic Unit
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cards.map((card, i) => (
                        <div key={card.id} className="group flex items-center gap-6 bg-white/[0.02] backdrop-blur-md border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.05] rounded-[32px] p-8 transition-all duration-500 shadow-xl relative overflow-hidden">
                             <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full group-hover:bg-indigo-500/10 transition-colors" />
                             
                            <div className="flex-1 relative z-10">
                                <h4 className="text-[13px] font-black text-white uppercase tracking-widest mb-1 group-hover:text-indigo-400 transition-colors">{card.title}</h4>
                                <p className="text-[11px] font-bold text-white/30 tracking-tight">{card.subtitle}</p>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500 relative z-10">
                                <div className="flex bg-black/40 backdrop-blur-xl rounded-2xl p-1.5 border border-white/5 shadow-2xl">
                                    <button onClick={() => moveCard(i, -1)} className="p-2.5 hover:bg-white/10 rounded-xl text-white/40 hover:text-indigo-400 transition-all" title="Shift Up"><ArrowUp size={16} /></button>
                                    <button onClick={() => moveCard(i, 1)} className="p-2.5 hover:bg-white/10 rounded-xl text-white/40 hover:text-indigo-400 transition-all" title="Shift Down"><ArrowDown size={16} /></button>
                                    <div className="w-px h-8 bg-white/5 self-center mx-1" />
                                    <button onClick={() => setEditingCard(card)} className="p-2.5 hover:bg-white/10 rounded-xl text-white/40 hover:text-indigo-400 transition-all" title="Modify"><Edit3 size={16} /></button>
                                    <button onClick={() => handleDeleteCard(card.id)} className="p-2.5 hover:bg-rose-500/10 rounded-xl text-white/40 hover:text-rose-400 transition-all" title="Purge"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Editor */}
            <div className="space-y-6">
                <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Quantum Analytics</h3>
                    </div>
                    <button 
                        onClick={() => setEditingStat({})} 
                        className="flex items-center gap-2 px-6 py-3 bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-xl active:scale-95 group"
                    >
                        <Plus size={16} className="text-emerald-400 group-hover:rotate-90 transition-transform" /> Deploy Monitor
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <div key={stat.id} className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-[32px] p-8 text-center space-y-3 relative group hover:border-emerald-500/30 hover:bg-white/[0.05] transition-all duration-500 shadow-xl overflow-hidden">
                            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full group-hover:bg-emerald-500/10 transition-colors" />
                            
                            <span className="text-3xl font-black text-white tabular-nums block group-hover:text-emerald-400 transition-colors relative z-10">{stat.value}</span>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 block relative z-10">{stat.label}</span>
                            <p className="text-[10px] text-white/20 font-bold uppercase tracking-tighter line-clamp-1 relative z-10">{stat.description || 'N/A'}</p>
                            
                            <div className="absolute inset-x-0 -bottom-2 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 z-20">
                                <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex p-1.5">
                                    <button onClick={() => moveStat(i, -1)} className="p-2 hover:bg-white/10 rounded-xl text-white/40 hover:text-emerald-400 transition-all"><ArrowUp size={14} /></button>
                                    <button onClick={() => moveStat(i, 1)} className="p-2 hover:bg-white/10 rounded-xl text-white/40 hover:text-emerald-400 transition-all"><ArrowDown size={14} /></button>
                                    <button onClick={() => setEditingStat(stat)} className="p-2 hover:bg-white/10 rounded-xl text-white/40 hover:text-emerald-400 transition-all"><Edit3 size={14} /></button>
                                    <button onClick={() => handleDeleteStat(stat.id)} className="p-2 hover:bg-rose-500/10 rounded-xl text-white/40 hover:text-rose-400 transition-all"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modals via Portals */}
            {createPortal(
                <AnimatePresence>
                    {editingCard && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 overflow-hidden">
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setEditingCard(null)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
                            />

                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 30 }} 
                                animate={{ opacity: 1, scale: 1, y: 0 }} 
                                exit={{ opacity: 0, scale: 0.95, y: 30 }} 
                                className="relative bg-black/40 border border-white/5 rounded-[40px] w-full max-w-lg overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                            >
                                <form onSubmit={handleSaveCard} className="text-white">
                                    <div className="p-10 flex justify-between items-center border-b border-white/5 bg-white/[0.02]">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                                <Zap size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black uppercase tracking-widest">Logic Interface</h3>
                                                <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mt-1">Foundational Unit Definition</p>
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => setEditingCard(null)} className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all flex items-center justify-center border border-white/5 group">
                                            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                                        </button>
                                    </div>

                                    <div className="p-10 space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Universal Title</label>
                                            <input 
                                                name="title" 
                                                defaultValue={editingCard.title} 
                                                required 
                                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-[13px] font-black uppercase tracking-widest focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/10" 
                                                placeholder="e.g. CORE INNOVATION..." 
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Contextual Subtitle</label>
                                            <input 
                                                name="subtitle" 
                                                defaultValue={editingCard.subtitle} 
                                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-[13px] font-black uppercase tracking-widest focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/10" 
                                                placeholder="e.g. EVOLVING ARCHITECTURES..." 
                                            />
                                        </div>
                                    </div>

                                    <div className="p-10 bg-white/[0.02] border-t border-white/5 flex gap-6">
                                        <button type="button" onClick={() => setEditingCard(null)} className="flex-1 py-4.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white/40 transition-all active:scale-95">Abstain</button>
                                        <button 
                                            type="submit" 
                                            disabled={isSaving} 
                                            className="flex-[2] py-4.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:bg-indigo-500 hover:shadow-[0_0_60px_rgba(79,70,229,0.5)] transition-all active:scale-95 disabled:opacity-50 transform hover:-translate-y-1"
                                        >
                                            {isSaving ? 'Synching...' : 'Commit Unit'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {createPortal(
                <AnimatePresence>
                    {editingStat && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 overflow-hidden">
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setEditingStat(null)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
                            />

                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 30 }} 
                                animate={{ opacity: 1, scale: 1, y: 0 }} 
                                exit={{ opacity: 0, scale: 0.95, y: 30 }} 
                                className="relative bg-black/40 border border-white/5 rounded-[40px] w-full max-w-md overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                            >
                                <form onSubmit={handleSaveStat} className="text-white">
                                    <div className="p-10 flex justify-between items-center border-b border-white/5 bg-white/[0.02]">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                                                <Zap size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black uppercase tracking-widest">Metric Config</h3>
                                                <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mt-1">Analytic Data Definition</p>
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => setEditingStat(null)} className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all flex items-center justify-center border border-white/5 group">
                                            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                                        </button>
                                    </div>

                                    <div className="p-10 space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Quantum Value</label>
                                            <input 
                                                name="value" 
                                                defaultValue={editingStat.value} 
                                                required 
                                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-[13px] font-black uppercase tracking-widest focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/10" 
                                                placeholder="e.g. 500+..." 
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Metric Identity</label>
                                            <input 
                                                name="label" 
                                                defaultValue={editingStat.label} 
                                                required 
                                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-[13px] font-black uppercase tracking-widest focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/10" 
                                                placeholder="e.g. RESEARCH NODES..." 
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Sub-context</label>
                                            <input 
                                                name="description" 
                                                defaultValue={editingStat.description} 
                                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-[13px] font-black uppercase tracking-widest focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/10" 
                                                placeholder="Brief contextual detail..." 
                                            />
                                        </div>
                                    </div>

                                    <div className="p-10 bg-white/[0.02] border-t border-white/5 flex gap-6">
                                        <button type="button" onClick={() => setEditingStat(null)} className="flex-1 py-4.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white/40 transition-all active:scale-95">Discard</button>
                                        <button 
                                            type="submit" 
                                            disabled={isSaving} 
                                            className="flex-[2] py-4.5 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:bg-emerald-500 hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] transition-all active:scale-95 disabled:opacity-50 transform hover:-translate-y-1"
                                        >
                                            {isSaving ? 'Compiling...' : 'Commit Metric'}
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

export default ShiftManager;
