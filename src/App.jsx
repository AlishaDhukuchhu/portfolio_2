import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import { motion, useScroll, useSpring } from 'framer-motion';
import CustomCursor from './components/CustomCursor';
import ThemeToggle from './components/ThemeToggle';
import Home from './pages/Home';
import CaseStudy from './pages/CaseStudy';

function GlobalScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '4px', zIndex: 9999, pointerEvents: 'none' }}>
      {/* Background track line */}
      <div style={{ position: 'absolute', top: '2px', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
      {/* Neon Progress line */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: '#C8FF00',
          transformOrigin: '0%',
          scaleX
        }}
      />
    </div>
  );
}

function GlobalVideoBackground() {
  return (
    <video
      src="/generate_video_from_this_image.mp4"
      autoPlay
      loop
      muted
      playsInline
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        objectFit: 'cover',
        opacity: 0.15,
        mixBlendMode: 'screen',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <BrowserRouter>
      <GlobalVideoBackground />
      <GlobalScrollProgress />
      <CustomCursor />
      <ThemeToggle />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<CaseStudy />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
