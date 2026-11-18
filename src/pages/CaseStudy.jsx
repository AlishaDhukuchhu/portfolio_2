import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCursor } from '../context/CursorContext';

export default function CaseStudy() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { mouseEnterHandler, mouseLeaveHandler } = useCursor();

  useEffect(() => {
    // We need to fetch the project by slug, but our API fetch currently returns all projects.
    // For now we'll fetch all and find the one that matches.
    fetch('http://localhost:3001/api/case-studies')
      .then(res => res.json())
      .then(data => {
        const proj = data.find(p => p.slug === slug);
        if (proj) {
          setProject(proj);
          // Now fetch the blocks for this project
          fetch(`http://localhost:3001/api/case-studies/${proj.id}/blocks`)
            .then(res => res.json())
            .then(blocksData => {
              setBlocks(blocksData);
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    // Reset scroll when navigating to a new case study
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="section container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 className="oversized-text" style={{ fontSize: 'var(--text-3xl)' }}>Loading...</h2>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="section container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-md)' }}>
        <h2 className="oversized-text" style={{ fontSize: 'var(--text-4xl)' }}>Project not found</h2>
        <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={20} /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '10vh' }}>
      {/* Header section */}
      <section className="section" style={{ paddingTop: '20vh' }}>
        <div className="container">
          <Link 
            to="/" 
            style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-xl)' }}
            onMouseEnter={() => mouseEnterHandler('hover', '')}
            onMouseLeave={mouseLeaveHandler}
          >
            <ArrowLeft size={20} /> Back to Work
          </Link>
          
          <motion.h1 
            className="oversized-text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {project.title}
          </motion.h1>

          <motion.div 
            style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 'var(--space-xl)', 
              marginTop: 'var(--space-xl)', 
              paddingTop: 'var(--space-md)', 
              borderTop: '1px solid var(--border-subtle)' 
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {project.category && (
              <div>
                <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Category</span>
                <span style={{ fontSize: 'var(--text-lg)' }}>{project.category}</span>
              </div>
            )}
            {project.role && (
              <div>
                <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Role</span>
                <span style={{ fontSize: 'var(--text-lg)' }}>{project.role}</span>
              </div>
            )}
            {project.year && (
              <div>
                <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Year</span>
                <span style={{ fontSize: 'var(--text-lg)' }}>{project.year}</span>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Hero Image */}
      {(project.heroImage || project.thumbnail) && (
        <section className="container" style={{ marginBottom: '10vh' }}>
          <motion.div 
            style={{ width: '100%', height: '70vh', borderRadius: '16px', overflow: 'hidden' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <img src={project.heroImage || project.thumbnail} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>
        </section>
      )}

      {/* Blocks Content */}
      <section className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
          {blocks.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontStyle: 'italic' }}>More details coming soon...</p>
          ) : (
            blocks.map((block) => {
              if (!block.content) return null;
              
              switch (block.type) {
                case 'Heading':
                  return (
                    <h2 key={block.id} className="oversized-text" style={{ fontSize: 'var(--text-4xl)', marginTop: 'var(--space-lg)' }}>
                      {block.content}
                    </h2>
                  );
                case 'Paragraph':
                  return (
                    <p key={block.id} style={{ fontSize: 'var(--text-xl)', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {block.content}
                    </p>
                  );
                case 'Image':
                  return (
                    <div key={block.id} style={{ borderRadius: '12px', overflow: 'hidden', margin: 'var(--space-md) 0' }}>
                      <img src={block.content} alt="Case study visual" style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                  );
                default:
                  return null;
              }
            })
          )}
        </div>
      </section>

      {/* Footer Navigation */}
      <section className="container" style={{ marginTop: '15vh' }}>
        <div style={{ padding: 'var(--space-2xl) 0', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
          <h2 className="oversized-text" style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-lg)' }}>Have a project in mind?</h2>
          <Link 
            to="/" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '16px 32px', 
              backgroundColor: 'var(--text-primary)', 
              color: 'var(--bg-color)', 
              borderRadius: '100px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 'var(--text-lg)'
            }}
            onMouseEnter={() => mouseEnterHandler('hover', '')}
            onMouseLeave={mouseLeaveHandler}
          >
            Let's Talk
          </Link>
        </div>
      </section>
    </div>
  );
}
