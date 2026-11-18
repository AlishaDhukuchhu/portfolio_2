import React, { useState } from 'react';
import { UserCircle } from 'lucide-react';

export default function AboutMe() {
  const [formData, setFormData] = useState({
    description: "I'm a passionate designer who loves creating intuitive and visually stunning digital experiences. With a background in both design and code, I bridge the gap between aesthetics and functionality.",
    clientsStat: "40+",
    trustLevel: "100%",
    dribbble: "https://dribbble.com/...",
    instagram: "https://instagram.com/...",
    email: "mailto:you@example.com",
    linkedin: "https://linkedin.com/in/..."
  });

  const [skills, setSkills] = useState(['User Research']);
  const [newSkill, setNewSkill] = useState('');
  const [selectedTools, setSelectedTools] = useState(['Figma', 'Framer', 'Adobe CC', 'React', 'Next.js', 'Tailwind', 'VS Code', 'Antigravity', 'Claude', 'ChatGPT', 'Premiere Pro', 'After Effects', 'Photoshop', 'Illustrator', 'Google Sheets', 'Google Docs']);

  const availableTools = [
    'Figma', 'Framer', 'Webflow', 'Adobe CC', 'React', 'Next.js', 'Tailwind', 
    'VS Code', 'Antigravity', 'Claude', 'ChatGPT', 'Premiere Pro', 'After Effects', 
    'Photoshop', 'Illustrator', 'Google Sheets', 'Google Docs'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const toggleTool = (tool) => {
    if (selectedTools.includes(tool)) {
      setSelectedTools(selectedTools.filter(t => t !== tool));
    } else {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#f3f4f6', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <UserCircle size={24} color="#38bdf8" />
          About Me
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
          Update your profile, description, stats, and links.
        </p>
      </div>

      {/* Main Card */}
      <div className="cms-card">
        
        {/* Profile Image Section */}
        <div style={{ marginBottom: '32px' }}>
          <label className="cms-label" style={{ fontSize: '15px' }}>Profile Image</label>
          <span style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>
            Recommended resolution: 1080x1080px (1:1 Square)
          </span>
          <input 
            type="file" 
            style={{ color: '#9ca3af', fontSize: '13px' }} 
          />
        </div>

        {/* Main Description */}
        <div style={{ marginBottom: '32px' }}>
          <label className="cms-label">Main Description</label>
          <textarea 
            name="description"
            className="cms-input cms-textarea"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '48px', paddingBottom: '32px', borderBottom: '1px solid #1f1f1f' }}>
          <div>
            <label className="cms-label">Clients Stat (e.g. 40+)</label>
            <input 
              type="text" 
              name="clientsStat"
              className="cms-input"
              value={formData.clientsStat}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="cms-label">Trust Level (e.g. 100%)</label>
            <input 
              type="text" 
              name="trustLevel"
              className="cms-input"
              value={formData.trustLevel}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Social Links Grid */}
        <div style={{ marginBottom: '48px', paddingBottom: '32px', borderBottom: '1px solid #1f1f1f' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#f3f4f6', margin: '0 0 16px 0' }}>Social Links</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <label className="cms-label">Dribbble Link</label>
              <input type="text" name="dribbble" className="cms-input" value={formData.dribbble} onChange={handleChange} />
            </div>
            <div>
              <label className="cms-label">Instagram Link</label>
              <input type="text" name="instagram" className="cms-input" value={formData.instagram} onChange={handleChange} />
            </div>
            <div>
              <label className="cms-label">E-mail Link</label>
              <input type="text" name="email" className="cms-input" value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <label className="cms-label">LinkedIn Link</label>
              <input type="text" name="linkedin" className="cms-input" value={formData.linkedin} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Skill Stack */}
        <div style={{ marginBottom: '48px', paddingBottom: '32px', borderBottom: '1px solid #1f1f1f' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#f3f4f6', margin: '0 0 8px 0' }}>Skill Stack</h3>
          <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 16px 0' }}>Type a skill and click Add.</p>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <input 
              type="text" 
              placeholder="e.g. User Research"
              className="cms-input"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSkill()}
            />
            <button 
              onClick={addSkill}
              className="btn-ghost"
              style={{ whiteSpace: 'nowrap' }}
            >
              Add
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {skills.map(skill => (
              <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: '#161616', border: '1px solid #2a2a2a', borderRadius: '24px', fontSize: '12px', color: '#f3f4f6' }}>
                {skill}
                <button onClick={() => removeSkill(skill)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0, fontSize: '14px', display: 'flex', alignItems: 'center' }}>&times;</button>
              </div>
            ))}
          </div>
        </div>

        {/* Tool Stack */}
        <div style={{ marginBottom: '48px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#f3f4f6', margin: '0 0 8px 0' }}>Tool Stack</h3>
          <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 16px 0' }}>Select the tools you want to display in the marquee.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {availableTools.map(tool => {
              const isSelected = selectedTools.includes(tool);
              return (
                <button
                  key={tool}
                  onClick={() => toggleTool(tool)}
                  className={`btn-filter${isSelected ? ' btn-filter--active' : ''}`}
                >
                  {tool}
                </button>
              );
            })}
          </div>
        </div>

        {/* Save Button */}
        <div>
          <button className="btn-primary">
            Save About Me
          </button>
        </div>

      </div>

    </div>
  );
}
