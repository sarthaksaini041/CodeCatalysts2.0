import React, { useState } from 'react';
import { Save, Trash2, Plus } from 'lucide-react';
import { SectionCard, Field, AdmTextarea } from './AdminShared';

export default function AdminStory({ data, onSave }) {
  const isObject = data && typeof data === 'object' && !data.startsWith;
  const initialText = isObject ? data.text : data;
  const initialImages = isObject ? data.images : [];
  
  const [text, setText] = useState(initialText);
  const [images, setImages] = useState(initialImages);
  const [dirty, setDirty] = useState(false);

  const handleTextChange = (v) => { setText(v); setDirty(true); };
  
  const handleImageUpload = (index, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImages = [...images];
        newImages[index] = { id: newImages[index]?.id || index + 1, url: e.target.result };
        setImages(newImages);
        setDirty(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setDirty(true);
  };

  const handleAddImage = () => {
    setImages([...images, { id: images.length + 1, url: '' }]);
    setDirty(true);
  };

  const handleSave = () => {
    onSave({ text, images });
    setDirty(false);
  };

  return (
    <SectionCard
      title="Our Story"
      subtitle="Edit the story block with images and text displayed on the landing page"
      action={
        <button className="adm-btn adm-btn--primary" onClick={handleSave} disabled={!dirty}>
          <Save size={15} /> Save Story
        </button>
      }
    >
      <div className="adm-story-preview-grid">
        <div className="adm-story-editor-col">
          <Field label="Story Text" hint="Supports basic HTML tags like <strong> and <br />">
            <AdmTextarea value={text} onChange={handleTextChange} rows={8} placeholder="Write the story…" />
          </Field>
          <div className="adm-story-charcount">{text.length} characters</div>

          <Field label="Story Images" hint="Add up to 3 rectangular images for the story section">
            <div className="adm-images-container">
              {images.map((img, idx) => (
                <div key={idx} className="adm-image-upload-box">
                  <div className="adm-image-preview">
                    {img.url ? (
                      <img src={img.url} alt={`Story ${idx + 1}`} />
                    ) : (
                      <div className="adm-image-placeholder">Image {idx + 1}</div>
                    )}
                  </div>
                  <div className="adm-image-controls">
                    <label className="adm-file-input-label">
                      Choose Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(idx, e.target.files[0])}
                        style={{ display: 'none' }}
                      />
                    </label>
                    <button 
                      className="adm-btn adm-btn--danger adm-btn--small"
                      onClick={() => handleImageRemove(idx)}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {images.length < 5 && (
              <button className="adm-btn adm-btn--secondary" onClick={handleAddImage}>
                <Plus size={14} /> Add Another Image
              </button>
            )}
          </Field>
        </div>

        <div className="adm-story-preview-col">
          <p className="adm-story-preview-label">LIVE PREVIEW</p>
          <div className="adm-story-preview-card">
            <div className="adm-story-preview-title">OUR STORY</div>
            <div className="adm-story-preview-content">
              {images.length > 0 && (
                <div className="adm-story-preview-images">
                  {images.map((img, idx) => (
                    img.url && <img key={idx} src={img.url} alt={`Story ${idx + 1}`} />
                  ))}
                </div>
              )}
              <p
                className="adm-story-preview-text"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .adm-story-preview-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .adm-story-editor-col { display: flex; flex-direction: column; gap: 0.5rem; }
        .adm-story-charcount { font-size: 0.72rem; color: rgba(255,255,255,0.25); text-align: right; }
        
        .adm-images-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1rem; }
        .adm-image-upload-box { display: flex; flex-direction: column; gap: 0.5rem; }
        .adm-image-preview { 
          width: 100%; aspect-ratio: 4/3; 
          background: rgba(255,255,255,0.03); 
          border: 1px solid rgba(188,19,254,0.3);
          border-radius: 8px; 
          overflow: hidden; 
          display: flex; 
          align-items: center; 
          justify-content: center;
        }
        .adm-image-preview img { width: 100%; height: 100%; object-fit: cover; }
        .adm-image-placeholder { color: rgba(255,255,255,0.4); font-size: 0.75rem; text-align: center; }
        .adm-image-controls { display: flex; gap: 0.5rem; font-size: 0.75rem; }
        .adm-file-input-label { 
          padding: 0.4rem 0.8rem; 
          background: rgba(188,19,254,0.2); 
          border: 1px solid rgba(188,19,254,0.4);
          border-radius: 4px;
          cursor: pointer;
          white-space: nowrap;
          font-size: 0.7rem;
        }
        .adm-btn--small { padding: 0.3rem 0.6rem; font-size: 0.7rem; }
        
        .adm-story-preview-col { display: flex; flex-direction: column; gap: 0.75rem; }
        .adm-story-preview-label { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.2); }
        .adm-story-preview-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(188,19,254,0.2); border-radius: 16px; padding: 1.5rem; }
        .adm-story-preview-title { font-size: 0.7rem; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; color: var(--adm-purple); margin-bottom: 1rem; }
        .adm-story-preview-content { display: flex; flex-direction: column; gap: 1rem; }
        .adm-story-preview-images { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
        .adm-story-preview-images img { width: 100%; border-radius: 8px; object-fit: cover; aspect-ratio: 4/3; }
        .adm-story-preview-text { font-size: 1rem; line-height: 1.8; color: rgba(255,255,255,0.55); margin: 0; }
        @media (max-width: 700px) { 
          .adm-story-preview-grid { grid-template-columns: 1fr; }
          .adm-story-preview-images { grid-template-columns: 1fr; }
        }
      `}</style>
    </SectionCard>
  );
}
