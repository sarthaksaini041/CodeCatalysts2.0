import React, { useState, useCallback, useMemo } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, ZoomIn, ZoomOut, RotateCcw, Sun, Contrast, Droplets, Sparkles, Wand2, Maximize2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import getCroppedImg from '../../utils/cropImage';

const FILTER_PRESETS = [
    { id: 'none', label: 'NORMAL', filter: '' },
    { id: 'vivid', label: 'VIVID', filter: 'saturate(150%) contrast(110%)' },
    { id: 'mono', label: 'MONO', filter: 'grayscale(100%) contrast(120%)' },
    { id: 'warm', label: 'WARM', filter: 'sepia(30%) saturate(140%)' },
    { id: 'cool', label: 'COOL', filter: 'hue-rotate(30deg) saturate(110%)' },
    { id: 'cinema', label: 'CINEMA', filter: 'contrast(110%) brightness(90%) sepia(20%)' },
];

const ImageCropper = ({ image, aspect = 1, label = "CROP_IMAGE", onCropComplete, onCancel }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    
    // Adjustments
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);
    const [blur, setBlur] = useState(0);
    const [activePreset, setActivePreset] = useState('none');

    const currentFilter = useMemo(() => {
        const preset = FILTER_PRESETS.find(p => p.id === activePreset)?.filter || '';
        return `${preset} brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;
    }, [brightness, contrast, saturation, blur, activePreset]);

    const onCropAreaComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleConfirm = async () => {
        try {
            const filters = {
                brightness,
                contrast,
                saturation,
                blur,
                preset: FILTER_PRESETS.find(p => p.id === activePreset)?.filter || ''
            };
            const croppedImage = await getCroppedImg(image, croppedAreaPixels, filters);
            onCropComplete(croppedImage);
        } catch (e) {
            console.error(e);
        }
    };

    const handleReset = () => {
        setBrightness(100);
        setContrast(100);
        setSaturation(100);
        setBlur(0);
        setActivePreset('none');
        setZoom(1);
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
        >
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#0A0A0A] rounded-[40px] w-full max-w-6xl h-full max-h-[850px] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row"
            >
                {/* Main Editor Section */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#0F0F0F]">
                    {/* Header */}
                    <div className="px-8 py-6 flex justify-between items-center border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">{label}</h3>
                                <p className="text-[10px] text-white/30 font-bold uppercase tracking-tighter mt-0.5">
                                    Aspect Ratio: {aspect % 1 === 0 ? aspect : aspect.toFixed(2)}:1
                                </p>
                            </div>
                        </div>
                        <button onClick={onCancel} className="p-2.5 hover:bg-white/5 rounded-2xl text-white/40 hover:text-white transition-all">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Cropper Container */}
                    <div className="relative flex-1 bg-black overflow-hidden m-4 rounded-[32px] border border-white/5 group">
                        <Cropper
                            image={image}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspect}
                            onCropChange={setCrop}
                            onCropComplete={onCropAreaComplete}
                            onZoomChange={setZoom}
                            style={{
                                containerStyle: { background: '#000' },
                                imageStyle: { filter: currentFilter }
                            }}
                        />
                        
                        {/* Zoom Controls Overlay */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4 px-6 py-3 bg-black/50 backdrop-blur-xl rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <ZoomOut size={14} className="text-white/40" />
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                onChange={(e) => setZoom(parseFloat(e.target.value))}
                                className="w-32 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500"
                            />
                            <ZoomIn size={14} className="text-white/40" />
                        </div>
                    </div>

                    {/* Filter Presets Grid */}
                    <div className="px-8 pb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Wand2 size={12} className="text-indigo-400" />
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Master Presets</span>
                        </div>
                        <div className="grid grid-cols-6 gap-3">
                            {FILTER_PRESETS.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => setActivePreset(p.id)}
                                    className={`relative h-20 rounded-2xl overflow-hidden transition-all duration-300 border-2
                                        ${activePreset === p.id ? 'border-indigo-500 scale-[1.02] shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'border-white/5 hover:border-white/20'}`}
                                >
                                    <div className="absolute inset-0 bg-white/5" />
                                    <img 
                                        src={image} 
                                        alt="" 
                                        className="w-full h-full object-cover opacity-60" 
                                        style={{ filter: `${p.filter} brightness(100%) contrast(100%) saturate(100%)` }}
                                    />
                                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                        <p className="text-[8px] font-black text-white/80 text-center tracking-tighter uppercase">{p.label}</p>
                                    </div>
                                    {activePreset === p.id && (
                                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg">
                                            <Check size={10} className="text-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Adjustments Panel */}
                <div className="w-full md:w-[340px] bg-[#0A0A0A] p-8 flex flex-col gap-8 border-l border-white/5">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Maximize2 size={16} className="text-white/40" />
                                <h4 className="text-[11px] font-black text-white uppercase tracking-wider">Image Adjustments</h4>
                            </div>
                            <button 
                                onClick={handleReset}
                                className="p-2 text-white/20 hover:text-white transition-colors"
                                title="Reset All"
                            >
                                <RotateCcw size={16} />
                            </button>
                        </div>

                        {/* Adjustment Sliders */}
                        <div className="space-y-8 mt-4">
                            {[
                                { icon: Sun, label: 'Brightness', state: brightness, setState: setBrightness, min: 50, max: 150 },
                                { icon: Contrast, label: 'Contrast', state: contrast, setState: setContrast, min: 50, max: 150 },
                                { icon: Droplets, label: 'Saturation', state: saturation, setState: setSaturation, min: 0, max: 200 },
                                { icon: Maximize2, label: 'Sharpness / Blur', state: blur, setState: setBlur, min: 0, max: 10, step: 0.1 }
                            ].map((adj) => (
                                <div key={adj.label} className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <adj.icon size={14} className="text-white/60" />
                                            <span className="text-[10px] font-bold text-white/80 uppercase tracking-tighter">{adj.label}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-indigo-400 family-mono">
                                            {adj.label === 'Sharpness / Blur' ? `${adj.state}px` : `${adj.state}%`}
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min={adj.min}
                                        max={adj.max}
                                        step={adj.step || 1}
                                        value={adj.state}
                                        onChange={(e) => adj.setState(parseFloat(e.target.value))}
                                        className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all border border-white/[0.02]"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Logic for showing resolution / crop info */}
                    {croppedAreaPixels && (
                        <div className="mt-auto pt-8 border-t border-white/5 space-y-4">
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                                <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Output Resolution</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-lg font-black text-white">{Math.round(croppedAreaPixels.width)}</span>
                                    <span className="text-xs font-black text-white/20">×</span>
                                    <span className="text-lg font-black text-white">{Math.round(croppedAreaPixels.height)}</span>
                                    <span className="ml-1 text-[8px] font-black text-indigo-400 uppercase tracking-widest">PX</span>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <button 
                                    onClick={onCancel}
                                    className="flex-1 py-4 px-6 rounded-2xl bg-white/5 text-[10px] font-black text-white/60 hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest active:scale-95"
                                >
                                    Discard
                                </button>
                                <button 
                                    onClick={handleConfirm}
                                    className="flex-[2] py-4 px-6 rounded-2xl bg-indigo-600 text-white text-[10px] font-black shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:bg-indigo-500 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 uppercase tracking-widest active:scale-95"
                                >
                                    <Check size={16} /> Finalize Edit
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ImageCropper;
