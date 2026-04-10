import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase-browser';
import { Save, Info } from 'lucide-react';

const ArchitectsManager = () => {
    const [loading, setLoading] = useState(true);
    const [chapterTitle, setChapterTitle] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const fetchArchitectsData = async () => {
        setLoading(true);
        const { data: titleData } = await supabase.from('site_content').select('*').eq('key', 'chapter5_title').maybeSingle();
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
        alert('Title updated successfully!');
    };

    if (loading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;

    return (
        <div className="max-w-4xl space-y-10 pb-20 text-left">
            <div className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm">
                <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-8">
                    <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <Info size={24} className="text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Network Section Settings</h3>
                        <p className="text-xs text-slate-400 font-medium">Manage the display title for Chapter 05</p>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Chapter Display Title</label>
                        <div className="flex gap-4">
                            <input 
                                value={chapterTitle} 
                                onChange={(e) => setChapterTitle(e.target.value)} 
                                className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all text-slate-900 shadow-sm" 
                                placeholder="e.g. THE NETWORK"
                            />
                            <button 
                                onClick={handleSaveTitle} 
                                disabled={isSaving}
                                className="px-8 bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 flex items-center gap-2"
                            >
                                <Save size={16} />
                                {isSaving ? 'Saving...' : 'Save Title'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                            <Info size={14} className="text-indigo-400" />
                            The member list for this section is automatically synced from the <strong>Team Members</strong> tab.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArchitectsManager;
