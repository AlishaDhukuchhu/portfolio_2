import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

export default function MediaLibrary() {
  const [media,       setMedia]       = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [copied,      setCopied]      = useState(null);
  const fileInputRef = useRef(null);

  const fetchMedia = () => {
    fetch('http://localhost:3001/api/media')
      .then(res => res.json())
      .then(data => setMedia(Array.isArray(data) ? data : []))
      .catch(() => {});
  };

  useEffect(() => { fetchMedia(); }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    fetch('http://localhost:3001/api/media', { method: 'POST', body: formData })
      .then(res => res.json())
      .then(() => { setIsUploading(false); fetchMedia(); })
      .catch(() => setIsUploading(false));
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#f3f4f6', margin: '0 0 6px' }}>
            Media Library
          </h1>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
            Upload and manage images and video assets.
          </p>
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            accept="image/*,video/*"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            disabled={isUploading}
            className="btn-primary"
            style={{ opacity: isUploading ? 0.6 : 1, cursor: isUploading ? 'wait' : 'pointer' }}
          >
            <UploadCloud size={16} />
            {isUploading ? 'Uploading…' : 'Upload Media'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ backgroundColor: '#111111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px', minHeight: '300px' }}>
        {media.length === 0 ? (
          <div style={{ padding: '64px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#1a1a1a', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563' }}>
              <ImageIcon size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#e5e7eb', margin: '0 0 6px' }}>No media yet</h3>
              <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 20px' }}>
                Upload images or videos to use them across your portfolio.
              </p>
              <button
                onClick={() => fileInputRef.current.click()}
                className="btn-ghost"
              >
                <UploadCloud size={15} /> Choose file
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '16px' }}>
            {media.map((url, i) => (
              <div key={i} style={{ backgroundColor: '#161616', border: '1px solid #1e1e1e', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ height: '140px', backgroundColor: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {url.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                    <img src={url} alt={`media-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Document / File</span>
                  )}
                </div>
                <div style={{ padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '110px' }}>
                    {url.split('/').pop()}
                  </span>
                  <button
                    onClick={() => copyToClipboard(url)}
                    className="btn-icon"
                    title="Copy URL"
                    style={{ color: copied === url ? '#38bdf8' : '#6b7280', flexShrink: 0 }}
                  >
                    <LinkIcon size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
