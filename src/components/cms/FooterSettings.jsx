import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase-browser';
import { Save, Mail, Info, Users } from 'lucide-react';
import { LinkedInIcon, GitHubIcon, InstagramIcon } from '../icons/TechnicalIcons';

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
        alert('Settings saved successfully!');
    };

    if (loading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;

    return (
        <div className="max-w-4xl space-y-12 pb-20 text-left">
            <div className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm">
                <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-8">
                    <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <Info size={24} className="text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Footer Configuration</h3>
                        <p className="text-xs text-slate-400 font-medium">Global brand identity & social hooks</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Footer Brand Text</label>
                                <textarea 
                                    value={settings.footer_text} 
                                    onChange={(e) => setSettings({...settings, footer_text: e.target.value})}
                                    rows={3}
                                    className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all text-slate-900"
                                    placeholder="Enter brand description..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Footer Tagline</label>
                                <input 
                                    value={settings.tagline} 
                                    onChange={(e) => setSettings({...settings, tagline: e.target.value})}
                                    className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all text-slate-900"
                                    placeholder="Enter tagline..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Copyright Text</label>
                                <input 
                                    value={copyright} 
                                    onChange={(e) => setCopyright(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all text-slate-900"
                                    placeholder="e.g. © 2024 Code Catalysts"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 px-1">Connect Channels</h4>
                            <div className="space-y-4">
                                <div className="group relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors"><Mail size={18} /></div>
                                    <input 
                                        value={settings.email} 
                                        onChange={(e) => setSettings({...settings, email: e.target.value})}
                                        placeholder="Contact Email"
                                        className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-5 py-4 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all text-slate-900 shadow-sm"
                                    />
                                </div>
                                <div className="group relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors"><LinkedInIcon size={18} /></div>
                                    <input 
                                        value={settings.linkedin_url} 
                                        onChange={(e) => setSettings({...settings, linkedin_url: e.target.value})}
                                        placeholder="LinkedIn URL"
                                        className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-5 py-4 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all text-slate-900 shadow-sm"
                                    />
                                </div>
                                <div className="group relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors"><InstagramIcon size={18} /></div>
                                    <input 
                                        value={settings.instagram_url} 
                                        onChange={(e) => setSettings({...settings, instagram_url: e.target.value})}
                                        placeholder="Instagram URL"
                                        className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-5 py-4 text-sm font-semibold focus:outline-none focus:border-rose-500 transition-all text-slate-900 shadow-sm"
                                    />
                                </div>
                                <div className="group relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-500 transition-colors"><Users size={18} /></div>
                                    <input 
                                        value={settings.community_url} 
                                        onChange={(e) => setSettings({...settings, community_url: e.target.value})}
                                        placeholder="Community URL"
                                        className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-5 py-4 text-sm font-semibold focus:outline-none focus:border-purple-500 transition-all text-slate-900 shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100">
                        <button 
                            type="submit" 
                            disabled={isSaving}
                            className="w-full py-4 bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
                        >
                            {isSaving ? 'Saving Changes...' : 'Save Settings'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FooterSettings;
