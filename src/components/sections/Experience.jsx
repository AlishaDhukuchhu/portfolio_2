import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';



const ExperienceItem = ({ exp }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  return (
    <div 
      ref={ref}
      style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 3fr', 
        gap: 'var(--space-md)',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: 'var(--space-xl)',
        marginBottom: 'var(--space-xl)'
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)' }}>{exp.year}</p>
      </motion.div>
      
      <div>
        <motion.h3 
          className="oversized-text" 
          style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-xs)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          {exp.company}
        </motion.h3>
        
        <motion.h4 
          style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-md)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          {exp.role}
        </motion.h4>
        
        <motion.p 
          style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)', maxWidth: '600px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          {exp.desc}
        </motion.p>
      </div>
    </div>
  );
}

function formatMonthYear(dateStr) {
  if (!dateStr) return '';
  const trimmed = dateStr.trim();
  if (trimmed.toLowerCase() === 'present') return 'Present';
  
  // check if it matches YYYY-MM
  const parts = trimmed.split('-');
  if (parts.length === 2 && parts[0].length === 4) {
    const year = parts[0];
    const monthNum = parseInt(parts[1], 10);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (monthNum >= 1 && monthNum <= 12) {
      return `${months[monthNum - 1]} ${year}`;
    }
  }
  // Otherwise, fallback to returning it unmodified
  return trimmed;
}

function formatDateRange(rangeStr) {
  if (!rangeStr) return '';
  let parts = rangeStr.split(' - ');
  if (parts.length < 2) {
    parts = rangeStr.split('-'); // Try splitting by hyphen if " - " isn't present
  }
  if (parts.length === 2) {
    return `${formatMonthYear(parts[0])} — ${formatMonthYear(parts[1])}`;
  }
  return rangeStr;
}

export default function Experience() {
  const [experiences, setExperiences] = React.useState([]);
  
  React.useEffect(() => {
    fetch('http://localhost:3001/api/experiences')
      .then(res => res.json())
      .then(data => setExperiences(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <section className="section">
      <div className="container">
        <span className="section-number">05</span>
        <h2 className="oversized-text" style={{ marginBottom: 'var(--space-xl)' }}>EXPERIENCE</h2>
        
        <div style={{ marginTop: 'var(--space-xl)' }}>
          {experiences.map((exp, index) => (
            <ExperienceItem key={exp.id || index} exp={{
              year: formatDateRange(exp.startDate),
              role: exp.position,
              company: exp.company,
              desc: exp.description
            }} />
          ))}
        </div>
      </div>
    </section>
  );
}
