import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { fadeUpVariant, staggerContainer } from '../utils/animations.jsx';

const Footer = ({ footerSettings = {}, siteContent = {} }) => {
    const router = useRouter();

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        } else {
            router.push('/');
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    };

    const chapterLinks = [
        { name: 'Genesis', id: 'chapter-01' },
        { name: 'The Shift', id: 'chapter-02' },
        { name: 'The Journey', id: 'chapter-03' },
        { name: 'The Forge', id: 'chapter-04' },
        { name: 'The Architects', id: 'chapter-05' }
    ];

    // Add Apply link if enabled
    if (siteContent.applyPageEnabled !== 'false') {
        chapterLinks.push({ name: 'Apply Now', href: '/apply' });
    }

    const contactLinks = [
        { name: 'Email',     href: footerSettings.email ? `mailto:${footerSettings.email}` : null },
        { name: 'LinkedIn',  href: footerSettings.linkedin_url },
        { name: 'GitHub',    href: footerSettings.github_url },
        { name: 'Instagram', href: footerSettings.instagram_url },
        { name: 'Community', href: footerSettings.community_url }
    ].filter(link => link.href);

    return (
        <motion.footer
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative bg-black border-t border-white/[0.02]"
            style={{ 
                zIndex: 10,
                paddingTop: 'clamp(4rem, 10vh, 8rem)',
                paddingBottom: 'clamp(4rem, 10vh, 8rem)',
                paddingLeft: 'clamp(1rem, 5vw, 4rem)',
                paddingRight: 'clamp(1rem, 5vw, 4rem)'
            }}
        >
            <motion.div
                className="container max-w-[1400px] mx-auto"
                variants={staggerContainer(0.1, 0)}
            >
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8 items-start relative z-10">
                    
                    {/* CENTER: IDENTITY - Full width on top for mobile */}
                    <motion.div variants={fadeUpVariant} className="col-span-2 lg:col-span-1 flex flex-col items-center justify-center space-y-8 order-1 lg:order-2">
                        {/* Logo Circle Badge */}
                        <motion.div
                            whileHover={{ scale: 1.05, borderColor: 'rgba(34, 211, 238, 0.3)' }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            className="w-16 h-16 bg-[#0a0a0c] border border-white/5 rounded-full flex items-center justify-center shadow-2xl relative z-10 group overflow-hidden cursor-pointer"
                        >
                            <Image
                                src="/logo.svg"
                                alt="Code Catalysts Logo"
                                width={32}
                                height={32}
                                className="w-8 h-8 object-contain transition-transform duration-500"
                            />
                            <div className="absolute inset-0 rounded-full bg-cyan-500/5 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </motion.div>

                        {/* Title & Tagline */}
                        <div className="text-center space-y-4 sm:space-y-6">
                            <h2 className="text-3xl sm:text-5xl lg:text-3xl xl:text-5xl font-[1000] tracking-tighter leading-[1] uppercase text-center flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3">
                                <span className="text-cyan-400">CODE</span>
                                <span className="text-white">CATALYSTS</span>
                            </h2>
                            <p className="text-[10px] sm:text-base text-slate-500 font-medium max-w-md mx-auto leading-relaxed px-4 opacity-70">
                                &quot;{footerSettings.footer_text || "Building, learning, and shipping together since 2025."}&quot;
                            </p>
                        </div>
                    </motion.div>

                    {/* LEFT: CONTACT */}
                    <motion.div variants={fadeUpVariant} className="col-span-1 flex flex-col order-2 lg:order-1 text-left">
                        <div className="flex flex-col space-y-6">
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

                    {/* RIGHT: NAVIGATE */}
                    <motion.div variants={fadeUpVariant} className="col-span-1 flex lg:justify-end order-3">
                        <div className="flex flex-col space-y-6 min-w-[120px] sm:min-w-[200px] lg:text-right">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 opacity-60 block lg:text-right">NAVIGATE</span>
                            <ul className="flex flex-col space-y-4">
                                {chapterLinks.map(link => (
                                    <li key={link.name}>
                                        <motion.button
                                            onClick={() => {
                                                if (link.href) {
                                                    router.push(link.href);
                                                } else {
                                                    scrollToSection(link.id);
                                                }
                                            }}
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
