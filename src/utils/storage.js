import { supabase } from '../lib/supabase-browser';

/**
 * Uploads a file to a specific folder in the 'website-assets' bucket.
 * @param {File} file - The file object to upload.
 * @param {string} folder - The folder path (e.g., 'team' or 'projects').
 * @returns {Promise<{url: string | null, error: any}>}
 */
export const uploadFile = async (file, folder = 'misc') => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).slice(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('website-assets')
      .upload(filePath, file);

    if (error) throw error;

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('website-assets')
      .getPublicUrl(filePath);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Upload error:', error.message);
    return { url: null, error };
  }
};
