import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCursor } from '../../context/CursorContext';
import { ArrowUpRight } from 'lucide-react';


const ProjectCard = ({ project }) => {
  const { mouseEnterHandler, mouseLeaveHandler } = useCursor();
  const cardRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["0 1", "0.5 1"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.7, 1]);

  return (
    <motion.div 
      ref={cardRef}
      style={{ scale, y, opacity, marginBottom: 'var(--space-2xl)' }}
      className="project-card"
    >
      <Link to={`/work/${project.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div 
        style={{ 
          position: 'relative', 
          overflow: 'hidden', 
          borderRadius: '16px',
          aspectRatio: '16/9',
          marginBottom: 'var(--space-md)'
        }}
        onMouseEnter={() => mouseEnterHandler('view', 'VIEW')}
        onMouseLeave={mouseLeaveHandler}
      >
        <motion.img 
          src={project.thumbnail || project.heroImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1964'} 
          alt={project.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
        <div>
          <motion.h3 
            className="oversized-text" 
            style={{ 
              fontSize: 'clamp(1.5rem, 4vw, var(--text-4xl))', 
              marginBottom: 'var(--space-xs)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              lineHeight: 1.1,
              whiteSpace: 'nowrap'
            }}
            whileHover={{ x: 8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <span>{project.title}</span>
            <motion.span 
              style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}
              whileHover={{ x: 5 }}
            >
              <ArrowUpRight size={32} />
            </motion.span>
          </motion.h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)' }}>{project.category}</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <p style={{ fontSize: 'var(--text-lg)' }}>{project.desc}</p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            borderTop: '1px solid var(--border-subtle)', 
            paddingTop: 'var(--space-sm)',
            marginTop: 'auto'
          }}>
            <span style={{ color: 'var(--text-secondary)' }}>{project.role}</span>
            <span style={{ color: 'var(--text-secondary)' }}>{project.platform}</span>
            <span style={{ color: 'var(--text-secondary)' }}>{project.year}</span>
          </div>
        </div>
      </div>
      </Link>
    </motion.div>
  );
};

const HorizontalScroll = ({ projects }) => {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const n = Math.max(1, projects.length);
  const endX = `-${((n - 1) / n) * 100}%`;
  
  const x = useTransform(scrollYProgress, [0, 1], ["0%", endX]);



  return (
    <div 
      ref={containerRef} 
      style={{ height: `${n * 75}vh`, position: 'relative' }}
    >
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        overflow: 'hidden' 
      }}>
        <motion.div 
          style={{ x, display: 'flex', gap: 'var(--space-xl)', padding: '0 5vw' }}
        >
          {projects.map((project) => (
            <div 
              key={`all-${project.id}`} 
              style={{ 
                width: '80vw', 
                flexShrink: 0,
              }}
            >
              <Link to={`/work/${project.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', aspectRatio: '16/9', marginBottom: 'var(--space-md)' }}>
                  <img src={project.thumbnail || project.heroImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1964'} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h3 className="oversized-text" style={{ fontSize: 'var(--text-3xl)', lineHeight: 1.1 }}>{project.title}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{project.category}</p>
              </Link>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default function SelectedWork() {
  const [projects, setProjects] = React.useState([]);
  const [activeCategory, setActiveCategory] = React.useState('All');
  
  React.useEffect(() => {
    fetch('http://localhost:3001/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error(err));
  }, []);

  const categories = ['All', 'Website', 'Web App', 'Mobile App', 'Branding'];
  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <section className="section" style={{ position: 'relative' }}>
      <div className="container" style={{ marginBottom: 'var(--space-xl)' }}>
        <span className="section-number">03</span>
        <h2 className="oversized-text">SELECTED WORK</h2>
      </div>

      <div className="container">
        {projects.filter(p => p.isFeatured).map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        {projects.filter(p => p.isFeatured).length === 0 && (
          <p style={{ color: 'var(--text-secondary)' }}>No featured work selected yet.</p>
        )}
      </div>

      {/* ALL WORK Section */}
      <div className="container" style={{ marginTop: 'var(--space-3xl)', marginBottom: 'var(--space-xl)' }}>
        <h2 className="oversized-text" style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', marginBottom: 'var(--space-md)' }}>ALL PROJECTS</h2>
        
        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '10px 24px',
                borderRadius: '100px',
                border: `1px solid ${activeCategory === cat ? '#C8FF00' : 'rgba(255,255,255,0.15)'}`,
                backgroundColor: activeCategory === cat ? 'rgba(200, 255, 0, 0.1)' : 'rgba(255,255,255,0.02)',
                color: activeCategory === cat ? '#C8FF00' : '#d1d5db',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal scroll section */}
      {filteredProjects.length > 0 ? (
        <HorizontalScroll key={activeCategory} projects={filteredProjects} />
      ) : (
        <div className="container" style={{ paddingBottom: '10vh' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>No projects found in this category.</p>
        </div>
      )}
    </section>
  );
}
