import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase-browser';
import { Save, Info, Sparkles, Layout } from 'lucide-react';
import { triggerRevalidation } from '../../utils/revalidate';

const HeroManager = () => {
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [content, setContent] = useState({
        hero_tagline: 'CODE CATALYSTS',
        hero_line1: "WE DIDN'T FIND A PATH.",
        hero_line2: "WE BUILT ONE.",
        hero_scroll_hint: "Scroll to begin"
    });

    const fetchHeroData = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('site_content')
            .select('*')
            .or('key.eq.hero_tagline,key.eq.hero_line1,key.eq.hero_line2,key.eq.hero_scroll_hint');
        
        if (data) {
            const newContent = { ...content };
            data.forEach(item => {
                newContent[item.key] = item.content;
            });
            setContent(newContent);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchHeroData();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        const updates = Object.entries(content).map(([key, value]) => ({
            key,
            content: value
        }));

        const { error } = await supabase.from('site_content').upsert(updates);
        
        if (!error) {
            // Trigger instant site refresh (Home page)
            triggerRevalidation('/');
            alert('Hero section synchronized successfully!');
        } else {
            alert('Error syncing protocol: ' + error.message);
        }
        
        setIsSaving(false);
    };

    if (loading) return <div className="flex justify-center p-20"><Info className="animate-spin text-indigo-500" size={32} /></div>;

    return (
        <div className="max-w-5xl space-y-12 pb-20 text-left text-white">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[40px] p-12 shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/5 blur-[120px] rounded-full group-hover:bg-indigo-500/10 transition-colors duration-1000" />
                
                <div className="flex items-center gap-6 mb-12 border-b border-white/5 pb-10">
                    <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400">
                        <Sparkles size={28} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-widest">Initial Genesis Protocol</h3>
                        <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mt-1.5">Manage the primary display identity for the Hero Sector</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-10 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Identity Marker (Tagline)</label>
                            <input 
                                value={content.hero_tagline} 
                                onChange={(e) => setContent({...content, hero_tagline: e.target.value})} 
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-[13px] font-black uppercase tracking-widest focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/10 shadow-inner" 
                                placeholder="e.g. CODE_CATALYSTS..."
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Guidance Signal (Scroll Hint)</label>
                            <input 
                                value={content.hero_scroll_hint} 
                                onChange={(e) => setContent({...content, hero_scroll_hint: e.target.value})} 
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-[13px] font-black uppercase tracking-widest focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/10 shadow-inner" 
                                placeholder="e.g. SCROLL TO BEGIN..."
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Neural Headline (Line 1)</label>
                        <input 
                            value={content.hero_line1} 
                            onChange={(e) => setContent({...content, hero_line1: e.target.value})} 
                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-5 text-[16px] font-black uppercase tracking-widest focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/10 shadow-inner" 
                            placeholder="WE DIDN'T FIND A PATH..."
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Manifest Headline (Line 2 - Gradient)</label>
                        <input 
                            value={content.hero_line2} 
                            onChange={(e) => setContent({...content, hero_line2: e.target.value})} 
                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-5 text-[16px] font-black uppercase tracking-widest focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/10 shadow-inner" 
                            placeholder="WE BUILT ONE..."
                        />
                    </div>

                    <div className="pt-6 border-t border-white/5">
                        <button 
                            type="submit" 
                            disabled={isSaving}
                            className="w-full py-5 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-[24px] shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:bg-indigo-500 hover:shadow-[0_0_60px_rgba(79,70,229,0.5)] transition-all active:scale-[0.98] disabled:opacity-50 transform hover:-translate-y-1"
                        >
                            <div className="flex items-center justify-center gap-3">
                                <Save size={18} />
                                {isSaving ? 'Synching Protocol...' : 'Synchronize Genesis Matrix'}
                            </div>
                        </button>
                    </div>
                </form>

                <div className="mt-12 bg-indigo-500/5 border border-indigo-500/10 rounded-[24px] p-8 flex items-start gap-5 relative overflow-hidden group/alert shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent translate-x-[-100%] group-hover/alert:translate-x-[100%] transition-transform duration-1000" />
                    <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 mt-0.5">
                        <Info size={18} />
                    </div>
                    <div className="space-y-2 relative z-10 text-left">
                        <p className="text-[11px] font-black text-white/80 uppercase tracking-widest">Genesis Serialization Logic</p>
                        <p className="text-[12px] text-white/40 font-bold leading-relaxed tracking-tight">
                            The Hero Sector uses high-priority rendering. Changes made here will be instantly synchronized across the 
                            <span className="text-indigo-400 font-black mx-1">CENTRAL_LANDING_NODE</span>.
                            Ensure copy maintains tactical brevity for maximum impact.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroManager;
