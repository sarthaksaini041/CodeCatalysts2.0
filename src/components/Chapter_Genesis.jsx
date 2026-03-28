import React from 'react';
import { motion } from 'framer-motion';

const points = [
  {
    title: "Before we were a team",
    content: "We were individuals, scattered in our own dark rooms, trying to make sense of the code.",
    image: "/assets/dark_room_coding_1774718655195.png",
    reverse: false
  },
  {
    title: "The Chaos",
    content: "Messy desks, endless coffee, and the constant hum of a keyboard was our only soundtrack.",
    image: "/assets/messy_desk_1774718675828.png",
    reverse: true
  },
  {
    title: "The Errors",
    content: "Nothing worked. The screen was our only witness to the thousands of times we failed.",
    image: "/assets/error_screen_1774718696857.png",
    reverse: false
  },
  {
    title: "The Encounter",
    content: "We met in the spaces between lines of code. A shared struggle became a shared vision.",
    image: "/assets/group_silhouette_1774718720914.png",
    reverse: true
  },
  {
    title: "The Genesis",
    content: "And then, finally, something clicked. The particles of thought began to form a system.",
    image: "/assets/abstract_particles_brain_1774718742476.png",
    reverse: false
  }
];

const Chapter_Genesis = () => {
  return (
    <section id="chapter-01" className="chapter-section genesis-timeline" style={{ padding: '15vh 2rem' }}>
      <div className="container">
        <span className="chapter-label">CHAPTER 01 // THE GENESIS</span>
        <h2 className="chapter-title">The Spark of <span className="text-gradient">Creation.</span></h2>

        <div className="zig-zag-container">
          <div className="timeline-line" style={{ 
            background: 'linear-gradient(180deg, transparent, var(--primary), var(--secondary), transparent)',
            opacity: 0.2
          }} />
          
          {points.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              className={`zig-zag-row ${point.reverse ? 'reverse' : ''}`}
            >
              <div className="zig-zag-content">
                <span style={{ 
                  fontFamily: 'JetBrains Mono', 
                  fontSize: '0.7rem', 
                  color: 'var(--text-muted)', 
                  letterSpacing: '0.2em',
                  display: 'block',
                  marginBottom: '1rem'
                }}>
                  0{index + 1} // MEMORY_LOG
                </span>
                <h3 style={{ 
                  fontSize: '2.5rem', 
                  marginBottom: '1.5rem', 
                  fontWeight: 900,
                  color: index % 2 === 0 ? 'var(--primary)' : 'var(--secondary)',
                  textShadow: index % 2 === 0 ? '0 0 20px rgba(123, 97, 255, 0.2)' : '0 0 20px rgba(255, 138, 23, 0.2)'
                }}>
                  {point.title}
                </h3>
                <p style={{ fontSize: '1.3rem', color: 'var(--text-dim)', lineHeight: 1.7, maxWidth: '500px', marginLeft: point.reverse ? 'auto' : '0' }}>
                   {point.content}
                </p>
              </div>

              <div className="zig-zag-image-wrapper">
                 <img src={point.image} alt={point.title} className="zig-zag-image" />
                 <div style={{ 
                   position: 'absolute', 
                   inset: 0, 
                   background: index % 2 === 0 ? 'rgba(123, 97, 255, 0.05)' : 'rgba(255, 138, 23, 0.05)', 
                   mixBlendMode: 'color' 
                 }} />
                 <div style={{ 
                   position: 'absolute', 
                   inset: 0, 
                   background: 'linear-gradient(to top, rgba(5,5,5,0.4), transparent)' 
                 }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Chapter_Genesis;
