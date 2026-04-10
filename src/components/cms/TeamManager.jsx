import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../../lib/supabase-browser';
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

    if (loading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;

    return (
        <div className="space-y-8 pb-20 text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-1">
                <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900">Team Repository</h3>
                    <p className="text-xs text-slate-400 font-medium">Manage members across GLA, IET & SRM hubs</p>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-72">
                        <input 
                            type="text" 
                            placeholder="Search members..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 transition-all shadow-sm"
                        />
                    </div>
                    <button onClick={() => setEditingMember({ image_url: '', role: 'Member' })} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all whitespace-nowrap">
                        <Plus size={16} /> Add Member
                    </button>
                </div>
            </div>

            <div className="space-y-10">
                {categories.map(category => {
                    const categoryMembers = getMembersByCategory(category.roles);
                    if (categoryMembers.length === 0 && searchTerm) return null;
                    
                    return (
                        <div key={category.id} className="space-y-4">
                            <div className="flex items-center gap-4 px-1">
                                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{category.label.replace('_', ' ')}</h4>
                                <div className="h-[1px] w-full bg-slate-100"></div>
                                <span className="text-xs font-bold text-indigo-600/50">{categoryMembers.length}</span>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {categoryMembers.map((member) => {
                                    const realIndex = members.findIndex(m => m.id === member.id);
                                    return (
                                        <div key={member.id} className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-md transition-all flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                {member.image_url ? (
                                                    <img src={member.image_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Users size={24} className="text-slate-300" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="text-sm font-bold text-slate-900 truncate">{member.name}</h4>
                                                    <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded-full text-[9px] font-bold uppercase text-indigo-600">{member.role === 'Rep' ? 'Representative' : member.role}</span>
                                                </div>
                                                <p className="text-xs text-slate-400 font-medium">{member.university}</p>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                <button onClick={() => moveMember(realIndex, -1)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all" title="Move Up"><ArrowUp size={16} /></button>
                                                <button onClick={() => moveMember(realIndex, 1)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all" title="Move Down"><ArrowDown size={16} /></button>
                                                <button onClick={() => setEditingMember(member)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all" title="Edit"><Edit3 size={16} /></button>
                                                <button onClick={() => handleDelete(member.id)} className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-all" title="Delete"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    );
                                })}
                                {categoryMembers.length === 0 && !searchTerm && (
                                    <div className="py-10 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-3">
                                        <Users size={32} className="text-slate-200" />
                                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No members found in this section</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modals */}
            {createPortal(
                <AnimatePresence>
                    {editingMember && (
                        <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-900/20 backdrop-blur-sm">
                            <div className="min-h-full flex items-center justify-center p-4 md:p-6">
                                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white border border-slate-200 rounded-[32px] w-full max-w-2xl p-8 shadow-2xl relative my-8">
                                <form onSubmit={handleSaveMember} className="space-y-6 text-slate-900">
                                    <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                                        <h3 className="text-lg font-bold text-slate-900">{editingMember?.id ? 'Edit Member Profile' : 'Add New Member'}</h3>
                                        <button type="button" onClick={() => setEditingMember(null)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-2 rounded-xl transition-all"><X size={20} /></button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <ImageUpload 
                                                folder="team" 
                                                currentImageUrl={editingMember.image_url} 
                                                onUpload={(url) => setEditingMember(prev => prev ? { ...prev, image_url: url } : prev)}
                                                label="Profile Photo"
                                                aspect={1}
                                            />
                                            <div className="space-y-2 text-left">
                                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Full Name</label>
                                                <input name="name" defaultValue={editingMember.name} required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all text-slate-900" placeholder="e.g. John Doe" />
                                            </div>
                                            <div className="space-y-2 text-left">
                                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Role</label>
                                                <select name="role" defaultValue={editingMember.role || 'Member'} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-indigo-500 transition-all text-slate-700 appearance-none shadow-sm">
                                                    <option value="Lead">Lead</option>
                                                    <option value="Rep">Representative</option>
                                                    <option value="Member">Member</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-2 text-left">
                                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">University</label>
                                                <input name="university" defaultValue={editingMember.university} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all text-slate-900" placeholder="e.g. GLA UNIVERSITY" />
                                            </div>
                                            <div className="space-y-2 text-left">
                                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Tagline</label>
                                                <input name="tagline" defaultValue={editingMember.tagline} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all text-slate-900" placeholder="e.g. Building the future" />
                                            </div>
                                            <div className="space-y-2 text-left">
                                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Bio</label>
                                                <textarea name="bio" defaultValue={editingMember.bio} rows={3} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all text-slate-900" placeholder="A short bio..." />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-2 text-left">
                                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">LinkedIn</label>
                                                    <input name="linkedin" defaultValue={editingMember.linkedin} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all text-slate-900" placeholder="#" />
                                                </div>
                                                <div className="space-y-2 text-left">
                                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">GitHub</label>
                                                    <input name="github" defaultValue={editingMember.github} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all text-slate-900" placeholder="#" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pt-6 mt-4 border-t border-slate-100">
                                        <button type="button" onClick={() => setEditingMember(null)} className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                                        <button type="submit" disabled={isSaving} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                                            {editingMember?.id ? 'Save Changes' : 'Add Member'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export default TeamManager;
