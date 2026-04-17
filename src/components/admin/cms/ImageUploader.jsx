/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase-browser';

const ImageUploader = ({ 
  folder = 'uploads', 
  currentImageUrl, 
  onUpload, 
  label = 'Image', 
  variant = 'wide' // 'wide', 'square', 'circle'
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImageUrl || '');
  const inputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB.');
      return;
    }

    setUploading(true);

    try {
      const ext = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('images').getPublicUrl(fileName);
      const publicUrl = data.publicUrl;

      setPreview(publicUrl);
      onUpload(publicUrl);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    setPreview('');
    onUpload('');
  };

  const getContainerStyles = () => {
    switch (variant) {
      case 'square':
        return 'w-32 h-32 mx-auto';
      case 'circle':
        return 'w-32 h-32 mx-auto rounded-full';
      default:
        return 'w-full h-40';
    }
  };

  const getDropzoneStyles = () => {
    switch (variant) {
      case 'square':
        return 'w-32 h-32 mx-auto';
      case 'circle':
        return 'w-32 h-32 mx-auto rounded-full';
      default:
        return 'w-full h-32';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-slate-600">{label}</label>

      {preview ? (
        <div className={`relative overflow-hidden border border-slate-200 bg-slate-50 ${getContainerStyles()}`}>
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1 right-1 w-6 h-6 rounded-md bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-500 hover:text-red-500 border border-slate-200 transition-colors shadow-sm"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={`border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors disabled:opacity-50 bg-slate-50 ${getDropzoneStyles()}`}
        >
          {uploading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Upload size={16} />
          )}
          <span className="text-[10px] font-medium">
            {uploading ? '...' : (variant === 'wide' ? 'Click to upload' : 'Upload')}
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;
