import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const steps = [
  { id: '01', title: 'DISCOVER', desc: 'Understanding the problem space, user needs, and business goals through comprehensive research.' },
  { id: '02', title: 'DEFINE', desc: 'Synthesizing findings into clear problem statements, user journeys, and strategic direction.' },
  { id: '03', title: 'DESIGN', desc: 'Iterative exploration of concepts, creating wireframes, and refining high-fidelity visual designs.' },
  { id: '04', title: 'TEST', desc: 'Validating assumptions through user testing, gathering feedback, and analyzing interaction patterns.' },
  { id: '05', title: 'REFINE', desc: 'Polishing interactions, ensuring accessibility, and preparing meticulous documentation for development.' }
];

const ProcessStep = ({ step, index }) => {
  const stepRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: stepRef,
    offset: ["start center", "end center"]
  });

  // Active state logic
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.35, 1, 0.35]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [20, 0, 0, -20]);

  return (
    <motion.div 
      ref={stepRef}
      style={{ 
        opacity,
        display: 'flex', 
        alignItems: 'flex-start', 
        gap: 'var(--space-xl)',
        marginBottom: '15vh'
      }}
    >
      <motion.div style={{ scale, flex: '0 0 450px', display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
        <span style={{ fontSize: 'var(--text-xl)', color: 'var(--text-secondary)', marginTop: '1rem', width: '30px' }}>{step.id}</span>
        <h3 className="oversized-text" style={{ fontSize: 'var(--text-4xl)', margin: 0 }}>
          {step.title}
        </h3>
      </motion.div>
      <motion.p style={{ y, fontSize: 'var(--text-xl)', color: 'var(--text-secondary)', flex: 1, maxWidth: '400px', marginTop: '1rem' }}>
        {step.desc}
      </motion.p>
    </motion.div>
  );
};

export default function Process() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="section" ref={containerRef} style={{ position: 'relative' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 'var(--space-xl)' }}>
        
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'sticky', top: '15vh' }}>
            <span className="section-number">04</span>
            <h2 className="oversized-text" style={{ fontSize: 'var(--text-4xl)' }}>MY<br/>PROCESS</h2>
            
            {/* Progress indicator line */}
            <div style={{ 
              marginTop: 'var(--space-xl)', 
              width: '2px', 
              height: '30vh', 
              backgroundColor: 'var(--border-subtle)',
              position: 'relative'
            }}>
              <motion.div style={{ 
                width: '100%', 
                height: lineHeight, 
                backgroundColor: 'var(--accent)' 
              }} />
            </div>
          </div>
        </div>

        <div style={{ paddingTop: '15vh', paddingBottom: '30vh' }}>
          {steps.map((step, index) => (
            <ProcessStep key={step.id} step={step} index={index} />
          ))}
        </div>
        
      </div>
    </section>
  );
}
