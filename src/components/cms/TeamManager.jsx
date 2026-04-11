import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../../lib/supabase-browser';
import { Plus, Trash2, ArrowUp, ArrowDown, Edit3, X, Users } from 'lucide-react';
import { LinkedInIcon, GitHubIcon } from '../icons/TechnicalIcons';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from './ImageUpload';
import { triggerRevalidation } from '../../utils/revalidate';

const TeamManager = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingMember, setEditingMember] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchTeamData = async () => {
        setLoading(true);
        const { data } = await supabase.from('team_members').select('*').order('order_index', { ascending: true }).order('name', { ascending: true });
        setMembers(data || []);
        setLoading(false);
    };

    useEffect(() => {
        if (editingMember) {
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
    }, [editingMember]);

    useEffect(() => {
        fetchTeamData();
    }, []);


    const filteredMembers = members.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.university?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categories = [
        { id: 'Lead', label: 'LEADERSHIP_CORE', roles: ['Lead'] },
        { id: 'Rep', label: 'REGIONAL_REPRESENTATIVES', roles: ['Rep'] },
        { id: 'Member', label: 'ASSOCIATE_MEMBERS', roles: ['Member'] }
    ];

    const getMembersByCategory = (roles) => {
        return filteredMembers.filter(m => roles.includes(m.role));
    };

    const handleSaveMember = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.target);
        
        const memberData = {
            name: formData.get('name'),
            role: formData.get('role'),
            university: formData.get('university'),
            tagline: formData.get('tagline'),
            bio: formData.get('bio'),
            image_url: editingMember.image_url, // Using state from ImageUpload
            linkedin: formData.get('linkedin'),
            github: formData.get('github'),
            order_index: editingMember?.id ? editingMember.order_index : members.length
        };

        if (editingMember?.id) {
            await supabase.from('team_members').update(memberData).eq('id', editingMember.id);
        } else {
            await supabase.from('team_members').insert(memberData);
        }

        setEditingMember(null);
        fetchTeamData();
        setIsSaving(false);
        // Trigger instant site refresh
        triggerRevalidation('/team');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this team member?')) return;
        await supabase.from('team_members').delete().eq('id', id);
        fetchTeamData();
        // Trigger instant site refresh
        triggerRevalidation('/team');
    };

    const moveMember = async (index, direction) => {
        const newMembers = [...members];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= members.length) return;
        [newMembers[index], newMembers[targetIndex]] = [newMembers[targetIndex], newMembers[index]];
        const updates = newMembers.map((m, idx) => ({ 
            id: m.id, 
            order_index: idx 
        }));
        await supabase.from('team_members').upsert(updates);
        fetchTeamData();
        // Trigger instant site refresh
        triggerRevalidation('/team');
    };

    if (loading) return <div className="flex justify-center p-20"><Users className="animate-spin text-indigo-500" size={32} /></div>;

    return (
        <div className="space-y-12 pb-20 text-left text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 px-2">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Personnel Database</h3>
                    </div>
                    <p className="text-[11px] text-white/20 font-bold uppercase tracking-widest">Managing units across GLA, IET & SRM technical hubs</p>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 group">
                        <input 
                            type="text" 
                            placeholder="OPERATOR SEARCH..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-3.5 text-[12px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all shadow-inner placeholder:text-white/10"
                        />
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-indigo-500 transition-colors">
                            <Users size={16} />
                        </div>
                    </div>
                    <button 
                        onClick={() => setEditingMember({ image_url: '', role: 'Member' })} 
                        className="flex items-center gap-3 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all whitespace-nowrap active:scale-95 group"
                    >
                        <Plus size={16} className="group-hover:rotate-90 transition-transform" /> Recruit Operator
                    </button>
                </div>
            </div>

            <div className="space-y-16">
                {categories.map(category => {
                    const categoryMembers = getMembersByCategory(category.roles);
                    if (categoryMembers.length === 0 && searchTerm) return null;
                    
                    return (
                        <div key={category.id} className="space-y-8">
                            <div className="flex items-center gap-6 px-2">
                                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] whitespace-nowrap">{category.label.replace('_', ' ')}</h4>
                                <div className="h-[1px] flex-1 bg-gradient-to-r from-white/5 to-transparent"></div>
                                <div className="px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full">
                                    <span className="text-[10px] font-black text-indigo-400/50">{categoryMembers.length} Units</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {categoryMembers.map((member) => {
                                    const realIndex = members.findIndex(m => m.id === member.id);
                                    return (
                                        <div key={member.id} className="group relative bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-[32px] p-6 hover:border-indigo-500/30 hover:bg-white/[0.05] transition-all duration-500 flex items-center gap-8 shadow-xl overflow-hidden">
                                            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full group-hover:bg-indigo-500/10 transition-colors" />
                                            
                                            <div className="w-20 h-20 rounded-full bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden flex-shrink-0 relative z-10 group-hover:scale-105 transition-transform duration-500 shadow-2xl">
                                                {member.image_url ? (
                                                    <img src={member.image_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Users size={28} className="text-white/10" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 relative z-10">
                                                <div className="flex items-center gap-4 mb-2">
                                                    <h4 className="text-[16px] font-black text-white uppercase tracking-widest truncate group-hover:text-indigo-400 transition-colors">{member.name}</h4>
                                                    <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest text-indigo-400">
                                                        {member.role === 'Rep' ? 'Regional Representative' : member.role}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] font-bold text-white/20 uppercase tracking-[0.1em]">{member.university}</p>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500 relative z-10">
                                                <div className="flex bg-black/40 backdrop-blur-xl rounded-2xl p-1.5 border border-white/5 shadow-2xl">
                                                    <button onClick={() => moveMember(realIndex, -1)} className="p-3 hover:bg-white/10 rounded-xl text-white/40 hover:text-indigo-400 transition-all" title="Sequence Up"><ArrowUp size={16} /></button>
                                                    <button onClick={() => moveMember(realIndex, 1)} className="p-3 hover:bg-white/10 rounded-xl text-white/40 hover:text-indigo-400 transition-all" title="Sequence Down"><ArrowDown size={16} /></button>
                                                    <div className="w-px h-8 bg-white/5 self-center mx-1" />
                                                    <button onClick={() => setEditingMember(member)} className="p-3 hover:bg-white/10 rounded-xl text-white/40 hover:text-indigo-400 transition-all" title="Modify"><Edit3 size={16} /></button>
                                                    <button onClick={() => handleDelete(member.id)} className="p-3 hover:bg-rose-500/10 rounded-xl text-white/40 hover:text-rose-400 transition-all" title="Purge"><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {categoryMembers.length === 0 && !searchTerm && (
                                    <div className="py-16 border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.01] flex flex-col items-center justify-center gap-4 group hover:bg-white/[0.02] transition-colors duration-500">
                                        <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center text-white/10 group-hover:text-indigo-500/50 transition-colors">
                                            <Users size={32} />
                                        </div>
                                        <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em]">No operators registered in this sector</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modals via Portals */}
            {createPortal(
                <AnimatePresence>
                    {editingMember && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 overflow-hidden">
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setEditingMember(null)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
                            />

                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 30 }} 
                                animate={{ opacity: 1, scale: 1, y: 0 }} 
                                exit={{ opacity: 0, scale: 0.95, y: 30 }} 
                                className="relative bg-black/40 border border-white/5 rounded-[40px] w-full max-w-4xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                            >
                                <form onSubmit={handleSaveMember} className="text-white">
                                    <div className="p-10 flex justify-between items-center border-b border-white/5 bg-white/[0.02]">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                                <Users size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black uppercase tracking-widest">{editingMember?.id ? 'Adjust Profile' : 'Recruit Member'}</h3>
                                                <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mt-1">Operator Deployment Protocols</p>
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => setEditingMember(null)} className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all flex items-center justify-center border border-white/5 group">
                                            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                                        </button>
                                    </div>

                                    <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-8">
                                            <ImageUpload 
                                                folder="team" 
                                                currentImageUrl={editingMember.image_url} 
                                                onUpload={(url) => setEditingMember(prev => prev ? { ...prev, image_url: url } : prev)}
                                                label="Operator Visual Proxy"
                                                aspect={1}
                                            />
                                            <div className="space-y-3 px-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Universal Name</label>
                                                <input 
                                                    name="name" 
                                                    defaultValue={editingMember.name} 
                                                    required 
                                                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-[13px] font-black uppercase tracking-widest focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/10" 
                                                    placeholder="Full Identity..." 
                                                />
                                            </div>
                                            <div className="space-y-3 px-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Rank / Designation</label>
                                                <div className="relative">
                                                    <select 
                                                        name="role" 
                                                        defaultValue={editingMember.role || 'Member'} 
                                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-[12px] font-black uppercase tracking-widest focus:outline-none focus:border-indigo-500/50 transition-all text-white/80 appearance-none cursor-pointer"
                                                    >
                                                        <option value="Lead">Lead Strategist</option>
                                                        <option value="Rep">Regional Envoy</option>
                                                        <option value="Member">Associate Unit</option>
                                                    </select>
                                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                                                        <ArrowDown size={14} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="space-y-3 px-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Operational Hub (University)</label>
                                                <input name="university" defaultValue={editingMember.university} className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-[13px] font-black uppercase tracking-widest focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/10" placeholder="GLA_SYSTEM, SRM_NODE, etc." />
                                            </div>
                                            <div className="space-y-3 px-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Mission Tagline</label>
                                                <input name="tagline" defaultValue={editingMember.tagline} className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-[13px] font-black uppercase tracking-widest focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/10" placeholder="Core philosophy..." />
                                            </div>
                                            <div className="space-y-3 px-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Operational Dossier (Bio)</label>
                                                <textarea name="bio" defaultValue={editingMember.bio} rows={3} className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-5 text-[14px] font-bold tracking-tight focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white/60 placeholder:text-white/10 resize-none leading-relaxed" placeholder="Detailed operator specs..." />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 px-2">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Comm Link (LinkedIn)</label>
                                                    <div className="relative">
                                                        <input name="linkedin" defaultValue={editingMember.linkedin} className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 pl-12 text-[12px] font-bold tracking-widest focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white/60 placeholder:text-white/10" placeholder="#" />
                                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                                                            <LinkedInIcon size={14} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Source Link (GitHub)</label>
                                                    <div className="relative">
                                                        <input name="github" defaultValue={editingMember.github} className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 pl-12 text-[12px] font-bold tracking-widest focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all text-white/60 placeholder:text-white/10" placeholder="#" />
                                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                                                            <GitHubIcon size={14} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-10 bg-white/[0.02] border-t border-white/5 flex gap-6 mt-4">
                                        <button type="button" onClick={() => setEditingMember(null)} className="flex-1 py-4.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white/40 transition-all active:scale-95">Abstain</button>
                                        <button 
                                            type="submit" 
                                            disabled={isSaving} 
                                            className="flex-[2] py-4.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:bg-indigo-500 hover:shadow-[0_0_60px_rgba(79,70,229,0.5)] transition-all active:scale-95 disabled:opacity-50 transform hover:-translate-y-1"
                                        >
                                            {isSaving ? 'Synching...' : (editingMember?.id ? 'COMMIT DOSSIER' : 'RECRUIT OPERATOR')}
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

export default TeamManager;
