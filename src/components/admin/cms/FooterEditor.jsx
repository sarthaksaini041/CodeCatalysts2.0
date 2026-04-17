import React, { useState, useEffect } from 'react';
import { Save, Settings } from 'lucide-react';
import AdminCard from '../shared/AdminCard';
import AdminInput from '../shared/AdminInput';
import AdminButton from '../shared/AdminButton';
import { fetchFooterSettings, saveFooterSettings, triggerRevalidation } from '../../../services/admin';

const FooterEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    tagline: 'Engineered for Excellence.',
    email: 'codecatalysts000@gmail.com',
    instagram_url: 'https://instagram.com/codecatalysts',
    linkedin_url: 'https://linkedin.com/company/codecatalysts',
    github_url: 'https://github.com/codecatalysts',
    community_url: 'https://community.com',
    copyright_text: '© 2026 Code Catalysts. All rights reserved.',
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchFooterSettings();
        if (data && Object.keys(data).length > 0) {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error('Failed to load footer settings:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveFooterSettings(settings);
      triggerRevalidation('/');
      triggerRevalidation('/team');
      alert('Footer settings saved successfully.');
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
      <AdminCard title="Footer Settings" description="Configure footer content and social links" icon={Settings}>
        <form onSubmit={handleSave} className="space-y-5">
          <AdminInput
            label="Tagline"
            value={settings.tagline || ''}
            onChange={(e) => handleChange('tagline', e.target.value)}
            placeholder="Footer tagline text"
          />
          <AdminInput
            label="Contact Email"
            type="email"
            value={settings.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="contact@example.com"
          />

          <div className="border-t border-slate-100 pt-5">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Contact & Community Links</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminInput
                label="LinkedIn URL"
                value={settings.linkedin_url || ''}
                onChange={(e) => handleChange('linkedin_url', e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
              <AdminInput
                label="GitHub URL"
                value={settings.github_url || ''}
                onChange={(e) => handleChange('github_url', e.target.value)}
                placeholder="https://github.com/..."
              />
              <AdminInput
                label="Instagram URL"
                value={settings.instagram_url || ''}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
                placeholder="https://instagram.com/..."
              />
              <AdminInput
                label="Community URL"
                value={settings.community_url || ''}
                onChange={(e) => handleChange('community_url', e.target.value)}
                placeholder="https://community.com/..."
              />
            </div>
          </div>

          <AdminInput
            label="Copyright Text"
            value={settings.copyright_text || ''}
            onChange={(e) => handleChange('copyright_text', e.target.value)}
            placeholder="© 2026 Code Catalysts. All rights reserved."
          />

          <div className="pt-4 border-t border-slate-100">
            <AdminButton type="submit" loading={saving}>
              <Save size={14} /> Save Settings
            </AdminButton>
          </div>
        </form>
      </AdminCard>
    </div>
  );
};

export default FooterEditor;
