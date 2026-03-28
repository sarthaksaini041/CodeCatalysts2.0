import React, { useState } from 'react';
import { Edit2, Trash2, User, Users, GraduationCap, Link2, Info, Plus } from 'lucide-react';
import {
  SectionCard, FormModal, ConfirmModal, Field,
  AdmInput, AdmTextarea, TagInput, Accordion, IconBtn, AddButton
} from './AdminShared';

const emptyMember = () => ({
  id: 'm' + Date.now(), name: '', role: '', tagline: '',
  bio: '', techStack: [], linkedin: '#', github: '#',
});

const emptyRep = () => ({
  id: 'r' + Date.now(), name: '', university: '', role: '', tagline: '',
  bio: '', techStack: [], linkedin: '#', github: '#',
  members: [],
});

export default function AdminTeam({ leader, reps, onSaveLeader, onSaveReps }) {
  // Leader State
  const [leaderForm, setLeaderForm] = useState(leader);
  const [leaderModal, setLeaderModal] = useState(false);

  // Reps State
  const [repList, setRepList] = useState(reps);
  const [repModal, setRepModal] = useState(null); // { mode: 'add'|'edit', repIdx }
  const [repForm, setRepForm] = useState(emptyRep());

  // Members State (nested under Rep)
  const [memberModal, setMemberModal] = useState(null); // { repIdx, memberIdx, mode: 'add'|'edit' }
  const [memberForm, setMemberForm] = useState(emptyMember());

  // Confirm State
  const [confirm, setConfirm] = useState(null); // { type: 'rep'|'member', repIdx, memberIdx, id }

  // ── Leader Handlers ──
  const saveLeader = () => {
    onSaveLeader(leaderForm);
    setLeaderModal(false);
  };

  // ── Rep Handlers ──
  const openAddRep = () => {
    setRepForm(emptyRep());
    setRepModal({ mode: 'add' });
  };
  const openEditRep = (rep, idx) => {
    setRepForm({ ...rep });
    setRepModal({ mode: 'edit', repIdx: idx });
  };
  const saveRep = () => {
    let updated;
    if (repModal.mode === 'add') {
      updated = [...repList, { ...repForm, id: 'r' + Date.now() }];
    } else {
      updated = repList.map((r, i) => i === repModal.repIdx ? repForm : r);
    }
    setRepList(updated);
    onSaveReps(updated);
    setRepModal(null);
  };

  // ── Member Handlers ──
  const openAddMember = (repIdx) => {
    setMemberForm(emptyMember());
    setMemberModal({ repIdx, mode: 'add' });
  };
  const openEditMember = (repIdx, memberIdx, member) => {
    setMemberForm({ ...member });
    setMemberModal({ repIdx, memberIdx, mode: 'edit' });
  };
  const saveMember = () => {
    const updatedReps = [...repList];
    const rep = { ...updatedReps[memberModal.repIdx] };
    let updatedMembers;
    if (memberModal.mode === 'add') {
      updatedMembers = [...rep.members, { ...memberForm, id: 'm' + Date.now() }];
    } else {
      updatedMembers = rep.members.map((m, i) => i === memberModal.memberIdx ? memberForm : m);
    }
    rep.members = updatedMembers;
    updatedReps[memberModal.repIdx] = rep;
    setRepList(updatedReps);
    onSaveReps(updatedReps);
    setMemberModal(null);
  };

  // ── Delete Handlers ──
  const handleDeleteConfirm = () => {
    if (confirm.type === 'rep') {
      const updated = repList.filter((_, i) => i !== confirm.repIdx);
      setRepList(updated);
      onSaveReps(updated);
    } else {
      const updatedReps = [...repList];
      const rep = { ...updatedReps[confirm.repIdx] };
      rep.members = rep.members.filter((_, i) => i !== confirm.memberIdx);
      updatedReps[confirm.repIdx] = rep;
      setRepList(updatedReps);
      onSaveReps(updatedReps);
    }
    setConfirm(null);
  };

  return (
    <div className="adm-team-container">
      {/* ── LEADER SECTION ── */}
      <SectionCard
        title="Team Leader"
        subtitle="Manage the primary lead engineer / architect"
        action={<button className="adm-btn adm-btn--ghost" onClick={() => setLeaderModal(true)}><Edit2 size={14} /> Edit Leader</button>}
      >
        <div className="adm-leader-preview">
          <div className="adm-member-avatar">{leader.name.split(' ').map(n => n[0]).join('')}</div>
          <div className="adm-member-info">
            <h3 className="adm-member-name">{leader.name}</h3>
            <p className="adm-member-role">{leader.role} — <span className="adm-member-tagline">{leader.tagline}</span></p>
          </div>
        </div>
      </SectionCard>

      {/* ── REPS & MEMBERS SECTION ── */}
      <div style={{ marginTop: '2rem' }}>
        <SectionCard
          title="University Hubs"
          subtitle="Manage representatives and their nested hub members"
          action={<AddButton label="Add Rep / Hub" onClick={openAddRep} />}
        >
          {repList.length === 0 ? (
            <div className="adm-empty">No university hubs added yet.</div>
          ) : (
            repList.map((rep, rIdx) => (
              <Accordion
                key={rep.id}
                title={rep.university}
                badge={`${rep.members.length} members`}
                accent={rIdx % 2 === 0 ? 'var(--adm-cyan)' : 'var(--adm-purple)'}
              >
                <div className="adm-hub-content">
                  {/* Rep Header Card */}
                  <div className="adm-rep-header-card">
                    <div className="adm-member-preview">
                      <div className="adm-member-avatar" style={{ '--accent': rIdx % 2 === 0 ? 'var(--adm-cyan)' : 'var(--adm-purple)' }}>
                        {rep.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="adm-member-info">
                        <span className="adm-rep-label">Representative</span>
                        <h4 className="adm-member-name">{rep.name}</h4>
                        <p className="adm-member-role">{rep.role}</p>
                      </div>
                      <div className="adm-row-actions">
                        <IconBtn icon={Edit2} onClick={() => openEditRep(rep, rIdx)} title="Edit Rep" />
                        <IconBtn icon={Trash2} onClick={() => setConfirm({ type: 'rep', repIdx: rIdx })} title="Delete Hub" danger />
                      </div>
                    </div>
                  </div>

                  {/* Members Sub-list */}
                  <div className="adm-members-sublist">
                    <div className="adm-members-sublist-header">
                      <span className="adm-members-sublist-title"><Users size={14} /> Hub Members</span>
                      <button className="adm-text-btn" onClick={() => openAddMember(rIdx)}>
                        <Plus size={14} /> Add Member
                      </button>
                    </div>
                    {rep.members.length === 0 ? (
                      <div className="adm-sub-empty">No members in this hub.</div>
                    ) : (
                      <div className="adm-members-grid-mini">
                        {rep.members.map((m, mIdx) => (
                          <div key={m.id} className="adm-member-card-mini">
                            <div className="adm-member-avatar-mini">{m.name.split(' ').map(n => n[0]).join('')}</div>
                            <div className="adm-member-info-mini">
                              <span className="adm-member-name-mini">{m.name}</span>
                              <span className="adm-member-role-mini">{m.role}</span>
                            </div>
                            <div className="adm-mini-actions">
                              <button className="adm-mini-btn" onClick={() => openEditMember(rIdx, mIdx, m)}><Edit2 size={12} /></button>
                              <button className="adm-mini-btn adm-mini-btn--danger" onClick={() => setConfirm({ type: 'member', repIdx: rIdx, memberIdx: mIdx })}><Trash2 size={12} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Accordion>
            ))
          )}
        </SectionCard>
      </div>

      {/* ── LEADER MODAL ── */}
      <FormModal open={leaderModal} title="Edit Leader" onClose={() => setLeaderModal(false)} onSave={saveLeader}>
        <div className="adm-form-row2">
          <Field label="Name"><AdmInput value={leaderForm.name} onChange={v => setLeaderForm(f => ({ ...f, name: v }))} /></Field>
          <Field label="Role"><AdmInput value={leaderForm.role} onChange={v => setLeaderForm(f => ({ ...f, role: v }))} /></Field>
        </div>
        <Field label="Tagline"><AdmInput value={leaderForm.tagline} onChange={v => setLeaderForm(f => ({ ...f, tagline: v }))} /></Field>
        <Field label="Bio"><AdmTextarea value={leaderForm.bio} onChange={v => setLeaderForm(f => ({ ...f, bio: v }))} rows={4} /></Field>
        <Field label="Tech Stack"><TagInput tags={leaderForm.techStack} onChange={tags => setLeaderForm(f => ({ ...f, techStack: tags }))} /></Field>
        <div className="adm-form-row2">
          <Field label="LinkedIn"><AdmInput value={leaderForm.linkedin} onChange={v => setLeaderForm(f => ({ ...f, linkedin: v }))} /></Field>
          <Field label="GitHub"><AdmInput value={leaderForm.github} onChange={v => setLeaderForm(f => ({ ...f, github: v }))} /></Field>
        </div>
      </FormModal>

      {/* ── REP MODAL ── */}
      <FormModal open={!!repModal} title={repModal?.mode === 'add' ? 'Add Representative' : 'Edit Representative'} onClose={() => setRepModal(null)} onSave={saveRep}>
        <div className="adm-form-row2">
          <Field label="Name"><AdmInput value={repForm.name} onChange={v => setRepForm(f => ({ ...f, name: v }))} /></Field>
          <Field label="University"><AdmInput value={repForm.university} onChange={v => setRepForm(f => ({ ...f, university: v }))} /></Field>
        </div>
        <div className="adm-form-row2">
          <Field label="Role"><AdmInput value={repForm.role} onChange={v => setRepForm(f => ({ ...f, role: v }))} /></Field>
          <Field label="Tagline"><AdmInput value={repForm.tagline} onChange={v => setRepForm(f => ({ ...f, tagline: v }))} /></Field>
        </div>
        <Field label="Bio"><AdmTextarea value={repForm.bio} onChange={v => setRepForm(f => ({ ...f, bio: v }))} rows={3} /></Field>
        <Field label="Tech Stack"><TagInput tags={repForm.techStack} onChange={tags => setRepForm(f => ({ ...f, techStack: tags }))} /></Field>
        <div className="adm-form-row2">
          <Field label="LinkedIn"><AdmInput value={repForm.linkedin} onChange={v => setRepForm(f => ({ ...f, linkedin: v }))} /></Field>
          <Field label="GitHub"><AdmInput value={repForm.github} onChange={v => setRepForm(f => ({ ...f, github: v }))} /></Field>
        </div>
      </FormModal>

      {/* ── MEMBER MODAL ── */}
      <FormModal open={!!memberModal} title={memberModal?.mode === 'add' ? 'Add Hub Member' : 'Edit Hub Member'} onClose={() => setMemberModal(null)} onSave={saveMember}>
        <div className="adm-form-row2">
          <Field label="Name"><AdmInput value={memberForm.name} onChange={v => setMemberForm(f => ({ ...f, name: v }))} /></Field>
          <Field label="Role"><AdmInput value={memberForm.role} onChange={v => setMemberForm(f => ({ ...f, role: v }))} /></Field>
        </div>
        <Field label="Tagline"><AdmInput value={memberForm.tagline} onChange={v => setMemberForm(f => ({ ...f, tagline: v }))} /></Field>
        <Field label="Bio"><AdmTextarea value={memberForm.bio} onChange={v => setMemberForm(f => ({ ...f, bio: v }))} rows={3} /></Field>
        <Field label="Tech Stack"><TagInput tags={memberForm.techStack} onChange={tags => setMemberForm(f => ({ ...f, techStack: tags }))} /></Field>
        <div className="adm-form-row2">
          <Field label="LinkedIn"><AdmInput value={memberForm.linkedin} onChange={v => setMemberForm(f => ({ ...f, linkedin: v }))} /></Field>
          <Field label="GitHub"><AdmInput value={memberForm.github} onChange={v => setMemberForm(f => ({ ...f, github: v }))} /></Field>
        </div>
      </FormModal>

      {/* ── CONFIRM DELETE ── */}
      <ConfirmModal
        open={!!confirm}
        title={confirm?.type === 'rep' ? 'Delete Hub Representative' : 'Delete Member'}
        message={confirm?.type === 'rep' 
          ? `Are you sure you want to delete ${repList[confirm.repIdx]?.name} and the entire ${repList[confirm.repIdx]?.university} hub? This will also remove all ${repList[confirm.repIdx]?.members.length} members.`
          : 'Are you sure you want to remove this member from the hub?'
        }
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirm(null)}
      />

      <style>{`
        .adm-leader-preview { display: flex; align-items: center; gap: 1.25rem; }
        .adm-member-avatar { width: 56px; height: 56px; border-radius: 14px; background: rgba(0,212,255,0.1); border: 1px solid var(--accent, var(--adm-cyan)); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: 800; color: var(--accent, var(--adm-cyan)); flex-shrink: 0; box-shadow: 0 0 15px rgba(0,212,255,0.1); }
        .adm-member-info { flex: 1; }
        .adm-member-name { font-size: 1.1rem; font-weight: 800; color: #fff; margin: 0 0 2px; }
        .adm-member-role { font-size: 0.85rem; color: var(--adm-cyan); font-weight: 700; margin: 0; }
        .adm-member-tagline { color: rgba(255,255,255,0.4); font-weight: 400; }

        .adm-hub-content { padding: 1rem 0; }
        .adm-rep-header-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem; }
        .adm-rep-label { font-size: 0.6rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.25); display: block; margin-bottom: 4px; }
        .adm-member-preview { display: flex; align-items: center; gap: 1rem; }

        .adm-members-sublist { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.25rem; }
        .adm-members-sublist-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .adm-members-sublist-title { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.3); }
        .adm-text-btn { background: none; border: none; color: var(--adm-cyan); font-size: 0.8rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 4px; transition: background 0.2s; }
        .adm-text-btn:hover { background: rgba(0,212,255,0.08); }

        .adm-members-grid-mini { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; }
        .adm-member-card-mini { display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 8px 12px; position: relative; group; }
        .adm-member-avatar-mini { width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 800; color: rgba(255,255,255,0.6); }
        .adm-member-info-mini { flex: 1; min-width: 0; }
        .adm-member-name-mini { display: block; font-size: 0.85rem; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .adm-member-role-mini { display: block; font-size: 0.72rem; color: rgba(255,255,255,0.35); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        
        .adm-mini-actions { display: flex; gap: 4px; opacity: 0; transition: opacity 0.2s; }
        .adm-member-card-mini:hover .adm-mini-actions { opacity: 1; }
        .adm-mini-btn { width: 24px; height: 24px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.4); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
        .adm-mini-btn:hover { background: var(--adm-cyan); color: #000; border-color: var(--adm-cyan); }
        .adm-mini-btn--danger:hover { background: var(--adm-magenta); border-color: var(--adm-magenta); }
      `}</style>
    </div>
  );
}
