import React, { useState, useEffect } from 'react';
import { Plus, Save, Edit3, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import AdminCard from '../shared/AdminCard';
import AdminInput from '../shared/AdminInput';
import AdminButton from '../shared/AdminButton';
import AdminModal from '../shared/AdminModal';
import {
  fetchTableData,
  saveTableItem,
  deleteTableItem,
  reorderTableItems,
  fetchSiteContent,
  saveSiteContent,
  triggerRevalidation,
} from '../../../services/admin';

const ShiftEditor = () => {
  const [cards, setCards] = useState([]);
  const [stats, setStats] = useState([]);
  const [chapterTitle, setChapterTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal state
  const [editingCard, setEditingCard] = useState(null);
  const [editingStat, setEditingStat] = useState(null);
  const [formData, setFormData] = useState({});

  const loadData = async () => {
    setLoading(true);
    try {
      const [cardsData, statsData, titleData] = await Promise.all([
        fetchTableData('chapter2_cards'),
        fetchTableData('chapter2_stats'),
        fetchSiteContent(['chapter2_title']),
      ]);
      setCards(cardsData);
      setStats(statsData);
      setChapterTitle(titleData.chapter2_title || 'THE SHIFT');
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSaveTitle = async () => {
    setSaving(true);
    await saveSiteContent({ chapter2_title: chapterTitle });
    triggerRevalidation('/');
    setSaving(false);
  };

  // Card CRUD
  const openCardModal = (card = null) => {
    setFormData(card || { title: '' });
    setEditingCard(card || {});
  };

  const handleSaveCard = async () => {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        order_index: editingCard?.id ? editingCard.order_index : cards.length,
      };
      if (editingCard?.id) payload.id = editingCard.id;
      await saveTableItem('chapter2_cards', payload);
      triggerRevalidation('/');
      setEditingCard(null);
      loadData();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCard = async (id) => {
    if (!window.confirm('Delete this card?')) return;
    await deleteTableItem('chapter2_cards', id);
    triggerRevalidation('/');
    loadData();
  };

  const moveCard = async (index, direction) => {
    const arr = [...cards];
    const target = index + direction;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    await reorderTableItems('chapter2_cards', arr);
    triggerRevalidation('/');
    loadData();
  };

  // Stat CRUD
  const openStatModal = (stat = null) => {
    setFormData(stat || { value: '', label: '' });
    setEditingStat(stat || {});
  };

  const handleSaveStat = async () => {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        order_index: editingStat?.id ? editingStat.order_index : stats.length,
      };
      if (editingStat?.id) payload.id = editingStat.id;
      await saveTableItem('chapter2_stats', payload);
      triggerRevalidation('/');
      setEditingStat(null);
      loadData();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStat = async (id) => {
    if (!window.confirm('Delete this stat?')) return;
    await deleteTableItem('chapter2_stats', id);
    triggerRevalidation('/');
    loadData();
  };

  const moveStat = async (index, direction) => {
    const arr = [...stats];
    const target = index + direction;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    await reorderTableItems('chapter2_stats', arr);
    triggerRevalidation('/');
    loadData();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Title */}
      <AdminCard title="Section Title">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <AdminInput
              label="Chapter Title"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
            />
          </div>
          <AdminButton onClick={handleSaveTitle} loading={saving} size="md">
            Update
          </AdminButton>
        </div>
      </AdminCard>

      {/* Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Cards</h3>
          <AdminButton variant="outline" size="sm" onClick={() => openCardModal()}>
            <Plus size={14} /> Add Card
          </AdminButton>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cards.map((card, i) => (
            <div
              key={card.id}
              className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-4 shadow-sm group hover:border-slate-300 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{card.title}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => moveCard(i, -1)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400" title="Move up"><ArrowUp size={14} /></button>
                <button onClick={() => moveCard(i, 1)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400" title="Move down"><ArrowDown size={14} /></button>
                <button onClick={() => openCardModal(card)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400" title="Edit"><Edit3 size={14} /></button>
                <button onClick={() => handleDeleteCard(card.id)} className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-500" title="Delete"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Stats</h3>
          <AdminButton variant="outline" size="sm" onClick={() => openStatModal()}>
            <Plus size={14} /> Add Stat
          </AdminButton>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat, i) => (
            <div
              key={stat.id}
              className="bg-white border border-slate-200 rounded-lg p-4 text-center group hover:border-slate-300 transition-colors shadow-sm relative"
            >
              <p className="text-xl font-bold text-slate-900 tabular-nums">{stat.value}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">{stat.label}</p>
              <div className="absolute top-2 right-2 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => moveStat(i, -1)} className="p-1 rounded hover:bg-slate-100 text-slate-400"><ArrowUp size={12} /></button>
                <button onClick={() => moveStat(i, 1)} className="p-1 rounded hover:bg-slate-100 text-slate-400"><ArrowDown size={12} /></button>
                <button onClick={() => openStatModal(stat)} className="p-1 rounded hover:bg-slate-100 text-slate-400"><Edit3 size={12} /></button>
                <button onClick={() => handleDeleteStat(stat.id)} className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card Modal */}
      <AdminModal
        isOpen={!!editingCard}
        onClose={() => setEditingCard(null)}
        title={editingCard?.id ? 'Edit Card' : 'Add Card'}
        footer={
          <>
            <AdminButton variant="outline" size="sm" onClick={() => setEditingCard(null)}>Cancel</AdminButton>
            <AdminButton size="sm" onClick={handleSaveCard} loading={saving}>Save</AdminButton>
          </>
        }
      >
        <div className="space-y-4">
          <AdminInput label="Title" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
        </div>
      </AdminModal>

      {/* Stat Modal */}
      <AdminModal
        isOpen={!!editingStat}
        onClose={() => setEditingStat(null)}
        title={editingStat?.id ? 'Edit Stat' : 'Add Stat'}
        footer={
          <>
            <AdminButton variant="outline" size="sm" onClick={() => setEditingStat(null)}>Cancel</AdminButton>
            <AdminButton size="sm" onClick={handleSaveStat} loading={saving}>Save</AdminButton>
          </>
        }
      >
        <div className="space-y-4">
          <AdminInput label="Value" value={formData.value || ''} onChange={(e) => setFormData({ ...formData, value: e.target.value })} required placeholder="e.g. 500+" />
          <AdminInput label="Label" value={formData.label || ''} onChange={(e) => setFormData({ ...formData, label: e.target.value })} required placeholder="e.g. Projects" />
        </div>
      </AdminModal>
    </div>
  );
};

export default ShiftEditor;
