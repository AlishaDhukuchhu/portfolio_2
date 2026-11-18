import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

export default function NavbarLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);

  const [formData, setFormData] = useState({
    label: '', url: '', type: 'Internal', order: 0
  });

  const fetchLinks = () => {
    fetch('http://localhost:3001/api/navigation')
      .then(res => res.json())
      .then(data => { setLinks(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchLinks(); }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    if (e.target.name === 'isExternal') {
      setFormData({ ...formData, type: e.target.checked ? 'External' : 'Internal' });
    } else {
      setFormData({ ...formData, [e.target.name]: value });
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/api/navigation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, order: parseInt(formData.order) })
    })
    .then(() => {
      setFormData({ label: '', url: '', type: 'Internal', order: 0 });
      fetchLinks();
    });
  };

  const confirmDelete = (id) => {
    setLinkToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if(!linkToDelete) return;
    fetch(`http://localhost:3001/api/navigation/${linkToDelete}`, { method: 'DELETE' })
      .then(() => {
        setIsDeleteModalOpen(false);
        fetchLinks();
      });
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#f3f4f6', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#38bdf8' }}>🧭</span> Navbar Links
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0, paddingBottom: '24px', borderBottom: '1px solid #1f1f1f' }}>
          Manage navigation links displayed in the header.
        </p>
      </div>

      <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '32px' }}>
        
        {/* Form Area */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#f3f4f6', margin: '0 0 24px 0' }}>Add Navbar Link</h2>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div>
              <label className="cms-label" style={{ fontSize: '13px' }}>Label</label>
              <input required type="text" name="label" className="cms-input" style={{ backgroundColor: '#161616' }} value={formData.label} onChange={handleChange} />
            </div>

            <div>
              <label className="cms-label" style={{ fontSize: '13px' }}>Path (e.g. /about or https://...)</label>
              <input required type="text" name="url" className="cms-input" style={{ backgroundColor: '#161616' }} value={formData.url} onChange={handleChange} />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#f3f4f6', cursor: 'pointer' }}>
                <input type="checkbox" name="isExternal" checked={formData.type === 'External'} onChange={handleChange} style={{ accentColor: '#38bdf8' }} />
                Is External Link?
              </label>
            </div>

            <div>
              <label className="cms-label" style={{ fontSize: '13px' }}>Display Order</label>
              <input type="number" name="order" className="cms-input" style={{ backgroundColor: '#161616' }} value={formData.order} onChange={handleChange} />
            </div>

            <div>
              <button type="submit" className="btn-primary">
                Add Link
              </button>
            </div>
            
          </form>
        </div>

        {/* List Area */}
        <div>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#f3f4f6', margin: '0 0 24px 0' }}>Existing Links (Drag to Reorder)</h2>
          
          {loading ? (
            <div style={{ color: '#9ca3af', fontSize: '13px' }}>Loading...</div>
          ) : links.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280', fontSize: '13px', backgroundColor: '#161616', border: '1px solid #222', borderRadius: '8px' }}>
              No links found. Add one above.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {links.sort((a,b) => a.order - b.order).map(link => (
                <div key={link.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#161616', border: '1px solid #222222', borderRadius: '8px', padding: '16px 20px' }}>
                  <div style={{ fontSize: '14px' }}>
                    <span style={{ fontWeight: 600, color: '#f3f4f6' }}>{link.label}</span>
                    <span style={{ color: '#9ca3af' }}> - {link.url} ({link.order})</span>
                  </div>
                  
                  <button onClick={() => confirmDelete(link.id)} className="btn-danger">Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Link"
        message="Are you sure you want to permanently delete this navigation link? This action cannot be undone."
      />
    </div>
  );
}
