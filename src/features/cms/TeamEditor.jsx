/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Edit3, Trash2, ArrowUp, ArrowDown, Users, Crown, Shield, User } from 'lucide-react';
import AdminInput from '@/features/admin/shared/AdminInput';
import AdminButton from '@/features/admin/shared/AdminButton';
import AdminModal from '@/features/admin/shared/AdminModal';
import ImageUploader from './ImageUploader';
import { supabase } from '@/core/lib/supabase-browser';
import { triggerRevalidation } from '@/core/services/admin';

const ROLES = [
  { value: 'Lead', label: 'Leader', icon: Crown, color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'Rep', label: 'Representative', icon: Shield, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { value: 'Member', label: 'Member', icon: User, color: 'bg-slate-50 text-slate-600 border-slate-200' },
];

const ROLE_OPTIONS = [
  { value: 'Lead', label: 'Leader' },
  { value: 'Rep', label: 'Representative' },
  { value: 'Member', label: 'Member' },
];

const getRoleConfig = (role) => ROLES.find((r) => r.value === role) || ROLES[2];

const TeamEditor = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});

  const loadData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order_index', { ascending: true })
        .order('name', { ascending: true });
      if (error) throw error;
      setMembers(data || []);
    } catch (err) {
      console.error('Failed to load team data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // Group members by role
  const groupedMembers = useMemo(() => {
    const groups = {};
    ROLES.forEach((role) => {
      groups[role.value] = members.filter((m) => m.role === role.value);
    });
    // Catch any members without a valid role
    const unassigned = members.filter((m) => !ROLES.some((r) => r.value === m.role));
    if (unassigned.length > 0) {
      groups['Unassigned'] = unassigned;
    }
    return groups;
  }, [members]);

  const openModal = (member = null) => {
    setFormData(
      member || {
        name: '',
        role: 'Member',
        department: '',
        bio: '',
        image_url: '',
        linkedin: '',
        github: '',
        instagram: '',
      }
    );
    setEditing(member || {});
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        order_index: editing?.id ? editing.order_index : members.length,
      };

      if (editing?.id) {
        const { id, created_at, ...updateData } = payload;
        const { error } = await supabase.from('team_members').update(updateData).eq('id', id);
        if (error) throw error;
      } else {
        const { id, created_at, ...insertData } = payload;
        const { error } = await supabase.from('team_members').insert(insertData);
        if (error) throw error;
      }

      triggerRevalidation('/team');
      triggerRevalidation('/');
      setEditing(null);
      loadData();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this team member?')) return;
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) { alert('Error: ' + error.message); return; }
    triggerRevalidation('/team');
    triggerRevalidation('/');
    loadData();
  };

  const moveItem = async (index, direction) => {
    const arr = [...members];
    const target = index + direction;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    const updates = arr.map((m, idx) => ({ ...m, order_index: idx }));
    await supabase.from('team_members').upsert(updates);
    triggerRevalidation('/team');
    loadData();
  };

  // Get flat index for a member in the full array (for move operations)
  const getMemberIndex = (memberId) => members.findIndex((m) => m.id === memberId);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Team Members</h3>
          <p className="text-xs text-slate-400 mt-0.5">{members.length} members</p>
        </div>
        <AdminButton variant="outline" size="sm" onClick={() => openModal()}>
          <Plus size={14} /> Add Member
        </AdminButton>
      </div>

      {/* Grouped by role */}
      {ROLES.map((roleConfig) => {
        const roleMembers = groupedMembers[roleConfig.value] || [];
        if (roleMembers.length === 0) return null;

        const RoleIcon = roleConfig.icon;

        return (
          <div key={roleConfig.value} className="space-y-3">
            {/* Role section header */}
            <div className="flex items-center gap-2.5 px-1">
              <div className={`w-7 h-7 rounded-md flex items-center justify-center border ${roleConfig.color}`}>
                <RoleIcon size={14} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">{roleConfig.label}s</h4>
                <p className="text-[11px] text-slate-400">{roleMembers.length} {roleMembers.length === 1 ? 'member' : 'members'}</p>
              </div>
            </div>

            {/* Members grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {roleMembers.map((member) => {
                const idx = getMemberIndex(member.id);
                return (
                  <div key={member.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm group hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-200">
                        {member.image_url ? (
                          <img src={member.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Users size={16} className="text-indigo-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{member.name}</p>
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium border ${roleConfig.color}`}>
                          {roleConfig.label}
                        </span>
                      </div>
                    </div>
                    {member.department && (
                      <span className="inline-flex px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[11px] font-medium">
                        {member.department}
                      </span>
                    )}
                    <div className="flex items-center justify-end gap-0.5 mt-3 pt-3 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => moveItem(idx, -1)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400"><ArrowUp size={14} /></button>
                      <button onClick={() => moveItem(idx, 1)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400"><ArrowDown size={14} /></button>
                      <button onClick={() => openModal(member)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400"><Edit3 size={14} /></button>
                      <button onClick={() => handleDelete(member.id)} className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Unassigned members */}
      {groupedMembers['Unassigned'] && groupedMembers['Unassigned'].length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-7 h-7 rounded-md flex items-center justify-center border bg-red-50 text-red-500 border-red-200">
              <Users size={14} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Unassigned Role</h4>
              <p className="text-[11px] text-red-400">These members need a role assigned</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {groupedMembers['Unassigned'].map((member) => {
              const idx = getMemberIndex(member.id);
              return (
                <div key={member.id} className="bg-white border border-red-200 rounded-lg p-4 shadow-sm group hover:border-red-300 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-red-200">
                      {member.image_url ? (
                        <img src={member.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Users size={16} className="text-red-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{member.name}</p>
                      <span className="text-xs text-red-400">No role | {member.role || 'empty'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-0.5 mt-3 pt-3 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openModal(member)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400"><Edit3 size={14} /></button>
                    <button onClick={() => handleDelete(member.id)} className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AdminModal
        isOpen={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'Edit Member' : 'Add Member'}
        maxWidth="max-w-xl"
        footer={
          <>
            <AdminButton variant="outline" size="sm" onClick={() => setEditing(null)}>Cancel</AdminButton>
            <AdminButton size="sm" onClick={handleSave} loading={saving}>Save</AdminButton>
          </>
        }
      >
        <div className="space-y-4">
          <ImageUploader
            folder="team"
            currentImageUrl={formData.image_url}
            onUpload={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
            label="Profile Photo"
            variant="circle"
          />
          <div className="grid grid-cols-2 gap-4">
            <AdminInput label="Name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            <AdminInput
              label="Role"
              type="select"
              value={formData.role || 'Member'}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              options={ROLE_OPTIONS}
            />
          </div>
          <AdminInput label="Department" value={formData.department || ''} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="e.g. Engineering" />
          <AdminInput label="Bio" type="textarea" rows={3} value={formData.bio || ''} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AdminInput label="LinkedIn" value={formData.linkedin || ''} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} placeholder="URL" />
            <AdminInput label="GitHub" value={formData.github || ''} onChange={(e) => setFormData({ ...formData, github: e.target.value })} placeholder="URL" />
            <AdminInput label="Instagram" value={formData.instagram || ''} onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} placeholder="URL" />
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

export default TeamEditor;
