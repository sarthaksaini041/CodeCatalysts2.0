import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { Save, Mail, Info } from 'lucide-react';
import { LinkedInIcon, GitHubIcon, InstagramIcon } from '../icons/TechnicalIcons';

const FooterSettings = () => {
    const [settings, setSettings] = useState({
        footer_text: '',
        tagline: '',
        linkedin_url: '',
        github_url: '',
        instagram_url: ''
    });
    const [copyright, setCopyright] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchFooterData();
    }, []);

    const fetchFooterData = async () => {
        setLoading(true);
        const { data: footerData } = await supabase.from('footer_settings').select('*').maybeSingle();
        const { data: copyData } = await supabase.from('site_content').select('*').eq('key', 'footer_copyright').maybeSingle();
        
        if (footerData) setSettings(footerData);
        if (copyData) setCopyright(copyData.content);
        setLoading(false);
    };

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
        alert('Settings saved successfully!');
    };

    if (loading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

    return (
        <div className="max-w-4xl space-y-12 pb-20">
            <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-10">
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                        <Info size={24} className="text-primary" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-white">FOOTER_SYSTEM_CONFIG</h3>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">Global brand identity & social hooks</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-wider text-white/30 ml-2">Footer Brand Text</label>
                                <textarea 
                                    value={settings.footer_text} 
                                    onChange={(e) => setSettings({...settings, footer_text: e.target.value})}
                                    rows={3}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-wider text-white/30 ml-2">Footer Tagline</label>
                                <input 
                                    value={settings.tagline} 
                                    onChange={(e) => setSettings({...settings, tagline: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-wider text-white/30 ml-2">Copyright Text</label>
                                <input 
                                    value={copyright} 
                                    onChange={(e) => setCopyright(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-4 px-2">SOCIAL_INTEGRATIONS</h4>
                            <div className="space-y-4">
                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20"><LinkedInIcon size={18} /></div>
                                    <input 
                                        value={settings.linkedin_url} 
                                        onChange={(e) => setSettings({...settings, linkedin_url: e.target.value})}
                                        placeholder="LinkedIn URL"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-5 py-4 text-sm focus:outline-none focus:border-[#0077b5] transition-all text-white"
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20"><GitHubIcon size={18} /></div>
                                    <input 
                                        value={settings.github_url} 
                                        onChange={(e) => setSettings({...settings, github_url: e.target.value})}
                                        placeholder="GitHub URL"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-5 py-4 text-sm focus:outline-none focus:border-white transition-all text-white"
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20"><InstagramIcon size={18} /></div>
                                    <input 
                                        value={settings.instagram_url} 
                                        onChange={(e) => setSettings({...settings, instagram_url: e.target.value})}
                                        placeholder="Instagram URL"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-5 py-4 text-sm focus:outline-none focus:border-[#e1306c] transition-all text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                        <button 
                            type="submit" 
                            disabled={isSaving}
                            className="w-full py-5 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-primary transition-all shadow-xl shadow-white/5 disabled:opacity-50"
                        >
                            {isSaving ? 'UPLOADING_CHANGES...' : 'SAVE_GLOBAL_SETTINGS'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FooterSettings;
