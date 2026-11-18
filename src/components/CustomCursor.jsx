import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCursor } from '../context/CursorContext';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { cursorType, cursorText } = useCursor();
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  if (isTouch) return null;

    const variants = {
    default: {
      x: mousePosition.x - 10,
      y: mousePosition.y - 10,
      height: 20,
      width: 20,
      backgroundImage: 'linear-gradient(135deg, #ff4a2e, #aa3bff)',
      backgroundColor: 'transparent',
      border: '0px solid transparent',
      mixBlendMode: 'normal',
      opacity: 1
    },
    view: {
      x: mousePosition.x - 40,
      y: mousePosition.y - 40,
      height: 80,
      width: 80,
      backgroundImage: 'none',
      backgroundColor: 'var(--accent)',
      border: '0px solid transparent',
      mixBlendMode: 'normal',
      opacity: 1
    },
    hover: {
      x: mousePosition.x - 20,
      y: mousePosition.y - 20,
      height: 40,
      width: 40,
      backgroundImage: 'none',
      backgroundColor: 'transparent',
      border: '2px solid #aa3bff',
      opacity: 1
    }
  };

  return (
    <motion.div
      className="custom-cursor"
      variants={variants}
      animate={cursorType}
      transition={{ type: 'spring', mass: 0.05, stiffness: 800, damping: 40 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--bg-color)',
        fontSize: '0.875rem',
        fontWeight: '700',
        letterSpacing: '1px'
      }}
    >
      {cursorType === 'view' && cursorText}
    </motion.div>
  );
}
