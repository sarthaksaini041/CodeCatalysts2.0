import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCMS } from '../hooks/useCMS';
import { fadeUpVariant, staggerContainer } from '../utils/animations.jsx';

const MemberCard = ({ person, accent, navigate }) => (
    <motion.div
        className="pill-card"
        style={{ width: '380px', flexShrink: 0, background: 'rgba(255,255,255,0.02)' }}
        whileHover={{ scale: 1.02, borderColor: accent || 'var(--secondary)', background: 'rgba(255,255,255,0.05)', boxShadow: `0 0 20px ${accent}22` }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/team')}
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
                        {(person.name || "?")[0]}
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

const ScrollingTrack = ({ items, duration, reverse = false, accent, navigate }) => {
    const [isPaused, setIsPaused] = React.useState(false);
    const displayItems = React.useMemo(() => (items.length > 0 ? [...items, ...items] : []), [items]);

    if (items.length === 0) return null;

    return (
        <div className="infinite-scroll-container" style={{ overflow: 'hidden', width: '100vw', margin: '1rem 0' }}>
            <motion.div 
                className="infinite-scroll-track" 
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
                transition={{ 
                    duration: isPaused ? 1000000 : duration, 
                    ease: "linear", 
                    repeat: Infinity,
                    repeatType: "loop"
                }}
                style={{ 
                    display: 'flex', 
                    gap: '2rem', 
                    width: 'max-content',
                    cursor: 'pointer'
                }}
            >
                {displayItems.map((member, i) => (
                    <MemberCard key={i} person={member} accent={accent} navigate={navigate} />
                ))}
            </motion.div>
        </div>
    );
};

const Chapter_Architects = () => {
    const navigate = useNavigate();
    const { teamMembers, loading } = useCMS();

    if (loading) return null;

    // Data Partitioning - Robust distribution for 3 tracks
    const leads = teamMembers.filter(m => m.role === 'Lead' || m.role === 'Rep');
    const simpleMembers = teamMembers.filter(m => m.role === 'Member');

    let row1Items, row2Items, row3Items;

    if (leads.length > 0) {
        // Traditional layout: Leads on top, members split below
        row1Items = leads.map(m => ({ ...m, image: m.image_url }));
        const memberList = simpleMembers.map(m => ({ ...m, image: m.image_url }));
        row2Items = memberList.slice(0, Math.ceil(memberList.length / 2));
        row3Items = memberList.slice(Math.ceil(memberList.length / 2));
    } else {
        // Fallback: Distribute all members across 3 rows if no leads are assigned yet
        const all = teamMembers.map(m => ({ ...m, image: m.image_url }));
        const third = Math.ceil(all.length / 3);
        row1Items = all.slice(0, third);
        row2Items = all.slice(third, index => index < 2 * third ? all[index] : null).filter(Boolean); // Safety slice
        row2Items = all.slice(third, 2 * third);
        row3Items = all.slice(2 * third);
    }

    return (
        <section className="chapter-section architects-scan" id="chapter-05" style={{ position: 'relative', overflow: 'hidden', padding: '10vh 0' }}>
            <div className="bg-text-scrolling" style={{ top: '20%', opacity: 0.02, fontSize: '20rem' }}>
                NETWORK • CORE • NODES • SYSTEM • ARCHITECTS • NETWORK •
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 1, marginBottom: '5rem', textAlign: 'center' }}>
                <motion.div
                   variants={fadeUpVariant}
                   initial="hidden"
                   whileInView="visible"
                   viewport={{ once: true }}
                   className="chapter-label-line"
                >
                  <div className="line" style={{ background: 'var(--accent)' }} />
                  <span className="text">CHAPTER 05</span>
                  <div className="line" style={{ background: 'var(--accent)' }} />
                </motion.div>

                <motion.div
                   variants={staggerContainer(0.1, 0)}
                   initial="hidden"
                   whileInView="visible"
                   viewport={{ once: true }}
                   className="chapter-header-v2"
                >
                  <div className="chapter-title-v2">
                    <motion.span variants={fadeUpVariant} className="title-prefix">THE</motion.span>
                    <motion.h2 variants={fadeUpVariant} className="title-main" style={{ '--chapter-gradient': 'linear-gradient(135deg, var(--accent), var(--primary))' }}>NETWORK</motion.h2>
                  </div>
                </motion.div>
            </div>

            <div className="scrolling-rows-container" style={{ margin: '3rem 0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <ScrollingTrack items={row1Items} duration={35} accent="var(--primary)" navigate={navigate} />
              <ScrollingTrack items={row2Items} duration={50} reverse={true} accent="var(--secondary)" navigate={navigate} />
              <ScrollingTrack items={row3Items} duration={40} accent="var(--accent)" navigate={navigate} />
            </div>

            <div className="container" style={{ marginTop: '4rem', position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <motion.button 
                    variants={fadeUpVariant}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(123, 97, 255, 0.3)' }}
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
