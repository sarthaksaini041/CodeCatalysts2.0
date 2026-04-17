import React, { useState, useEffect } from 'react';
import AdminCard from '../shared/AdminCard';
import AdminInput from '../shared/AdminInput';
import AdminButton from '../shared/AdminButton';
import { fetchSiteContent, saveSiteContent, triggerRevalidation } from '../../../services/admin';

const ArchitectsEditor = () => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchSiteContent(['chapter5_title']);
      setTitle(data.chapter5_title || 'ARCHITECTS');
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSiteContent({ chapter5_title: title });
      triggerRevalidation('/');
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
    <div className="space-y-6 max-w-2xl">
      <AdminCard 
        title="Architects Section Settings" 
        description="Configure how the Architects section (Team scrolling rows) appears on the landing page."
      >
        <div className="space-y-4">
          <AdminInput 
            label="Section Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="ARCHITECTS"
            description="The main heading for the Architects section."
          />
          
          <div className="pt-2">
            <AdminButton onClick={handleSave} loading={saving}>
              Update Settings
            </AdminButton>
          </div>
        </div>
      </AdminCard>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-sm text-slate-500 italic">
        Note: The actual members shown in this section are managed under the "Team" tab. This tab only controls the section title and global visibility.
      </div>
    </div>
  );
};

export default ArchitectsEditor;
