import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, UserCircle, Settings, Image as ImageIcon, Zap, Star, Link as LinkIcon, MoveLeft, BookOpen } from 'lucide-react';
import ToastContainer from '../components/ToastContainer';

export default function AdminLayout() {
  const location = useLocation();
  
  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          padding: '10px 16px', 
          borderRadius: '8px', 
          backgroundColor: isActive ? '#1a1a1a' : 'transparent', 
          color: isActive ? '#ffffff' : 'var(--text-muted)', 
          fontWeight: isActive ? 500 : 400, 
          textDecoration: 'none',
          fontSize: '14px',
          marginBottom: '4px',
          transition: 'all 0.2s ease'
        }}
      >
        <Icon size={18} />
        {label}
      </Link>
    );
  };

  const CategoryLabel = ({ children }) => (
    <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', color: '#444444', textTransform: 'uppercase', margin: '24px 0 12px 16px' }}>
      {children}
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--bg)', color: 'var(--text-h)', fontFamily: 'system-ui, sans-serif', overflow: 'hidden' }}>
      <ToastContainer />
      
      {/* Sidebar */}
      <aside style={{ width: '280px', backgroundColor: '#0a0a0a', borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto' }}>
        <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '28px', height: '28px', backgroundColor: '#38bdf8', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
            <Zap size={16} fill="currentColor" />
          </div>
          <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: '#fff' }}>CMS Panel</h2>
        </div>
        
        <nav style={{ padding: '0 12px', flex: 1, overflowY: 'auto' }}>
          <CategoryLabel>Overview</CategoryLabel>
          <NavItem to="/" icon={LayoutDashboard} label="Analytics Dashboard" />
          
          <CategoryLabel>Content</CategoryLabel>
          <NavItem to="/hero" icon={ImageIcon} label="Hero Section" />
          <NavItem to="/about-section" icon={UserCircle} label="About Section" />
          <NavItem to="/projects" icon={LayoutDashboard} label="Skills & Works" />
          <NavItem to="/case-studies" icon={BookOpen} label="Case Studies" />
          <NavItem to="/experience" icon={Star} label="Experience" />
          
          <CategoryLabel>Configuration</CategoryLabel>
          <NavItem to="/settings" icon={Settings} label="Global Settings" />
          <NavItem to="/nav" icon={LinkIcon} label="Navbar Links" />
        </nav>
        
        <div style={{ padding: '24px', marginTop: 'auto' }}>
          <a href="http://localhost:5173" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px' }}>
            <MoveLeft size={16} />
            Back to Portfolio
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#0a0a0a', overflowY: 'auto' }}>
        {/* Page Content */}
        <div style={{ padding: '48px', flex: 1 }}>
          <Outlet />
        </div>
      </main>
      
    </div>

  );
}
