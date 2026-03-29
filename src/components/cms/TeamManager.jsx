import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { Plus, Trash2, ArrowUp, ArrowDown, Edit3, X, Users } from 'lucide-react';
import { LinkedInIcon, GitHubIcon } from '../icons/TechnicalIcons';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from './ImageUpload';

const TeamManager = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingMember, setEditingMember] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTeamData();
    }, []);

    const fetchTeamData = async () => {
        setLoading(true);
        const { data } = await supabase.from('team_members').select('*').order('order_index', { ascending: true }).order('name', { ascending: true });
        setMembers(data || []);
        setLoading(false);
    };

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
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this team member?')) return;
        await supabase.from('team_members').delete().eq('id', id);
        fetchTeamData();
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
    };

    if (loading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-2">
                <div className="space-y-1">
                    <h3 className="text-xs font-black uppercase tracking-widest text-primary">TEAM_REPOSITORY</h3>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">Manage members across GLA, IET & SRM hubs</p>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <input 
                            type="text" 
                            placeholder="SEARCH_MEMBERS..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-primary/50 transition-all"
                        />
                    </div>
                    <button onClick={() => setEditingMember({ image_url: '', role: 'Member' })} className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-white whitespace-nowrap">
                        <Plus size={14} /> RECRUIT
                    </button>
                </div>
            </div>

            <div className="space-y-12">
                {categories.map(category => {
                    const categoryMembers = getMembersByCategory(category.roles);
                    if (categoryMembers.length === 0 && searchTerm) return null;
                    
                    return (
                        <div key={category.id} className="space-y-6">
                            <div className="flex items-center gap-4 px-2">
                                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] whitespace-nowrap">{category.label}</h4>
                                <div className="h-[1px] w-full bg-white/5"></div>
                                <span className="text-[10px] font-black text-primary/40">{categoryMembers.length}</span>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {categoryMembers.map((member) => {
                                    const realIndex = members.findIndex(m => m.id === member.id);
                                    return (
                                        <div key={member.id} className="group relative bg-white/[0.02] border border-white/5 rounded-[24px] p-6 hover:bg-white/[0.04] transition-all flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                {member.image_url ? (
                                                    <img src={member.image_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Users size={24} className="text-primary" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="text-sm font-black text-white truncate">{member.name}</h4>
                                                    <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-full text-[8px] font-black uppercase text-primary">{member.role === 'Rep' ? 'Representative' : member.role}</span>
                                                </div>
                                                <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">{member.university}</p>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <button onClick={() => moveMember(realIndex, -1)} className="p-2 hover:text-primary transition-colors text-white/20 hover:scale-110"><ArrowUp size={16} /></button>
                                                <button onClick={() => moveMember(realIndex, 1)} className="p-2 hover:text-primary transition-colors text-white/20 hover:scale-110"><ArrowDown size={16} /></button>
                                                <button onClick={() => setEditingMember(member)} className="p-2 hover:text-primary transition-colors text-white/20 hover:scale-110"><Edit3 size={16} /></button>
                                                <button onClick={() => handleDelete(member.id)} className="p-2 hover:text-red-500 transition-colors text-white/20 hover:scale-110"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    );
                                })}
                                {categoryMembers.length === 0 && !searchTerm && (
                                    <div className="py-8 border border-dashed border-white/5 rounded-[24px] flex flex-col items-center justify-center gap-3 opacity-30">
                                        <Users size={24} />
                                        <p className="text-[8px] font-black uppercase tracking-widest">NO_MEMBERS_IN_SECTION</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <AnimatePresence>
                {editingMember && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-[#050505]/80 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0a0a0a] border border-white/10 rounded-[32px] w-full max-w-2xl p-8 shadow-2xl maxHeight-[90vh] overflow-y-auto">
                            <form onSubmit={handleSaveMember} className="space-y-6 text-white">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-primary">EDIT_MEMBER_PROFILE</h3>
                                    <button type="button" onClick={() => setEditingMember(null)} className="text-white/20 hover:text-white"><X size={20} /></button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <ImageUpload 
                                            folder="team" 
                                            currentImageUrl={editingMember.image_url} 
                                            onUpload={(url) => setEditingMember(prev => ({ ...prev, image_url: url }))}
                                            label="PROFILE_PICTURE"
                                        />
                                        <div className="space-y-1 text-left">
                                            <label className="text-[10px] font-black uppercase tracking-wider text-white/30 ml-2">Full Name</label>
                                            <input name="name" defaultValue={editingMember.name} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-white" />
                                        </div>
                                        <div className="space-y-1 text-left">
                                            <label className="text-[10px] font-black uppercase tracking-wider text-white/30 ml-2">Role</label>
                                            <select name="role" defaultValue={editingMember.role || 'Member'} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-white appearance-none">
                                                <option value="Lead" className="bg-[#0a0a0a]">Lead</option>
                                                <option value="Rep" className="bg-[#0a0a0a]">Representative</option>
                                                <option value="Member" className="bg-[#0a0a0a]">Member</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-1 text-left">
                                            <label className="text-[10px] font-black uppercase tracking-wider text-white/30 ml-2">University</label>
                                            <input name="university" defaultValue={editingMember.university} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-white" placeholder="GLA UNIVERSITY" />
                                        </div>
                                        <div className="space-y-1 text-left">
                                            <label className="text-[10px] font-black uppercase tracking-wider text-white/30 ml-2">Tagline</label>
                                            <input name="tagline" defaultValue={editingMember.tagline} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-white" />
                                        </div>
                                        <div className="space-y-1 text-left">
                                            <label className="text-[10px] font-black uppercase tracking-wider text-white/30 ml-2">Bio</label>
                                            <textarea name="bio" defaultValue={editingMember.bio} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-white" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1 text-left">
                                                <label className="text-[10px] font-black uppercase tracking-wider text-white/30 ml-2">LinkedIn URL</label>
                                                <input name="linkedin" defaultValue={editingMember.linkedin} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-white" placeholder="#" />
                                            </div>
                                            <div className="space-y-1 text-left">
                                                <label className="text-[10px] font-black uppercase tracking-wider text-white/30 ml-2">GitHub URL</label>
                                                <input name="github" defaultValue={editingMember.github} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-white" placeholder="#" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4 text-white">
                                    <button type="button" onClick={() => setEditingMember(null)} className="flex-1 py-4 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all text-white">CANCEL</button>
                                    <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-primary text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all font-bold">SAVE_PROFILE</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeamManager;
