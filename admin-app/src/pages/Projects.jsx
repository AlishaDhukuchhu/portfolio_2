import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  
  const navigate = useNavigate();

  const fetchProjects = () => {
    fetch('http://localhost:3001/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch projects.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const confirmDelete = (id) => {
    setProjectToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if(!projectToDelete) return;
    fetch(`http://localhost:3001/api/projects/${projectToDelete}`, { method: 'DELETE' })
      .then(() => fetchProjects());
  };

  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Website', 'Web App', 'Mobile App', 'Branding'];

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#f3f4f6', margin: 0 }}>Projects</h1>
        <Link to="/projects/new" className="btn-primary">
          <Plus size={18} /> New Project
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`btn-filter${activeCategory === cat ? ' btn-filter--active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="cms-card" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>Loading...</div>
        ) : error ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#ef4444' }}>{error}</div>
        ) : filteredProjects.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: '#9ca3af' }}>No projects found in this category.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#161616', borderBottom: '1px solid #222222' }}>
              <tr>
                <th style={{ padding: '16px 24px', textAlign: 'left', color: '#9ca3af', fontWeight: 500, fontSize: '14px' }}>Project</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', color: '#9ca3af', fontWeight: 500, fontSize: '14px' }}>Category</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', color: '#9ca3af', fontWeight: 500, fontSize: '14px' }}>Status</th>
                <th style={{ padding: '16px 24px', textAlign: 'right', color: '#9ca3af', fontWeight: 500, fontSize: '14px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id} style={{ borderBottom: '1px solid #222222' }}>
                  <td style={{ padding: '16px 24px', fontWeight: 500, color: '#f3f4f6' }}>{project.title}</td>
                  <td style={{ padding: '16px 24px', color: '#9ca3af' }}>{project.category}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ padding: '4px 10px', backgroundColor: '#1f2129', color: '#9ca3af', borderRadius: '100px', fontSize: '12px' }}>{project.status}</span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button onClick={() => navigate(`/projects/edit/${project.id}`)} className="btn-icon"><Edit2 size={16} /></button>
                    <button onClick={() => confirmDelete(project.id)} className="btn-icon btn-icon--danger"><Trash2 size={16} /></button>
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
        title="Delete Project"
        message="Are you sure you want to permanently delete this project? This action cannot be undone."
      />
    </div>
  );
}
