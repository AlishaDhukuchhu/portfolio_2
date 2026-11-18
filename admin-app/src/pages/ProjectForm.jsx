import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LayoutDashboard, MoveLeft } from 'lucide-react';
import { toast } from '../utils/toast';

export default function ProjectForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDesc: '',
    fullDesc: '',
    category: '',
    industry: '',
    tools: '',
    projectUrl: '',
    thumbnail: '',
    status: 'Draft',
    isFeatured: false
  });

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3001/api/projects`)
        .then(res => res.json())
        .then(data => {
          const project = data.find(p => p.id === id);
          if (project) {
            setFormData({
              title: project.title || '',
              slug: project.slug || '',
              shortDesc: project.shortDesc || '',
              fullDesc: project.fullDesc || '',
              category: project.category || '',
              industry: project.industry || '',
              tools: project.tools || '',
              projectUrl: project.projectUrl || '',
              thumbnail: project.thumbnail || '',
              status: project.status || 'Draft',
              isFeatured: project.isFeatured || false
            });
          }
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const url = id ? `http://localhost:3001/api/projects/${id}` : 'http://localhost:3001/api/projects';
    const method = id ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(() => {
      navigate('/projects');
    })
    .catch(err => toast.error('Failed to save project.'));
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/projects')}
        className="btn-icon"
        style={{ padding: '0 0 24px 0', fontSize: '14px' }}
      >
        <MoveLeft size={16} /> Back to Projects
      </button>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#f3f4f6', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LayoutDashboard size={24} color="#38bdf8" />
          {id ? 'Edit Project' : 'Add New Project'}
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
          {id ? 'Update your project details below.' : 'Create a new project in your Skills & Works portfolio.'}
        </p>
      </div>

      <div className="cms-card">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div>
            <label className="cms-label">Project Title</label>
            <input required type="text" name="title" className="cms-input" value={formData.title} onChange={handleChange} />
          </div>

          <div>
            <label className="cms-label">Slug (URL endpoint)</label>
            <input required type="text" name="slug" className="cms-input" value={formData.slug} onChange={handleChange} />
          </div>

          <div>
            <label className="cms-label">Short Description</label>
            <textarea name="shortDesc" className="cms-input cms-textarea" style={{ minHeight: '80px' }} value={formData.shortDesc} onChange={handleChange} />
          </div>

          <div>
            <label className="cms-label">Category</label>
            <select name="category" className="cms-input" value={formData.category} onChange={handleChange} style={{ appearance: 'auto' }}>
              <option value="" disabled>Select a category</option>
              <option value="Website">Website</option>
              <option value="Web App">Web App</option>
              <option value="Mobile App">Mobile App</option>
              <option value="Branding">Branding</option>
            </select>
          </div>

          {/* ── About This Project ───────────────────────────── */}
          <div style={{ borderTop: '1px solid #222', paddingTop: '28px' }}>
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 20px 0' }}>About This Project</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              <div>
                <label className="cms-label">Project Description</label>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 10px 0' }}>Describe what this project is about, the problem it solves, and the approach taken.</p>
                <textarea
                  name="fullDesc"
                  className="cms-input cms-textarea"
                  style={{ minHeight: '140px' }}
                  placeholder="e.g. A redesign of the checkout flow for an e-commerce platform, reducing drop-off by 32%..."
                  value={formData.fullDesc}
                  onChange={handleChange}
                />
              </div>

              {/* Industry / Field */}
              <div>
                <label className="cms-label">Industry / Field</label>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 12px 0' }}>Select the industry this project belongs to.</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {[
                    'Healthcare', 'Education', 'E-Commerce', 'Finance & Fintech',
                    'Real Estate', 'SaaS', 'Travel & Hospitality', 'Food & Beverage',
                    'Fashion & Retail', 'Media & Entertainment', 'Non-Profit',
                    'Government', 'Sports & Fitness', 'Technology', 'Automotive',
                    'Logistics', 'Legal', 'Agriculture', 'Beauty & Wellness', 'Other'
                  ].map(ind => (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => setFormData({ ...formData, industry: ind })}
                      className={`btn-filter${formData.industry === ind ? ' btn-filter--active' : ''}`}
                      style={{ fontSize: '12px' }}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
                {formData.industry && (
                  <p style={{ fontSize: '12px', color: '#38bdf8', margin: '10px 0 0 0' }}>✓ Selected: <strong>{formData.industry}</strong></p>
                )}
              </div>

              {/* Tools */}
              <div>
                <label className="cms-label">Tools Used</label>
                <input type="text" name="tools" className="cms-input" placeholder="e.g. Figma, React, Framer" value={formData.tools} onChange={handleChange} />
                <p style={{ fontSize: '11px', color: '#6b7280', margin: '6px 0 0 0' }}>Comma-separated list</p>
              </div>

            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <label className="cms-label">Project URL (Link)</label>
              <input type="url" name="projectUrl" className="cms-input" placeholder="https://..." value={formData.projectUrl} onChange={handleChange} />
            </div>
            <div>
              <label className="cms-label">Thumbnail Image</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={async (e) => {
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
                        setFormData({ ...formData, thumbnail: data.url });
                      }
                    } catch (err) {
                      toast.error('Failed to upload image.');
                    }
                  }}
                  style={{ color: '#9ca3af', fontSize: '13px', display: 'block' }} 
                />
                {formData.thumbnail && (
                  <img src={formData.thumbnail} alt="Thumbnail preview" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #222222' }} />
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <label className="cms-label">Status</label>
              <select name="status" className="cms-input" value={formData.status} onChange={handleChange} style={{ appearance: 'auto' }}>
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '32px' }}>
              <input 
                type="checkbox" 
                id="isFeatured" 
                name="isFeatured" 
                checked={formData.isFeatured} 
                onChange={handleChange} 
                style={{ width: '20px', height: '20px', accentColor: '#C8FF00', cursor: 'pointer' }}
              />
              <label htmlFor="isFeatured" style={{ color: '#f3f4f6', fontSize: '14px', cursor: 'pointer', userSelect: 'none' }}>
                Featured Project (Show on Homepage)
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button type="submit" className="btn-primary">
              Save Project
            </button>
            <button type="button" onClick={() => navigate('/projects')} className="btn-ghost">
              Cancel
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}
