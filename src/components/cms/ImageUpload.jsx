import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Upload, X, Check, Loader2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageCropper from './ImageCropper';
import { uploadFile } from '../../utils/storage';

const ImageUpload = ({ folder, onUpload, currentImageUrl, label = "UPLOAD_IMAGE", aspect = 1 }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
    const [imageToCrop, setImageToCrop] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState("");
    const fileInputRef = useRef(null);


    useEffect(() => {
        setPreviewUrl(currentImageUrl);
    }, [currentImageUrl]);

    const handleFileSelect = (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file.');
            return;
        }

        setSelectedFileName(file.name);
        const reader = new FileReader();
        reader.onload = () => {
            setImageToCrop(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleCropComplete = async (croppedBlob) => {
        setImageToCrop(null);
        setIsUploading(true);
        setUploadProgress(10);

        // Convert blob to file with .webp extension
        const fileName = selectedFileName.replace(/\.[^/.]+$/, "") + ".webp";
        const file = new File([croppedBlob], fileName, { type: 'image/webp' });
        
        const { url, error } = await uploadFile(file, folder);
        
        if (error) {
            alert('Upload failed: ' + error.message);
        } else {
            setUploadProgress(100);
            setPreviewUrl(url);
            onUpload(url);
        }
        setIsUploading(false);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    };

    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-white/30 ml-2">{label}</label>
            
            <div 
                className={`relative group h-40 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-3 overflow-hidden
                    ${isDragging ? 'border-primary bg-primary/5' : 'border-white/10 bg-white/[0.02] hover:border-white/20'}
                    ${previewUrl ? 'border-solid' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                {previewUrl ? (
                    <>
                        <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" />
                        <div className="relative z-10 flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                <Upload size={18} className="text-white" />
                            </div>
                            <span className="text-[10px] font-black text-white uppercase tracking-widest drop-shadow-lg">CHANGE_IMAGE</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-primary group-hover:scale-110 transition-all">
                            <ImageIcon size={24} />
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">DRAG_OR_CLICK</p>
                            <p className="text-[8px] font-bold text-white/20 uppercase tracking-tighter mt-1">PNG, JPG, WEBP • MAX 5MB</p>
                        </div>
                    </>
                )}

                <AnimatePresence>
                    {isUploading && (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4"
                        >
                            <Loader2 size={24} className="text-primary animate-spin" />
                            <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-primary"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">UPLOADING...</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                />
            </div>

            {/* Render ImageCropper via portal to avoid stacking context issues */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {imageToCrop && (
                        <ImageCropper 
                            image={imageToCrop} 
                            aspect={aspect}
                            label={label}
                            onCropComplete={handleCropComplete}
                            onCancel={() => setImageToCrop(null)}
                        />
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export default ImageUpload;
