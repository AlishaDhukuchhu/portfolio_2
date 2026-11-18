import React, { useState, useEffect } from 'react';
import { Trash2, Eye, GripVertical } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import { toast } from '../utils/toast';

export default function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [activeTab, setActiveTab] = useState('Experience');
  
  const [formData, setFormData] = useState({
    company: '', position: '', fromDate: '', toDate: '', description: '', spansMultiple: false, order: 0
  });

  const fetchExperiences = () => {
    fetch('http://localhost:3001/api/experiences')
      .then(res => res.json())
      .then(data => { setExperiences(data); setLoading(false); })
      .catch(err => { setError('Failed to fetch experience data.'); setLoading(false); });
  };

  useEffect(() => { fetchExperiences(); }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const finalStartDate = `${formData.fromDate} - ${formData.toDate || 'Present'}`;
    const { fromDate, toDate, ...dataToSave } = formData;
    const payload = { ...dataToSave, startDate: finalStartDate, order: parseInt(formData.order), type: activeTab };
    
    if (editingId) {
      fetch(`http://localhost:3001/api/experiences/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(res => res.ok ? res.json() : Promise.reject('Failed to update'))
      .then(() => {
        setFormData({ company: '', position: '', fromDate: '', toDate: '', description: '', spansMultiple: false, order: 0 });
        setEditingId(null);
        fetchExperiences();
      })
      .catch(err => toast.error('Failed to update entry.'));
    } else {
      fetch('http://localhost:3001/api/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(res => res.ok ? res.json() : Promise.reject('Failed to add'))
      .then(() => {
        setFormData({ company: '', position: '', fromDate: '', toDate: '', description: '', spansMultiple: false, order: 0 });
        fetchExperiences();
      })
      .catch(err => toast.error('Failed to add entry.'));
    }
  };

  const handleEdit = (exp) => {
    let from = '';
    let to = '';
    if (exp.startDate) {
      const parts = exp.startDate.split(' - ');
      from = parts[0] || '';
      to = parts[1] === 'Present' ? '' : (parts[1] || '');
    }
    setFormData({
      company: exp.company,
      position: exp.position,
      fromDate: from,
      toDate: to,
      description: exp.description || '',
      spansMultiple: !!exp.spansMultiple,
      order: exp.order || 0
    });
    setEditingId(exp.id);
  };

  const confirmDelete = (id) => {
    setExperienceToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if(!experienceToDelete) return;
    fetch(`http://localhost:3001/api/experiences/${experienceToDelete}`, { method: 'DELETE' })
      .then(() => {
        setIsDeleteModalOpen(false);
        fetchExperiences();
      });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({ company: '', position: '', fromDate: '', toDate: '', description: '', spansMultiple: false, order: 0 });
    setEditingId(null);
  };

  const visibleExperiences = experiences.filter(exp => exp.type === activeTab);

  return (
    <div style={{ maxWidth: '1200px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#f3f4f6', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#38bdf8' }}>💼</span> Experience & Journey
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0, paddingBottom: '24px', borderBottom: '1px solid #1f1f1f' }}>
          Manage your professional journey and freelance projects.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <button 
          onClick={() => handleTabChange('Experience')}
          className={`btn-tab${activeTab === 'Experience' ? ' btn-tab--active' : ''}`}
        >
          Experience
        </button>
        <button 
          onClick={() => handleTabChange('Freelance')}
          className={`btn-tab${activeTab === 'Freelance' ? ' btn-tab--active' : ''}`}
        >
          Freelance
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '48px' }}>
        
        {/* Left Column: Form */}
        <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#f3f4f6', margin: '0 0 24px 0' }}>{editingId ? `Edit ${activeTab}` : `Add ${activeTab}`}</h2>
          
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="cms-label" style={{ fontSize: '13px' }}>Company</label>
              <input required type="text" name="company" className="cms-input" style={{ backgroundColor: '#161616' }} value={formData.company} onChange={handleChange} />
            </div>

            <div>
              <label className="cms-label" style={{ fontSize: '13px' }}>Role</label>
              <input required type="text" name="position" className="cms-input" style={{ backgroundColor: '#161616' }} value={formData.position} onChange={handleChange} />
            </div>

            <div>
              <label className="cms-label" style={{ fontSize: '13px' }}>Duration (From - To)</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input required type="month" name="fromDate" className="cms-input" style={{ backgroundColor: '#161616' }} value={formData.fromDate} onChange={handleChange} />
                <span style={{ color: '#6b7280' }}>-</span>
                <input type="month" name="toDate" className="cms-input" style={{ backgroundColor: '#161616' }} value={formData.toDate} onChange={handleChange} />
              </div>
              <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px', marginBottom: 0 }}>Leave 'To' empty for "Present".</p>
            </div>

            <div>
              <label className="cms-label" style={{ fontSize: '13px' }}>Description</label>
              <textarea name="description" className="cms-input cms-textarea" style={{ backgroundColor: '#161616', minHeight: '100px', resize: 'vertical' }} value={formData.description} onChange={handleChange} />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#f3f4f6', cursor: 'pointer' }}>
                <input type="checkbox" name="spansMultiple" checked={formData.spansMultiple} onChange={handleChange} style={{ accentColor: '#38bdf8' }} />
                Spans multiple columns?
              </label>
            </div>

            <div>
              <label className="cms-label" style={{ fontSize: '13px' }}>Display Order</label>
              <input type="number" name="order" className="cms-input" style={{ backgroundColor: '#161616' }} value={formData.order} onChange={handleChange} />
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
              <button type="submit" className="btn-primary">
                {editingId ? `Update ${activeTab}` : `Add ${activeTab}`}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ company: '', position: '', fromDate: '', toDate: '', description: '', spansMultiple: false, order: 0 });
                  }} 
                  className="btn-ghost"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: List */}
        <div>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#f3f4f6', margin: '0 0 24px 0' }}>Existing {activeTab === 'Freelance' ? 'Freelance Projects' : 'Experiences'} (Drag to Reorder)</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {visibleExperiences.sort((a,b) => a.order - b.order).map(exp => (
              <div key={exp.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#111111', border: '1px solid #1f1f1f', borderRadius: '8px', padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <GripVertical size={16} color="#4b5563" style={{ cursor: 'grab' }} />
                  <div style={{ fontSize: '13px' }}>
                    <span style={{ fontWeight: 600, color: '#f3f4f6' }}>{exp.company}</span>
                    <span style={{ color: '#9ca3af' }}> - {exp.position} ({exp.order})</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => handleEdit(exp)} className="btn-icon">Edit</button>
                  <button className="btn-icon"><Eye size={12} /> Visible</button>
                  <button onClick={() => confirmDelete(exp.id)} className="btn-danger">Delete</button>
                </div>
              </div>
            ))}
            {visibleExperiences.length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280', fontSize: '13px', backgroundColor: '#111111', border: '1px solid #1f1f1f', borderRadius: '8px' }}>
                No {activeTab.toLowerCase()} entries found. Add one on the left.
              </div>
            )}
          </div>
        </div>

      </div>

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Entry"
        message={`Are you sure you want to permanently delete this ${activeTab.toLowerCase()} entry? This action cannot be undone.`}
      />
    </div>
  );
}
