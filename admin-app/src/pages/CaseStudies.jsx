import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, LayoutTemplate, X } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

export default function CaseStudies() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [isAdding,    setIsAdding]    = useState(false);
  const [formData, setFormData] = useState({ title: '', slug: '', shortDesc: 'Case Study Draft', status: 'Draft' });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studyToDelete,     setStudyToDelete]     = useState(null);

  const fetchCaseStudies = () => {
    fetch('http://localhost:3001/api/case-studies')
      .then(res => res.json())
      .then(data => { setCaseStudies(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchCaseStudies(); }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/api/case-studies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    }).then(() => {
      setIsAdding(false);
      setFormData({ title: '', slug: '', shortDesc: 'Case Study Draft', status: 'Draft' });
      fetchCaseStudies();
    });
  };

  const confirmDelete = (id) => { setStudyToDelete(id); setIsDeleteModalOpen(true); };

  const handleDelete = () => {
    if (!studyToDelete) return;
    fetch(`http://localhost:3001/api/case-studies/${studyToDelete}`, { method: 'DELETE' })
      .then(() => { setIsDeleteModalOpen(false); fetchCaseStudies(); });
  };

  return (
    <div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#f3f4f6', margin: '0 0 6px' }}>
            Case Studies
          </h1>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
            Long-form write-ups for featured projects.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setIsAdding(true)}>
          <Plus size={16} /> Create Case Study
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <div style={{ backgroundColor: '#111111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '28px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#f3f4f6', margin: 0 }}>
              New Case Study
            </h2>
            <button onClick={() => setIsAdding(false)} className="btn-icon"><X size={18} /></button>
          </div>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="cms-label">Project Title</label>
              <input
                required
                type="text"
                placeholder="e.g. Fintech onboarding redesign"
                className="cms-input"
                style={{ backgroundColor: '#161616' }}
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="cms-label">Slug</label>
              <input
                required
                type="text"
                placeholder="e.g. fintech-onboarding"
                className="cms-input"
                style={{ backgroundColor: '#161616' }}
                value={formData.slug}
                onChange={e => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn-primary">Save Draft</button>
              <button type="button" className="btn-ghost" onClick={() => setIsAdding(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div style={{ backgroundColor: '#111111', border: '1px solid #1e1e1e', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
            Loading…
          </div>
        ) : caseStudies.length === 0 ? (
          <div style={{ padding: '64px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#1a1a1a', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563' }}>
              <LayoutTemplate size={24} />
            </div>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>No case studies yet. Create one above.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#161616', borderBottom: '1px solid #1e1e1e' }}>
              <tr>
                <th style={{ padding: '14px 24px', textAlign: 'left', color: '#6b7280', fontWeight: 500, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Project
                </th>
                <th style={{ padding: '14px 24px', textAlign: 'left', color: '#6b7280', fontWeight: 500, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Status
                </th>
                <th style={{ padding: '14px 24px', textAlign: 'right', color: '#6b7280', fontWeight: 500, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {caseStudies.map((cs, i) => (
                <tr key={cs.id} style={{ borderBottom: i < caseStudies.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#1a1a1a', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563', flexShrink: 0 }}>
                        <LayoutTemplate size={18} />
                      </div>
                      <span style={{ fontWeight: 500, color: '#e5e7eb', fontSize: '14px' }}>{cs.title}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 500,
                      backgroundColor: cs.status === 'Published' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                      color:           cs.status === 'Published' ? '#34d399' : '#fbbf24',
                    }}>
                      {cs.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
                      <Link
                        to={`/case-studies/${cs.id}`}
                        style={{ padding: '6px 14px', backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', color: '#e5e7eb', borderRadius: '6px', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}
                      >
                        Open Builder
                      </Link>
                      <button onClick={() => confirmDelete(cs.id)} className="btn-icon btn-icon--danger">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Case Study"
        message="Are you sure you want to permanently delete this case study and all its blocks? This action cannot be undone."
      />
    </div>
  );
}
