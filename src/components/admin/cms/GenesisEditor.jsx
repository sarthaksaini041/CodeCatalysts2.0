import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import AdminCard from '../shared/AdminCard';
import AdminInput from '../shared/AdminInput';
import AdminButton from '../shared/AdminButton';
import { fetchTableData, saveTableItem, triggerRevalidation } from '../../../services/admin';

const SLOT_LABELS = ['Slot 1', 'Slot 2', 'Slot 3', 'Slot 4'];

const GenesisEditor = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchTableData('chapter1_items');
        const mapped = SLOT_LABELS.map((_, idx) => {
          const existing = data.find((item) => item.order_index === idx);
          return existing || { title: '', meta: '', description: '', order_index: idx };
        });
        setItems(mapped);
      } catch (err) {
        console.error('Failed to load genesis data:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (index, field, value) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all(items.map((item) => saveTableItem('chapter1_items', item)));
      triggerRevalidation('/');
      alert('Genesis section saved successfully.');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Genesis Content</h3>
          <p className="text-xs text-slate-400 mt-0.5">Manage the 4 content slots</p>
        </div>
        <AdminButton onClick={handleSave} loading={saving}>
          <Save size={14} /> Save All
        </AdminButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, index) => (
          <AdminCard key={index} title={`${SLOT_LABELS[index]}`}>
            <div className="space-y-4">
              <AdminInput
                label="Title"
                value={item.title || ''}
                onChange={(e) => handleChange(index, 'title', e.target.value)}
                placeholder="Title text"
              />
              <AdminInput
                label="Description"
                type="textarea"
                rows={3}
                value={item.description || ''}
                onChange={(e) => handleChange(index, 'description', e.target.value)}
                placeholder="Content description"
              />
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
};

export default GenesisEditor;
