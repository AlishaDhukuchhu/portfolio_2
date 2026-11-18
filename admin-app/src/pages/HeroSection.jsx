import React, { useState, useEffect } from 'react';
import { LayoutGrid } from 'lucide-react';
import { toast } from '../utils/toast';

export default function HeroSection() {
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    introText: 'Hey There! Albert Wilson Here',
    heading1: 'DESIGN',
    heading2: 'PARTNER',
    subtext: 'I believe in the power of innovation and creativity to transform your ideas into exceptional digital experiences. Working closely with you, I strive to bring your vision to life.',
    portraitImage: ''
  });

  useEffect(() => {
    fetch('http://localhost:3001/api/settings/hero_section')
      .then(res => res.json())
      .then(data => {
        if (data) {
          // Fallback mapping if they had old data
          setFormData({
            introText: data.introText || data.statusLabel || 'Hey There! Albert Wilson Here',
            heading1: data.heading1 || 'DESIGN',
            heading2: data.heading2 || 'PARTNER',
            subtext: data.subtext || 'I believe in the power of innovation...',
            portraitImage: data.portraitImage || data.backgroundImage || ''
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadData = new FormData();
    uploadData.append('file', file);
    try {
      const res = await fetch('http://localhost:3001/api/media', {
        method: 'POST',
        body: uploadData
      });
      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({ ...prev, [fieldName]: data.url }));
      }
    } catch (err) {
      toast.error('Failed to upload image.');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'hero_section', value: formData })
    })
    .then(() => toast.success('Hero content saved successfully!'))
    .catch(() => toast.error('Failed to save hero content.'));
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#f3f4f6', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LayoutGrid size={20} color="#38bdf8" /> Hero Section
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0, paddingBottom: '24px', borderBottom: '1px solid #1f1f1f' }}>
          Update your main landing page text and images.
        </p>
      </div>

      <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '32px' }}>
        
        {loading ? (
          <div style={{ color: '#9ca3af', fontSize: '13px' }}>Loading hero content...</div>
        ) : (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Intro Text */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                INTRO TEXT (TOP LEFT)
              </label>
              <input 
                required 
                type="text" 
                name="introText" 
                className="cms-input" 
                style={{ backgroundColor: '#161616', color: '#f3f4f6' }} 
                value={formData.introText} 
                onChange={handleChange} 
              />
            </div>

            {/* Main Word 1 */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                MAIN HEADLINE - FIRST WORD
              </label>
              <input 
                required 
                type="text" 
                name="heading1" 
                className="cms-input" 
                style={{ backgroundColor: '#161616', color: '#f3f4f6' }} 
                value={formData.heading1} 
                onChange={handleChange} 
              />
            </div>

            {/* Main Word 2 */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                MAIN HEADLINE - SECOND WORD
              </label>
              <input 
                required 
                type="text" 
                name="heading2" 
                className="cms-input" 
                style={{ backgroundColor: '#161616', color: '#f3f4f6' }} 
                value={formData.heading2} 
                onChange={handleChange} 
              />
            </div>

            {/* Hero Subtext */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                HERO SUBTEXT
              </label>
              <textarea 
                required 
                name="subtext" 
                className="cms-input cms-textarea" 
                style={{ backgroundColor: '#161616', color: '#f3f4f6', minHeight: '100px', resize: 'vertical' }} 
                value={formData.subtext} 
                onChange={handleChange} 
              />
            </div>

            {/* Portrait Image */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                PORTRAIT IMAGE (JPG/PNG)
              </label>
              <p style={{ fontSize: '11px', color: '#4b5563', margin: '0 0 12px 0' }}>Will be automatically converted to a halftone pattern.</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', backgroundColor: '#161616', border: '1px dashed #333', borderRadius: '8px' }}>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg"
                  onChange={(e) => handleFileUpload(e, 'portraitImage')}
                  style={{ color: '#9ca3af', fontSize: '13px', display: 'block', flex: 1 }} 
                />
                {formData.portraitImage && (
                  <img src={formData.portraitImage} alt="Portrait preview" style={{ width: '80px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #333' }} />
                )}
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <button type="submit" className="btn-primary">
                Save Hero Content
              </button>
            </div>
            
          </form>
        )}
      </div>

    </div>
  );
}
