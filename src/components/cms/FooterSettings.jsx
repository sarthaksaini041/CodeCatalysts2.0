import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase-browser';
import { Save, Mail, Info, Users } from 'lucide-react';
import { LinkedInIcon, GitHubIcon, InstagramIcon } from '../icons/TechnicalIcons';
import { triggerRevalidation } from '../../utils/revalidate';

const FooterSettings = () => {
    const [settings, setSettings] = useState({
        footer_text: '',
        tagline: '',
        linkedin_url: '',
        github_url: '',
        instagram_url: '',
        community_url: ''
    });
    const [copyright, setCopyright] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchFooterData = async () => {
        setLoading(true);
        const { data: footerData } = await supabase.from('footer_settings').select('*').maybeSingle();
        const { data: copyData } = await supabase.from('site_content').select('*').eq('key', 'footer_copyright').maybeSingle();
        
        if (footerData) setSettings(footerData);
        if (copyData) setCopyright(copyData.content);
        setLoading(false);
    };

    useEffect(() => {
        fetchFooterData();
    }, []);


    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        // Save Footer Settings
        await supabase.from('footer_settings').upsert({
            id: settings.id, // preserve ID if exists
            ...settings
        });

        // Save Copyright in site_content
        await supabase.from('site_content').upsert({
            key: 'footer_copyright',
            content: copyright
        });

        setIsSaving(false);
        // Trigger comprehensive site refresh (Home & Team)
        triggerRevalidation(); 
        alert('Settings saved successfully!');
    };

    if (loading) return <div className="flex justify-center p-20"><Info className="animate-spin text-indigo-500" size={32} /></div>;

    return (
        <div className="max-w-5xl space-y-12 pb-20 text-left text-white">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[40px] p-12 shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/5 blur-[120px] rounded-full group-hover:bg-indigo-500/10 transition-colors duration-1000" />
                
                <div className="flex items-center gap-6 mb-12 border-b border-white/5 pb-10">
                    <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400">
                        <Info size={28} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-widest">Footer Configuration</h3>
                        <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mt-1.5">Global brand identity & social transmission protocols</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-12 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Brand Narrative (Footer Text)</label>
                                <textarea 
                                    value={settings.footer_text} 
                                    onChange={(e) => setSettings({...settings, footer_text: e.target.value})}
                                    rows={4}
                                    className="w-full bg-black/40 border border-white/5 rounded-[24px] px-6 py-5 text-[14px] font-bold tracking-tight focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white/70 placeholder:text-white/10 resize-none leading-relaxed shadow-inner"
                                    placeholder="Enter brand objectives..."
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Primary Tagline</label>
                                <input 
                                    value={settings.tagline} 
                                    onChange={(e) => setSettings({...settings, tagline: e.target.value})}
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-[13px] font-black uppercase tracking-widest focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/10"
                                    placeholder="SYNCHRONIZING_FUTURE..."
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Legal ID (Copyright)</label>
                                <input 
                                    value={copyright} 
                                    onChange={(e) => setCopyright(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-[13px] font-black uppercase tracking-widest focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/10"
                                    placeholder="e.g. © 2024 CODE_CATALYSTS"
                                />
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center gap-4 px-1">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 whitespace-nowrap">Connect Channels</h4>
                                <div className="h-px flex-1 bg-white/5"></div>
                            </div>
                            
                            <div className="space-y-5">
                                <div className="group relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-indigo-400 transition-colors"><Mail size={20} /></div>
                                    <input 
                                        value={settings.email} 
                                        onChange={(e) => setSettings({...settings, email: e.target.value})}
                                        placeholder="DIRECT_COMMS_LOCAL"
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl pl-16 pr-6 py-4 text-[13px] font-bold tracking-widest focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white/60 placeholder:text-white/10"
                                    />
                                </div>
                                <div className="group relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-indigo-400 transition-colors"><LinkedInIcon size={20} /></div>
                                    <input 
                                        value={settings.linkedin_url} 
                                        onChange={(e) => setSettings({...settings, linkedin_url: e.target.value})}
                                        placeholder="LINKEDIN_UPLINK"
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl pl-16 pr-6 py-4 text-[13px] font-bold tracking-widest focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white/60 placeholder:text-white/10"
                                    />
                                </div>
                                <div className="group relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-rose-500 transition-colors"><InstagramIcon size={20} /></div>
                                    <input 
                                        value={settings.instagram_url} 
                                        onChange={(e) => setSettings({...settings, instagram_url: e.target.value})}
                                        placeholder="INSTAGRAM_NODE"
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl pl-16 pr-6 py-4 text-[13px] font-bold tracking-widest focus:outline-none focus:border-rose-500/50 focus:bg-white/[0.05] transition-all text-white/60 placeholder:text-white/10"
                                    />
                                </div>
                                <div className="group relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-emerald-400 transition-colors"><Users size={20} /></div>
                                    <input 
                                        value={settings.community_url} 
                                        onChange={(e) => setSettings({...settings, community_url: e.target.value})}
                                        placeholder="COMMUNITY_GRID_URL"
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl pl-16 pr-6 py-4 text-[13px] font-bold tracking-widest focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all text-white/60 placeholder:text-white/10"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-white/5">
                        <button 
                            type="submit" 
                            disabled={isSaving}
                            className="w-full py-5 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-[24px] shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:bg-indigo-500 hover:shadow-[0_0_60px_rgba(79,70,229,0.5)] transition-all active:scale-[0.98] disabled:opacity-50 transform hover:-translate-y-1"
                        >
                            {isSaving ? 'Compiling Changes...' : 'Synchronize Global Settings'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FooterSettings;
