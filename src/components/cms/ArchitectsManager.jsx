import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase-browser';
import { Save, Info, Users } from 'lucide-react';

const ArchitectsManager = () => {
    const [loading, setLoading] = useState(true);
    const [chapterTitle, setChapterTitle] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const fetchArchitectsData = async () => {
        setLoading(true);
        const { data: titleData } = await supabase.from('site_content').select('*').eq('key', 'chapter5_title').maybeSingle();
        setChapterTitle(titleData?.content || 'THE ARCHITECTS');
        setLoading(false);
    };

    useEffect(() => {
        fetchArchitectsData();
    }, []);

    const handleSaveTitle = async () => {
        setIsSaving(true);
        await supabase.from('site_content').upsert({ key: 'chapter5_title', content: chapterTitle });
        setIsSaving(false);
        alert('Title updated successfully!');
    };

    if (loading) return <div className="flex justify-center p-20"><Info className="animate-spin text-indigo-500" size={32} /></div>;

    return (
        <div className="max-w-5xl space-y-12 pb-20 text-left text-white">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[40px] p-12 shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/5 blur-[120px] rounded-full group-hover:bg-indigo-500/10 transition-colors duration-1000" />
                
                <div className="flex items-center gap-6 mb-12 border-b border-white/5 pb-10">
                    <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400">
                        <Users size={28} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-widest">Architects Section Protocol</h3>
                        <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mt-1.5">Manage the display identity for Chapter 05 (The Architects)</p>
                    </div>
                </div>

                <div className="space-y-10 relative z-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Chapter Identity Marker</label>
                        <div className="flex gap-4">
                            <input 
                                value={chapterTitle} 
                                onChange={(e) => setChapterTitle(e.target.value)} 
                                className="flex-1 bg-black/40 border border-white/5 rounded-2xl px-6 py-5 text-[14px] font-black uppercase tracking-widest focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/10 shadow-inner" 
                                placeholder="e.g. THE_ARCHITECTS..."
                            />
                            <button 
                                onClick={handleSaveTitle} 
                                disabled={isSaving}
                                className="px-10 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:bg-indigo-500 hover:shadow-[0_0_50px_rgba(79,70,229,0.5)] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-3 transform hover:-translate-y-1"
                            >
                                <Save size={16} />
                                {isSaving ? 'Synching...' : 'Update Code'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-[24px] p-8 flex items-start gap-5 relative overflow-hidden group/alert">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent translate-x-[-100%] group-hover/alert:translate-x-[100%] transition-transform duration-1000" />
                        <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 mt-0.5">
                            <Info size={18} />
                        </div>
                        <div className="space-y-2 relative z-10">
                            <p className="text-[11px] font-black text-white/80 uppercase tracking-widest">Automated Synchronization Enabled</p>
                            <p className="text-[12px] text-white/40 font-bold leading-relaxed tracking-tight">
                                The architectural grid for this sector is automatically populated by units registered in the 
                                <span className="text-indigo-400 font-black mx-1">TEAM_OPERATIONS</span> 
                                database. Update individual operator profiles there to reflect changes here.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArchitectsManager;
