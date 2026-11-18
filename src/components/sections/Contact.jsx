import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const socialLinks = ['Email', 'LinkedIn', 'Behance', 'Dribbble'];

  return (
    <section className="section" style={{ paddingBottom: 'var(--space-md)' }}>
      <div className="container" ref={ref} style={{ display: 'flex', flexDirection: 'column', minHeight: '80vh', justifyContent: 'space-between' }}>
        
        <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
          <div style={{ overflow: 'hidden' }}>
            <motion.h2 
              className="oversized-text" 
              style={{ fontSize: 'var(--text-display)', lineHeight: 0.85 }}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={textVariants}
            >
              LET'S CREATE
            </motion.h2>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <motion.h2 
              className="oversized-text" 
              style={{ fontSize: 'var(--text-display)', lineHeight: 0.85, color: 'var(--text-secondary)' }}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={textVariants}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              SOMETHING
            </motion.h2>
          </div>
          <div style={{ overflow: 'hidden', marginBottom: 'var(--space-md)' }}>
            <motion.h2 
              className="oversized-text" 
              style={{ fontSize: 'var(--text-display)', lineHeight: 0.85 }}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={textVariants}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              MEANINGFUL.
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{ marginBottom: 'var(--space-xl)' }}
          >
            <a
              href="https://www.linkedin.com/in/alishadhukuchhu/"
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
              style={{ fontSize: 'var(--text-xl)', padding: '1.5rem 3rem', textDecoration: 'none', display: 'inline-block' }}
            >
              START A CONVERSATION
            </a>
          </motion.div>
        </div>

        <motion.div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            borderTop: '1px solid var(--border-subtle)', 
            paddingTop: 'var(--space-md)',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--space-sm)'
          }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
            {socialLinks.map((link, index) => (
              <a href="#" key={index} style={{ fontWeight: 500, fontSize: 'var(--text-lg)' }}>
                {link}
              </a>
            ))}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>
            © 2026 UI/UX Designer. All rights reserved.
          </div>
        </motion.div>

      </div>
    </section>
  );
}
