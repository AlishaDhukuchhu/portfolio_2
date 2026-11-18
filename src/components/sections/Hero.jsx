import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useCursor } from '../../context/CursorContext';
import { ArrowRight, FileText } from 'lucide-react';

// Background Wave Component
const WaveBackground = () => (
  <div style={{
    position: 'absolute',
    top: '-50%', left: '-50%', right: '-50%', bottom: '-50%',
    backgroundImage: `radial-gradient(ellipse at 0% 50%, rgba(200,255,0,0.08) 0%, transparent 50%)`,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    zIndex: 0,
    pointerEvents: 'none',
  }}>
    <motion.div
      animate={{
        backgroundPosition: ['0% 0%', '100% 100%']
      }}
      transition={{
        duration: 30,
        ease: "linear",
        repeat: Infinity,
        repeatType: "reverse"
      }}
      style={{
        width: '100%', height: '100%',
        background: `repeating-radial-gradient(circle at 0% 50%, transparent 0, #0a0a0a 2px, transparent 6px)`,
        opacity: 0.5
      }}
    />
  </div>
);

// Decorative Starburst Component
const Starburst = () => (
  <motion.svg 
    width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    animate={{ rotate: 360 }}
    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
    style={{ display: 'inline-block', marginLeft: '24px', verticalAlign: 'middle' }}
  >
    <path d="M12 0L12.5 10.5L24 12L12.5 13.5L12 24L11.5 13.5L0 12L11.5 10.5L12 0Z" fill="#C8FF00"/>
    <path d="M4.5 4.5L10 10L19.5 4.5L14 10L19.5 19.5L14 14L4.5 19.5L10 14L4.5 4.5Z" fill="#C8FF00" opacity="0.5"/>
  </motion.svg>
);

// Overlapping Circles with Line
const CircleDecor = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <div style={{ position: 'relative', width: '90px', height: '40px' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(200, 255, 0, 0.6)', position: 'absolute', top: 0, left: 0 }}></div>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(200, 255, 0, 0.6)', position: 'absolute', top: 0, left: 25 }}></div>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(200, 255, 0, 0.6)', position: 'absolute', top: 0, left: 50 }}></div>
    </div>
    <div style={{ width: '100px', height: '1px', backgroundColor: 'rgba(255,255,255,0.2)', marginLeft: '10px' }}></div>
  </div>
);

// Glassy Button Component
const GlassButton = ({ children, onClick, onMouseEnter, onMouseLeave }) => (
  <motion.button
    whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)', scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 28px',
      borderRadius: '999px',
      border: '1px solid rgba(255,255,255,0.2)',
      backgroundColor: 'rgba(255,255,255,0.02)',
      color: '#fff',
      fontSize: '1rem',
      fontWeight: 500,
      cursor: 'pointer',
      backdropFilter: 'blur(10px)',
      pointerEvents: 'auto'
    }}
  >
    {children}
  </motion.button>
);

export default function Hero() {
  const { mouseEnterHandler, mouseLeaveHandler } = useCursor();
  const [heroData, setHeroData] = useState(null);

  // Parallax setup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  
  const portraitX = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);
  const portraitY = useTransform(smoothY, [-0.5, 0.5], [-20, 20]);
  
  const textX = useTransform(smoothX, [-0.5, 0.5], [10, -10]);
  const textY = useTransform(smoothY, [-0.5, 0.5], [10, -10]);

  useEffect(() => {
    fetch('http://localhost:3001/api/settings/hero_section')
      .then(res => res.json())
      .then(data => {
        if (data) setHeroData(data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX / innerWidth - 0.5);
    mouseY.set(clientY / innerHeight - 0.5);
  };

  const nameIntro = heroData?.introText?.trim() || heroData?.statusLabel?.trim() || "Hey There! Albert Wilson Here";
  const mainWord1 = heroData?.heading1?.trim() || "DESIGN";
  const mainWord2 = heroData?.heading2?.trim() || "PARTNER";
  
  const subtext = heroData?.subtext?.trim() || "I believe in the power of innovation and creativity to transform your ideas into exceptional digital experiences. Working closely with you, I strive to bring your vision to life.";
  
  const portraitImg = heroData?.portraitImage || heroData?.backgroundImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000';

  const wordVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      style={{ 
        height: '100vh', 
        width: '100%',
        backgroundColor: 'transparent', 
        position: 'relative',
        overflow: 'hidden',
        color: '#f9f9f9',
        fontFamily: '"Inter Tight", "Neue Montreal", "Helvetica Neue", sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <WaveBackground />

      {/* Top Thin Line & Accent (Removed - moved to global App.jsx) */}

      {/* Background Halftone Portrait */}
      <motion.div 
        style={{ 
          position: 'absolute', 
          bottom: '0', 
          right: '0', 
          width: '50vw', 
          height: '100vh',
          zIndex: 2,
          x: portraitX,
          y: portraitY
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 2, delay: 0.2 }}
      >
        <img 
          src={portraitImg} 
          alt="Designer Portrait" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            objectPosition: 'center',
            filter: 'grayscale(100%) contrast(200%) brightness(80%)',
            maskImage: 'linear-gradient(to right, transparent, black 40%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)'
          }} 
        />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)',
          backgroundSize: '6px 6px',
          opacity: 0.6,
          mixBlendMode: 'overlay'
        }}></div>
      </motion.div>

      {/* Main Content Area */}
      <div style={{ position: 'relative', zIndex: 10, padding: '0 8vw', pointerEvents: 'none' }}>
        <motion.div style={{ x: textX, y: textY, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Section Number (Consistent Style) */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="section-number"
            style={{ marginBottom: '0' }}
          >
            01
          </motion.span>

          {/* Intro Text */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
          >
            <p style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#fff' }}>
              {nameIntro}
            </p>
            <div style={{ width: '60px', height: '1px', backgroundColor: 'rgba(255,255,255,0.3)' }}></div>
          </motion.div>

          {/* Headline */}
          <motion.div initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            
            {/* First Word */}
            <motion.div variants={wordVariants} style={{ display: 'flex', alignItems: 'center' }}>
              <h1 style={{ 
                fontSize: 'clamp(5rem, 11vw, 12rem)', 
                fontWeight: 800, 
                lineHeight: 0.9,
                letterSpacing: '-0.02em',
                margin: 0,
                color: '#ffffff',
                textTransform: 'uppercase'
              }}>
                {mainWord1}
              </h1>
              <Starburst />
            </motion.div>

            {/* Second Word */}
            <motion.div variants={wordVariants} style={{ display: 'flex', alignItems: 'center', alignSelf: 'flex-start', paddingLeft: '8vw' }}>
              <CircleDecor />
              <h1 style={{ 
                fontSize: 'clamp(5rem, 11vw, 12rem)', 
                fontWeight: 800, 
                lineHeight: 0.9,
                letterSpacing: '-0.02em',
                margin: 0,
                color: '#ffffff',
                marginLeft: '24px',
                textTransform: 'uppercase'
              }}>
                {mainWord2}
              </h1>
            </motion.div>
          </motion.div>

          {/* Supporting Text & Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            style={{ maxWidth: '600px', marginTop: '16px' }}
          >
            <p style={{ 
              fontSize: 'clamp(1rem, 1.2vw, 1.1rem)', 
              lineHeight: 1.6, 
              color: '#d1d5db',
              fontWeight: 400,
              marginBottom: '24px'
            }}>
              {subtext}
            </p>
            
            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <GlassButton 
                onMouseEnter={() => mouseEnterHandler('hover')}
                onMouseLeave={mouseLeaveHandler}
                onClick={() => {
                  document.getElementById('work-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Check work <ArrowRight size={18} />
              </GlassButton>
              <GlassButton 
                onMouseEnter={() => mouseEnterHandler('hover')}
                onMouseLeave={mouseLeaveHandler}
                onClick={() => {
                  window.open('/resume.pdf', '_blank');
                }}
              >
                View Resume <FileText size={18} />
              </GlassButton>
            </div>
          </motion.div>

        </motion.div>
      </div>

    </section>
  );
}
