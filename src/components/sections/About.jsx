import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const AnimatedTag = ({ children, index, sectionDelay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: sectionDelay + (index * 0.1) }}
    whileHover={{ 
      y: -3, 
      backgroundColor: 'rgba(200, 255, 0, 0.1)', 
      borderColor: 'rgba(200, 255, 0, 0.4)',
      color: '#C8FF00'
    }}
    style={{
      display: 'inline-flex',
      padding: '8px 16px',
      borderRadius: '100px',
      border: '1px solid rgba(255,255,255,0.15)',
      backgroundColor: 'rgba(255,255,255,0.02)',
      fontSize: '0.85rem',
      color: '#d1d5db',
      marginRight: '8px',
      marginBottom: '8px',
      cursor: 'default',
      backdropFilter: 'blur(10px)'
    }}
  >
    {children}
  </motion.div>
);

export default function About() {
  const containerRef = useRef(null);
  const [aboutData, setAboutData] = useState(null);
  
  useEffect(() => {
    fetch('http://localhost:3001/api/settings/about_section')
      .then(res => res.json())
      .then(data => {
        if (data) setAboutData(data);
      })
      .catch(err => console.error(err));
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  // Fallback defaults
  const headingStr = aboutData?.heading || "DESIGNING\\nWITH\\nPURPOSE.";
  const subtext = aboutData?.subtext || "I'm a UI/UX Designer focused on creating intuitive, scalable and visually refined digital products.";
  const experienceLabel = aboutData?.experienceLabel || "4+ Years";
  const locationLabel = aboutData?.locationLabel || "Remote, Worldwide";
  
  const skillsArray = aboutData?.skills ? aboutData.skills.split(',').map(s => s.trim()).filter(s => s) : ['UI/UX Design', 'Wireframing', 'Prototyping', 'Design Systems', 'Interaction Design'];
  const toolsArray = aboutData?.tools ? aboutData.tools.split(',').map(s => s.trim()).filter(s => s) : ['Figma', 'Framer', 'React', 'Adobe CC', 'Webflow'];
  const portraitImage = aboutData?.portraitImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1964";

  return (
    <section className="section" ref={containerRef} style={{ backgroundColor: '#050505', color: '#f9f9f9', padding: '10vw 0', position: 'relative', overflow: 'hidden' }}>
      
      {/* Decorative Line & Accent */}
      <motion.div 
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ position: 'absolute', top: 0, left: '5vw', right: '5vw', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', transformOrigin: 'left' }}
      ></motion.div>
      <motion.div 
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        style={{ position: 'absolute', top: 0, left: '5vw', width: '40px', height: '4px', backgroundColor: '#C8FF00', transformOrigin: 'left' }}
      ></motion.div>

      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8vw', alignItems: 'center' }}>
          
          {/* Text Content */}
          <motion.div style={{ y: textY, position: 'relative', zIndex: 10 }}>
            
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="section-number" 
              style={{ marginBottom: '16px', display: 'inline-block' }}
            >
              02
            </motion.span>
            
            <motion.h2 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ 
                fontSize: 'clamp(4rem, 8vw, 8rem)', 
                fontWeight: 900, 
                lineHeight: 0.85,
                letterSpacing: '-0.04em',
                margin: '0 0 32px 0',
                textTransform: 'uppercase',
                color: '#ffffff',
                whiteSpace: 'pre-line'
              }}
            >
              {headingStr.replace(/\\n/g, '\n')}
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{ fontSize: 'clamp(1rem, 1.2vw, 1.1rem)', lineHeight: 1.6, color: '#a3a3a3', marginBottom: '40px', maxWidth: '90%' }}
            >
              {subtext}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.7 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '32px' }}
            >
              
              <div>
                <h4 style={{ color: '#6b7280', marginBottom: '12px', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>Experience</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {[experienceLabel].map((item, i) => (
                    <AnimatedTag key={`exp-${item}`} index={i} sectionDelay={0.8}>{item}</AnimatedTag>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 style={{ color: '#6b7280', marginBottom: '12px', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>Location</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {[locationLabel].map((item, i) => (
                    <AnimatedTag key={`loc-${item}`} index={i} sectionDelay={0.9}>{item}</AnimatedTag>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ color: '#6b7280', marginBottom: '12px', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>Skills</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {skillsArray.map((skill, i) => (
                    <AnimatedTag key={`skill-${skill}`} index={i} sectionDelay={1.0}>{skill}</AnimatedTag>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ color: '#6b7280', marginBottom: '12px', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>Tools</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {toolsArray.map((tool, i) => (
                    <AnimatedTag key={`tool-${tool}`} index={i} sectionDelay={1.2}>{tool}</AnimatedTag>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Halftone Image Treatment */}
          <div style={{ position: 'relative', height: '120vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 1.1 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
              style={{ 
                position: 'absolute', 
                width: '120%', 
                height: '100%',
                y: imageY,
                right: '-10%',
                zIndex: 1
              }}
            >
              <img 
                src={portraitImage}
                alt="About Portrait"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  filter: 'grayscale(100%) contrast(180%) brightness(70%)',
                  maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)',
                  WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)'
                }}
              />
              {/* CSS Halftone Overlay Trick */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)',
                backgroundSize: '5px 5px',
                opacity: 0.7,
                mixBlendMode: 'overlay'
              }}></div>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
