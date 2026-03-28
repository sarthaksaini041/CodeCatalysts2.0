import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { INITIAL_LEADER, INITIAL_REPS } from '../pages/admin/adminData';

const Chapter_Architects = () => {
    const navigate = useNavigate();

    // Data Preparation
    const leader = INITIAL_LEADER;
    const reps = INITIAL_REPS;
    const allMembers = reps.flatMap(r => r.members || []);
    
    // Split into 3 Rows for dense network feel
    const row1 = [leader, ...reps]; // Visionary + Reps
    const row2 = allMembers.slice(0, Math.ceil(allMembers.length / 2));
    const row3 = allMembers.slice(Math.ceil(allMembers.length / 2));

    const MemberCard = ({ person, accent }) => (
        <motion.div
            className="pill-card"
            style={{ width: '380px', flexShrink: 0, background: 'rgba(255,255,255,0.02)' }}
            whileHover={{ scale: 1.02, borderColor: accent || 'var(--secondary)', background: 'rgba(255,255,255,0.05)' }}
        >
            <div className="pill-avatar-wrap" style={{ 
                width: '56px', 
                height: '56px', 
                background: `linear-gradient(45deg, ${accent || 'var(--secondary)'}, transparent)` 
            }}>
                <div className="pill-avatar">
                    {person.image ? (
                        <img src={person.image} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ width: '100%', height: '100%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 900, color: accent || 'var(--secondary)' }}>
                            {person.name[0]}
                        </div>
                    )}
                </div>
            </div>
            <div className="pill-info">
                <h3 className="pill-name" style={{ fontSize: '1.1rem' }}>{person.name}</h3>
                <p className="pill-role" style={{ color: accent || 'var(--secondary)', fontSize: '0.7rem' }}>{person.role}</p>
            </div>
        </motion.div>
    );

    return (
        <section className="chapter-section architects-scan" id="chapter-05" style={{ position: 'relative', overflow: 'hidden', padding: '15vh 0' }}>
            
            <div className="bg-text-scrolling" style={{ top: '20%', opacity: 0.02, fontSize: '20rem' }}>
                NETWORK • CORE • NODES • SYSTEM • ARCHITECTS • NETWORK •
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 1, marginBottom: '5rem', textAlign: 'center' }}>
                <span className="chapter-label">CHAPTER 05 // THE NETWORK</span>
                <h2 className="chapter-title" style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)', lineHeight: 0.9 }}>
                    THE ARCHITECTS OF <br />
                    <span className="text-gradient">THE NEXT.</span>
                </h2>
            </div>

            <div className="infinite-scroll-container">
                {/* Row 1: Leaders & Reps */}
                <div className="infinite-scroll-track" style={{ animationDuration: '45s' }}>
                    {[...row1, ...row1, ...row1, ...row1].map((member, i) => (
                        <MemberCard key={`r1-${i}`} person={member} accent="var(--primary)" />
                    ))}
                </div>

                {/* Row 2: Catalysts Alpha (Reverse) */}
                <div className="infinite-scroll-track reverse" style={{ animationDuration: '60s' }}>
                    {[...row2, ...row2, ...row2, ...row2].map((member, i) => (
                        <MemberCard key={`r2-${i}`} person={member} accent="var(--secondary)" />
                    ))}
                </div>

                {/* Row 3: Catalysts Beta */}
                <div className="infinite-scroll-track" style={{ animationDuration: '50s' }}>
                    {[...row3, ...row3, ...row3, ...row3].map((member, i) => (
                        <MemberCard key={`r3-${i}`} person={member} accent="var(--accent)" />
                    ))}
                </div>
            </div>

            <div className="container" style={{ marginTop: '6rem', position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/team')}
                    className="btn-catalyst-large"
                >
                    MEET THE CATALYSTS
                </motion.button>
            </div>

            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '20vh',
                background: 'linear-gradient(to top, var(--bg-deep), transparent)',
                zIndex: 2,
                pointerEvents: 'none'
            }} />
        </section>
    );
};

export default Chapter_Architects;
