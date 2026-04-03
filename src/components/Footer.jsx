import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Users, Share2, Mail, ArrowUp } from 'lucide-react';
import { GitHubIcon, LinkedInIcon, InstagramIcon } from './icons/TechnicalIcons';
import { useNavigate } from 'react-router-dom';
import { fadeUpVariant, staggerContainer } from '../utils/animations.jsx';
import { useCMS } from '../hooks/useCMS';

const Footer = () => {
    const navigate = useNavigate();
    const { footerSettings, siteContent, teamMembers, projects, loading } = useCMS();

    if (loading) return null;

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const socialLinks = [
        { icon: <LinkedInIcon size={20} />, href: footerSettings.linkedin_url, label: 'LinkedIn' },
        { icon: <GitHubIcon size={20} />, href: footerSettings.github_url, label: 'GitHub' },
        { icon: <InstagramIcon size={20} />, href: footerSettings.instagram_url, label: 'Instagram' },
    ].filter(link => link.href && link.href !== '#' && link.href.trim() !== '');

    return (
        <motion.footer 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ 
                padding: '10rem 2rem 4rem', 
                position: 'relative',
                zIndex: 10
            }}
        >
            <motion.div 
                className="container" 
                variants={staggerContainer(0.1, 0)}
                style={{ maxWidth: '1200px' }}
            >
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: '4rem',
                    textAlign: 'left'
                }}>
                    {/* COLUMN 1: BRAND IDENTITY */}
                    <motion.div variants={fadeUpVariant} style={{ gridColumn: 'span 2' }}>
                        <div style={{ 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.4em', 
                            fontSize: '1.6rem', 
                            fontWeight: 950, 
                            color: '#fff', 
                            marginBottom: '0.4rem' 
                        }}>
                            CODE CATALYSTS
                        </div>
                        <div style={{ 
                            fontSize: '0.75rem', 
                            letterSpacing: '0.2em', 
                            textTransform: 'uppercase', 
                            color: 'var(--primary)', 
                            fontWeight: 900,
                            marginBottom: '2rem'
                        }}>
                            {footerSettings.tagline || "ENGINEERED FOR EXCELLENCE."}
                        </div>
                        <p style={{ 
                            fontSize: '1rem', 
                            color: 'var(--text-dim)', 
                            lineHeight: 1.8, 
                            maxWidth: '380px',
                            marginBottom: '2.5rem'
                        }}>
                            {footerSettings.footer_text || "Building the future of collective intelligence."}
                        </p>
                        
                        {/* SOCIAL LINKS */}
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -5, color: '#fff', borderColor: 'var(--primary)' }}
                                    style={{ 
                                        width: '44px', 
                                        height: '44px', 
                                        borderRadius: '12px', 
                                        background: 'rgba(255,255,255,0.03)', 
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'rgba(255,255,255,0.4)',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* COLUMN 2: SYSTEM */}
                    <motion.div variants={fadeUpVariant}>
                        <div style={{ 
                            fontSize: '0.8rem', 
                            letterSpacing: '0.4em', 
                            fontWeight: 900, 
                            color: 'var(--secondary)', 
                            textTransform: 'uppercase',
                            marginBottom: '2rem'
                        }}>
                            SYSTEM
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {['Genesis', 'The Shift', 'The Journey', 'The Forge', 'The Network'].map(link => (
                                <motion.a 
                                    key={link}
                                    href={`#${link.toLowerCase().replace(' ', '-')}`}
                                    whileHover={{ x: 5, color: '#fff' }}
                                    style={{ color: 'var(--text-dim)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}
                                >
                                    {link}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* COLUMN 3: NAVIGATION */}
                    <motion.div variants={fadeUpVariant}>
                        <div style={{ 
                            fontSize: '0.8rem', 
                            letterSpacing: '0.4em', 
                            fontWeight: 900, 
                            color: 'var(--secondary)', 
                            textTransform: 'uppercase',
                            marginBottom: '2rem'
                        }}>
                            NAVIGATION
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { name: 'Team', path: '/team' },
                                { name: 'Become a Catalyst', path: '/apply' }
                            ].map(link => (
                                <motion.a 
                                    key={link.name}
                                    onClick={() => link.path !== '#' && navigate(link.path)}
                                    whileHover={{ x: 5, color: '#fff' }}
                                    style={{ color: 'var(--text-dim)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer' }}
                                >
                                    {link.name}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                </div>

                {/* BOTTOM BAR */}
                <motion.div 
                    variants={fadeUpVariant}
                    style={{ 
                        marginTop: '5rem', 
                        paddingTop: '3rem', 
                        borderTop: '1px solid var(--glass-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem',
                        opacity: 0.3
                    }}
                >
                    <div style={{ 
                        fontSize: '0.8rem', 
                        letterSpacing: '0.2em', 
                        textTransform: 'uppercase', 
                        fontWeight: 700,
                        color: '#fff',
                        textAlign: 'center'
                    }}>
                        {siteContent.footer_copyright || "© 2026 CODE CATALYSTS. ALL RIGHTS RESERVED."}
                    </div>
                </motion.div>
            </motion.div>
        </motion.footer>
    );
};

export default Footer;
