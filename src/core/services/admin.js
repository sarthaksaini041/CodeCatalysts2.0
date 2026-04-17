import { supabase } from '@/core/lib/supabase-browser';
import { triggerRevalidation } from '@/core/utils/revalidate';

/* ------------------------------------------------------------------ */
/*  Applications                                                       */
/* ------------------------------------------------------------------ */

export async function fetchApplications() {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function updateApplicationStatus(id, status) {
  const { error } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteApplication(id) {
  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export function exportApplicationsCSV(applications) {
  const headers = ['Name', 'Email', 'College', 'Domain', 'Year', 'Status', 'Date'];
  const rows = applications.map((a) => [
    a.name,
    a.email,
    a.college,
    a.domain,
    a.year,
    a.status || 'pending',
    new Date(a.created_at).toLocaleDateString(),
  ]);

  const csv = [headers, ...rows]
    .map((r) => r.map((v) => `"${(v ?? '').toString().replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const anchor = Object.assign(document.createElement('a'), {
    href: url,
    download: `applications_${new Date().toISOString().split('T')[0]}.csv`,
  });
  anchor.click();
  URL.revokeObjectURL(url);
}

/* ------------------------------------------------------------------ */
/*  CMS — site_content key/value store                                 */
/* ------------------------------------------------------------------ */

export async function fetchSiteContent(keys) {
  let query = supabase.from('site_content').select('*');
  if (keys && keys.length > 0) {
    query = query.in('key', keys);
  }
  const { data, error } = await query;
  if (error) throw error;
  const map = {};
  (data || []).forEach((row) => {
    map[row.key] = row.content;
  });
  return map;
}

export async function saveSiteContent(updates) {
  const rows = Object.entries(updates).map(([key, content]) => ({ key, content }));
  const { error } = await supabase.from('site_content').upsert(rows);
  if (error) throw error;
}

/* ------------------------------------------------------------------ */
/*  CMS — generic table CRUD                                           */
/* ------------------------------------------------------------------ */

export async function fetchTableData(table, orderBy = 'order_index') {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order(orderBy, { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function saveTableItem(table, item) {
  const { id, created_at, ...payload } = item;
  if (id) {
    const { error } = await supabase.from(table).update(payload).eq('id', id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from(table).insert(payload);
    if (error) throw error;
  }
}

export async function deleteTableItem(table, id) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
}

export async function reorderTableItems(table, items) {
  const updates = items.map((item, idx) => ({ ...item, order_index: idx }));
  const { error } = await supabase.from(table).upsert(updates);
  if (error) throw error;
}

/* ------------------------------------------------------------------ */
/*  Recruitment toggle                                                 */
/* ------------------------------------------------------------------ */

export async function toggleRecruitment(currentValue) {
  const newValue = currentValue !== 'false' ? 'false' : 'true';
  const { error } = await supabase
    .from('site_content')
    .upsert({ key: 'applyPageEnabled', content: newValue });
  if (error) throw error;
  triggerRevalidation('/');
  triggerRevalidation('/apply');
  return newValue;
}

/* ------------------------------------------------------------------ */
/*  Auth                                                               */
/* ------------------------------------------------------------------ */

export async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export function onAuthStateChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return subscription;
}

/* ------------------------------------------------------------------ */
/*  Revalidation helper                                                */
/* ------------------------------------------------------------------ */

export { triggerRevalidation };

/* ------------------------------------------------------------------ */
/*  Footer settings (single-row table)                                 */
/* ------------------------------------------------------------------ */

export async function fetchFooterSettings() {
  const { data, error } = await supabase
    .from('footer_settings')
    .select('*')
    .maybeSingle();
  if (error) throw error;
  return data || {};
}

export async function saveFooterSettings(settings) {
  const { error } = await supabase.from('footer_settings').upsert(settings);
  if (error) throw error;
}
