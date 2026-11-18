import React, { useState, useEffect } from 'react';
import { UserCircle } from 'lucide-react';
import { toast } from '../utils/toast';

export default function AboutSection() {
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    heading: 'DESIGNING\\nWITH\\nPURPOSE.',
    subtext: "I'm a UI/UX Designer focused on creating intuitive, scalable and visually refined digital products.",
    experienceLabel: '4+ Years',
    locationLabel: 'Remote, Worldwide',
    skills: 'UI/UX Design, Wireframing, Prototyping, Design Systems, Interaction Design',
    tools: 'Figma, Framer, React, Adobe CC, Webflow',
    portraitImage: ''
  });

  useEffect(() => {
    fetch('http://localhost:3001/api/settings/about_section')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setFormData(data);
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
      body: JSON.stringify({ key: 'about_section', value: formData })
    })
    .then(() => toast.success('About section saved successfully!'))
    .catch(() => toast.error('Failed to save about section.'));
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#f3f4f6', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserCircle size={20} color="#38bdf8" /> About Section
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0, paddingBottom: '24px', borderBottom: '1px solid #1f1f1f' }}>
          Update the content for the 02 section (About).
        </p>
      </div>

      <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '32px' }}>
        
        {loading ? (
          <div style={{ color: '#9ca3af', fontSize: '13px' }}>Loading about content...</div>
        ) : (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Heading */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                HEADING (Use \\n for line breaks)
              </label>
              <textarea 
                required 
                name="heading" 
                className="cms-input cms-textarea" 
                style={{ backgroundColor: '#161616', color: '#f3f4f6', minHeight: '80px', resize: 'vertical' }} 
                value={formData.heading} 
                onChange={handleChange} 
              />
            </div>

            {/* Subtext */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                SUBTEXT
              </label>
              <textarea 
                required 
                name="subtext" 
                className="cms-input cms-textarea" 
                style={{ backgroundColor: '#161616', color: '#f3f4f6', minHeight: '80px', resize: 'vertical' }} 
                value={formData.subtext} 
                onChange={handleChange} 
              />
            </div>

            {/* Experience & Location */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                  EXPERIENCE LABEL
                </label>
                <input 
                  required 
                  type="text" 
                  name="experienceLabel" 
                  className="cms-input" 
                  style={{ backgroundColor: '#161616', color: '#f3f4f6' }} 
                  value={formData.experienceLabel} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                  LOCATION LABEL
                </label>
                <input 
                  required 
                  type="text" 
                  name="locationLabel" 
                  className="cms-input" 
                  style={{ backgroundColor: '#161616', color: '#f3f4f6' }} 
                  value={formData.locationLabel} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            {/* Skills & Tools */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                SKILLS (COMMA SEPARATED)
              </label>
              <input 
                required 
                type="text" 
                name="skills" 
                className="cms-input" 
                style={{ backgroundColor: '#161616', color: '#f3f4f6' }} 
                value={formData.skills} 
                onChange={handleChange} 
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                TOOLS (COMMA SEPARATED)
              </label>
              <input 
                required 
                type="text" 
                name="tools" 
                className="cms-input" 
                style={{ backgroundColor: '#161616', color: '#f3f4f6' }} 
                value={formData.tools} 
                onChange={handleChange} 
              />
            </div>

            {/* Portrait Image */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px 0' }}>
                PORTRAIT IMAGE (JPG/PNG)
              </label>
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
                Save About Content
              </button>
            </div>
            
          </form>
        )}
      </div>

    </div>
  );
}
