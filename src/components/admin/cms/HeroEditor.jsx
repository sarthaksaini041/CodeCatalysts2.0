import React, { useState, useEffect } from 'react';
import { Save, Sparkles } from 'lucide-react';
import AdminCard from '../shared/AdminCard';
import AdminInput from '../shared/AdminInput';
import AdminButton from '../shared/AdminButton';
import { fetchSiteContent, saveSiteContent, triggerRevalidation } from '../../../services/admin';

const HERO_KEYS = ['hero_tagline', 'hero_line1', 'hero_line2', 'hero_scroll_hint'];

const HeroEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState({
    hero_tagline: 'CODE CATALYSTS',
    hero_line1: 'CRAFTING THE',
    hero_line2: 'FUTURE OF CODE',
    hero_scroll_hint: 'Scroll to explore',
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchSiteContent(HERO_KEYS);
        setContent((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error('Failed to load hero data:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (key, value) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSiteContent(content);
      triggerRevalidation('/');
      alert('Hero section saved successfully.');
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
    <div className="max-w-3xl">
      <AdminCard title="Hero Section" description="Manage the primary hero display text" icon={Sparkles}>
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AdminInput
              label="Tagline"
              value={content.hero_tagline}
              onChange={(e) => handleChange('hero_tagline', e.target.value)}
              placeholder="e.g. CODE CATALYSTS"
            />
            <AdminInput
              label="Scroll Hint"
              value={content.hero_scroll_hint}
              onChange={(e) => handleChange('hero_scroll_hint', e.target.value)}
              placeholder="e.g. Scroll to begin"
            />
          </div>
          <AdminInput
            label="Headline 1"
            value={content.hero_line1}
            onChange={(e) => handleChange('hero_line1', e.target.value)}
            placeholder="Primary headline text"
          />
          <AdminInput
            label="Headline 2"
            value={content.hero_line2}
            onChange={(e) => handleChange('hero_line2', e.target.value)}
            placeholder="Secondary headline text"
          />
          <div className="pt-4 border-t border-slate-100">
            <AdminButton type="submit" loading={saving}>
              <Save size={14} /> Save Changes
            </AdminButton>
          </div>
        </form>
      </AdminCard>
    </div>
  );
};

export default HeroEditor;
