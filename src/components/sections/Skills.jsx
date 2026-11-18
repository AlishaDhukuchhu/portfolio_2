import React from 'react';
import { motion } from 'framer-motion';

const skills = [
  { name: 'UX DESIGN', tools: ['Research', 'Wireframing', 'User Testing'] },
  { name: 'UI DESIGN', tools: ['Visual Identity', 'Typography', 'Color Theory'] },
  { name: 'DESIGN SYSTEMS', tools: ['Tokens', 'Components', 'Documentation'] },
  { name: 'PROTOTYPING', tools: ['Framer', 'Protopie', 'Interactive'] },
  { name: 'FIGMA', tools: ['Auto Layout', 'Variants', 'Variables'] }
];

const marqueeVariants = {
  animate: {
    x: [0, -1036], // arbitrary width based on content
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 20,
        ease: "linear",
      },
    },
  },
};

export default function Skills() {
  return (
    <section className="section" style={{ paddingBottom: '0', overflow: 'hidden' }}>
      
      {/* Marquee */}
      <div style={{ 
        width: '100%', 
        borderTop: '1px solid var(--border-subtle)', 
        borderBottom: '1px solid var(--border-subtle)',
        padding: 'var(--space-md) 0',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center'
      }}>
        <motion.div 
          variants={marqueeVariants}
          animate="animate"
          style={{ display: 'inline-flex', gap: 'var(--space-lg)' }}
        >
          {Array(4).fill(0).map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center' }}>
              <span className="oversized-text" style={{ fontSize: 'var(--text-3xl)' }}>UX DESIGN</span>
              <span style={{ color: 'var(--accent)' }}>•</span>
              <span className="oversized-text" style={{ fontSize: 'var(--text-3xl)' }}>UI DESIGN</span>
              <span style={{ color: 'var(--accent)' }}>•</span>
              <span className="oversized-text" style={{ fontSize: 'var(--text-3xl)' }}>PRODUCT DESIGN</span>
              <span style={{ color: 'var(--accent)' }}>•</span>
              <span className="oversized-text" style={{ fontSize: 'var(--text-3xl)' }}>DESIGN SYSTEMS</span>
              <span style={{ color: 'var(--accent)' }}>•</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="container" style={{ padding: 'var(--space-xl) 5vw' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
          {skills.map((skill, index) => (
            <motion.div 
              key={index}
              style={{
                padding: 'var(--space-md) var(--space-lg)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '100px',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: 'var(--text-primary)', 
                color: 'var(--bg-color)' 
              }}
              transition={{ duration: 0.3 }}
              className="skill-tag"
            >
              <h3 style={{ fontSize: 'var(--text-2xl)', margin: 0, fontWeight: 700 }}>
                {skill.name}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
