import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectForm from './pages/ProjectForm';
import CaseStudies from './pages/CaseStudies';
import CaseStudyBuilder from './pages/CaseStudyBuilder';
import Experience from './pages/Experience';
import MediaLibrary from './pages/MediaLibrary';
import Settings from './pages/Settings';
import NavbarLinks from './pages/NavbarLinks';
import AboutMe from './pages/AboutMe';
import HeroSection from './pages/HeroSection';
import AboutSection from './pages/AboutSection';
import Login from './pages/Login';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:3001/api/auth/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.valid) setIsAuthenticated(true);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/" />} />
        
        <Route path="/" element={isAuthenticated ? <AdminLayout /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/new" element={<ProjectForm />} />
          <Route path="projects/edit/:id" element={<ProjectForm />} />
          <Route path="case-studies" element={<CaseStudies />} />
          <Route path="case-studies/:id" element={<CaseStudyBuilder />} />
          <Route path="experience" element={<Experience />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="settings" element={<Settings />} />
          <Route path="nav" element={<NavbarLinks />} />
          <Route path="about" element={<AboutMe />} />
          <Route path="hero" element={<HeroSection />} />
          <Route path="about-section" element={<AboutSection />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
