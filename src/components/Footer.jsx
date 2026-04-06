import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fadeUpVariant, staggerContainer } from '../utils/animations.jsx';
import { useCMS } from '../hooks/useCMS';

const Footer = () => {
    const navigate = useNavigate();
    const { footerSettings, siteContent, loading } = useCMS();

    if (loading) return null;

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/');
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    const chapterLinks = [
        { name: 'Genesis', id: 'genesis' },
        { name: 'The Shift', id: 'the-shift' },
        { name: 'The Journey', id: 'journey' },
        { name: 'The Forge', id: 'the-forge' },
        { name: 'The Network', id: 'the-network' }
    ];

    const contactLinks = [
        { name: 'Email', href: `mailto:${footerSettings.email || 'codecatalysts000@gmail.com'}` },
        { name: 'Instagram', href: footerSettings.instagram_url || 'https://instagram.com' },
        { name: 'LinkedIn', href: footerSettings.linkedin_url || 'https://linkedin.com' }
    ];

    return (
        <motion.footer 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative pt-24 pb-20 px-8 bg-black border-t border-white/[0.02]"
            style={{ zIndex: 10 }}
        >
            <motion.div 
                className="container max-w-[1400px] mx-auto" 
                variants={staggerContainer(0.1, 0)}
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-4 items-start relative z-10">
                    
                    {/* LEFT: CONTACT */}
                    <motion.div variants={fadeUpVariant} className="flex flex-col space-y-8 order-2 lg:order-1 text-left">
                        <div className="space-y-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 opacity-60 block">CONTACT</span>
                            <div className="flex flex-col space-y-4">
                                {contactLinks.map((link) => (
                                    <motion.a 
                                        key={link.name}
                                        href={link.href} 
                                        target="_blank" 
                                        className="group flex items-center gap-3 text-sm font-bold text-slate-400 hover:text-white transition-colors duration-300 w-fit"
                                        whileHover={{ x: 10 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                    >
                                        {link.name} 
                                        <motion.span
                                            variants={{
                                                hover: { x: 2, y: -2, opacity: 1 }
                                            }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                        >
                                            <ArrowUpRight size={16} className="text-cyan-400 opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
                                        </motion.span>
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* CENTER: IDENTITY */}
                    <motion.div variants={fadeUpVariant} className="flex flex-col items-center justify-center space-y-8 order-1 lg:order-2">
                        {/* Logo Circle Badge */}
                        <motion.div 
                            whileHover={{ scale: 1.05, borderColor: 'rgba(34, 211, 238, 0.3)' }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            className="w-16 h-16 bg-[#0a0a0c] border border-white/5 rounded-full flex items-center justify-center shadow-2xl relative z-10 group overflow-hidden cursor-pointer"
                        >
                            <img 
                                src="/logo.svg" 
                                alt="Code Catalysts Logo" 
                                className="w-8 h-8 object-contain transition-transform duration-500"
                                onError={(e) => { e.target.src = '/logo.png'; }}
                            />
                            <div className="absolute inset-0 rounded-full bg-cyan-500/5 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </motion.div>

                        {/* Title & Tagline */}
                        <div className="text-center space-y-6">
                            <h2 className="text-5xl sm:text-8xl font-[1000] tracking-tighter leading-none uppercase">
                                <span className="text-cyan-400">CODE</span>
                                <span className="text-white ml-2">CATALYSTS</span>
                            </h2>
                            <p className="text-xs sm:text-base text-slate-500 font-bold max-w-md mx-auto leading-relaxed px-4 opacity-80 italic">
                                "{footerSettings.footer_text || "Building, learning, and shipping together since 2025."}"
                            </p>
                        </div>
                    </motion.div>

                    {/* RIGHT: NAVIGATE */}
                    <motion.div variants={fadeUpVariant} className="flex lg:justify-end order-3">
                        <div className="space-y-8 min-w-[200px] lg:text-right">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 opacity-60 block lg:text-right">NAVIGATE</span>
                            <ul className="space-y-5">
                                {chapterLinks.map(link => (
                                    <li key={link.name}>
                                        <motion.button 
                                            onClick={() => scrollToSection(link.id)} 
                                            whileHover="hover"
                                            className="group flex lg:flex-row-reverse items-center gap-3 text-sm font-bold text-slate-400 hover:text-white transition-colors duration-300 w-full lg:justify-start"
                                        >
                                            <motion.span 
                                                variants={{
                                                    hover: { scale: 1.5, backgroundColor: '#22d3ee', opacity: 1 }
                                                }}
                                                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                                className="w-1 h-1 rounded-full bg-slate-500 opacity-0" 
                                            />
                                            <motion.span
                                                variants={{
                                                    hover: { x: -4 }
                                                }}
                                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                            >
                                                {link.name}
                                            </motion.span>
                                        </motion.button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </div>

                {/* BOTTOM BAR */}
                <motion.div 
                    variants={fadeUpVariant}
                    className="mt-24 pt-10 border-t border-white/[0.03] text-center"
                >
                    <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase">
                        {siteContent.footer_copyright || "© 2025 CODE CATALYSTS. ENGINEERED FOR EXCELLENCE."}
                    </p>
                </motion.div>
            </motion.div>
        </motion.footer>
    );
};

export default Footer;
