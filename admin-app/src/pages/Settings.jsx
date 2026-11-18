import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { toast } from '../utils/toast';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Theme & Badges');
  const [loading, setLoading] = useState(true);
  
  const [settings, setSettings] = useState({
    primaryColor: '#66d9ff',
    showAvailableBadge: false
  });

  useEffect(() => {
    fetch('http://localhost:3001/api/settings/theme_settings')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSettings(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSettings({ ...settings, [e.target.name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'theme_settings', value: settings })
    })
    .then(() => toast.success('Settings saved successfully!'))
    .catch(() => toast.error('Failed to save settings.'));
  };

  const tabs = ['Theme & Badges', 'General Info', 'Section Headings', 'Social Links'];

  return (
    <div style={{ maxWidth: '900px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#f3f4f6', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SettingsIcon size={20} color="#38bdf8" /> Global Settings
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0, paddingBottom: '24px', borderBottom: '1px solid #1f1f1f' }}>
          Manage site-wide settings and theme configurations.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`btn-tab${activeTab === tab ? ' btn-tab--active' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {activeTab === 'Theme & Badges' && (
        <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '32px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#f3f4f6', margin: '0 0 24px 0' }}>Theme & Badges</h2>
          
          {loading ? (
            <div style={{ color: '#9ca3af', fontSize: '13px' }}>Loading settings...</div>
          ) : (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Primary Theme Color */}
              <div style={{ backgroundColor: '#161616', border: '1px solid #222222', borderRadius: '8px', padding: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#f3f4f6', marginBottom: '16px' }}>Primary Theme Color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <input 
                    type="color" 
                    name="primaryColor"
                    value={settings.primaryColor} 
                    onChange={handleChange}
                    style={{ 
                      width: '48px', 
                      height: '48px', 
                      padding: '0', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer',
                      backgroundColor: 'transparent'
                    }} 
                  />
                  <span style={{ color: '#9ca3af', fontSize: '13px', fontFamily: 'monospace' }}>{settings.primaryColor}</span>
                </div>
              </div>

              {/* Badge Toggle */}
              <div style={{ backgroundColor: '#161616', border: '1px solid #222222', borderRadius: '8px', padding: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: 500, color: '#f3f4f6', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    name="showAvailableBadge"
                    checked={settings.showAvailableBadge} 
                    onChange={handleChange} 
                    style={{ width: '18px', height: '18px', accentColor: '#38bdf8' }} 
                  />
                  Show "Available for Work" badge in navbar
                </label>
              </div>

              <div>
                <button type="submit" className="btn-primary">
                  Save Settings
                </button>
              </div>
              
            </form>
          )}
        </div>
      )}

      {activeTab !== 'Theme & Badges' && (
        <div style={{ padding: '48px 24px', textAlign: 'center', color: '#6b7280', fontSize: '14px', backgroundColor: '#111111', border: '1px solid #1f1f1f', borderRadius: '12px' }}>
          The {activeTab} settings panel is currently under construction.
        </div>
      )}

    </div>
  );
}
