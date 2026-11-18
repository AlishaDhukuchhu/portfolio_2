import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ArrowLeft, Type, Image as ImageIcon, Layout, Trash2, GripVertical, Save, BookOpen } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

/* ── Block renderers ─────────────────────────────────────── */
function HeadingBlock({ block, onUpdate }) {
  return (
    <input
      value={block.content || ''}
      onChange={e => onUpdate(block.id, e.target.value)}
      placeholder="Enter heading…"
      style={{
        width: '100%', boxSizing: 'border-box',
        fontSize: '22px', fontWeight: 600,
        background: 'transparent', border: 'none', outline: 'none',
        color: '#f3f4f6', fontFamily: 'inherit',
      }}
    />
  );
}

function ParagraphBlock({ block, onUpdate }) {
  return (
    <textarea
      value={block.content || ''}
      onChange={e => onUpdate(block.id, e.target.value)}
      placeholder="Enter paragraph text…"
      style={{
        width: '100%', boxSizing: 'border-box',
        minHeight: '100px', fontSize: '15px', lineHeight: '1.7',
        background: 'transparent', border: 'none', outline: 'none',
        resize: 'vertical', fontFamily: 'inherit', color: '#d1d5db',
      }}
    />
  );
}

function ImageBlock({ block, onUpdate }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <input
        value={block.content || ''}
        onChange={e => onUpdate(block.id, e.target.value)}
        placeholder="Paste a Media Library URL here…"
        className="cms-input"
        style={{ backgroundColor: '#0f0f0f' }}
      />
      {block.content && (
        <div style={{ width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #1e1e1e' }}>
          <img src={block.content} alt="block" style={{ width: '100%', display: 'block', maxHeight: '360px', objectFit: 'cover' }} />
        </div>
      )}
    </div>
  );
}

const BLOCK_ICON = { Heading: <Type size={14} />, Paragraph: <Layout size={14} />, Image: <ImageIcon size={14} /> };

/* ── Main Component ──────────────────────────────────────── */
export default function CaseStudyBuilder() {
  const { id } = useParams();                         // route: case-studies/:id
  const [project, setProject] = useState(null);
  const [blocks,  setBlocks]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blockToDelete,   setBlockToDelete]   = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/case-studies')
      .then(r => r.json())
      .then(data => setProject(Array.isArray(data) ? data.find(p => p.id === id) : null));

    fetch(`http://localhost:3001/api/case-studies/${id}/blocks`)
      .then(r => r.json())
      .then(data => { setBlocks(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const addBlock = (type) => {
    fetch(`http://localhost:3001/api/case-studies/${id}/blocks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, content: '' }),
    })
      .then(r => r.json())
      .then(data => setBlocks(prev => [...prev, data]));
  };

  const updateBlockContent = (blockId, content) => {
    setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, content } : b));
    fetch(`http://localhost:3001/api/blocks/${blockId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    }).then(() => { setSaved(true); setTimeout(() => setSaved(false), 2000); });
  };

  const confirmDeleteBlock = (blockId) => {
    setBlockToDelete(blockId);
    setDeleteModalOpen(true);
  };

  const deleteBlock = () => {
    if (!blockToDelete) return;
    fetch(`http://localhost:3001/api/blocks/${blockToDelete}`, { method: 'DELETE' })
      .then(() => {
        setBlocks(prev => prev.filter(b => b.id !== blockToDelete));
        setBlockToDelete(null);
      });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(blocks);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    const reordered = items.map((b, i) => ({ ...b, order: i }));
    setBlocks(reordered);
    fetch('http://localhost:3001/api/blocks/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks: reordered.map(b => ({ id: b.id, order: b.order })) }),
    });
  };

  const handlePublish = () => {
    setSaving(true);
    fetch(`http://localhost:3001/api/case-studies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Published' }),
    })
    .then(() => { setSaving(false); setProject(p => ({ ...p, status: 'Published' })); })
    .catch(() => setSaving(false));
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#6b7280', fontSize: '14px' }}>
      Loading builder…
    </div>
  );

  return (
    <div>

      {/* Back + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
        <Link to="/case-studies" style={{ display: 'flex', alignItems: 'center', color: '#6b7280', textDecoration: 'none', padding: '6px', borderRadius: '6px' }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 600, color: '#f3f4f6', margin: 0 }}>
            {project?.title ?? 'Case Study Builder'}
          </h1>
          {project?.status && (
            <span style={{
              fontSize: '11px', fontWeight: 500,
              color: project.status === 'Published' ? '#34d399' : '#fbbf24',
            }}>
              {project.status}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'start' }}>

        {/* ── Editor canvas ── */}
        <div style={{ backgroundColor: '#111111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '32px', minHeight: '560px' }}>
          {blocks.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 24px', color: '#4b5563' }}>
              <BookOpen size={40} style={{ marginBottom: '16px', opacity: 0.4 }} />
              <p style={{ fontSize: '14px', margin: 0 }}>No blocks yet — add one from the right panel.</p>
            </div>
          )}

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="blocks">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {blocks.map((block, index) => (
                    <Draggable key={block.id} draggableId={block.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            ...provided.draggableProps.style,
                            backgroundColor: snapshot.isDragging ? '#1a1a1a' : '#161616',
                            border: `1px solid ${snapshot.isDragging ? '#333' : '#1e1e1e'}`,
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: snapshot.isDragging ? '0 12px 32px rgba(0,0,0,0.5)' : 'none',
                            transition: 'background-color 0.15s ease',
                          }}
                        >
                          {/* Block header bar */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#1a1a1a', borderBottom: '1px solid #222' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div {...provided.dragHandleProps} style={{ cursor: 'grab', color: '#4b5563', display: 'flex', alignItems: 'center' }}>
                                <GripVertical size={15} />
                              </div>
                              <span style={{ color: '#6b7280', marginRight: '4px' }}>
                                {BLOCK_ICON[block.type]}
                              </span>
                              <span style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                {block.type}
                              </span>
                            </div>
                            <button onClick={() => confirmDeleteBlock(block.id)} className="btn-icon btn-icon--danger" style={{ padding: '4px' }}>
                              <Trash2 size={13} />
                            </button>
                          </div>

                          {/* Block content */}
                          <div style={{ padding: '16px 20px' }}>
                            {block.type === 'Heading'   && <HeadingBlock   block={block} onUpdate={updateBlockContent} />}
                            {block.type === 'Paragraph' && <ParagraphBlock block={block} onUpdate={updateBlockContent} />}
                            {block.type === 'Image'     && <ImageBlock     block={block} onUpdate={updateBlockContent} />}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* ── Sidebar ── */}
        <div style={{ position: 'sticky', top: '32px', backgroundColor: '#111111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#f3f4f6', margin: '0 0 16px' }}>Add Blocks</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { type: 'Heading',   icon: <Type size={15} />,       label: 'Heading' },
              { type: 'Paragraph', icon: <Layout size={15} />,     label: 'Paragraph' },
              { type: 'Image',     icon: <ImageIcon size={15} />,  label: 'Full Width Image' },
            ].map(({ type, icon, label }) => (
              <button
                key={type}
                onClick={() => addBlock(type)}
                className="btn-ghost"
                style={{ width: '100%', justifyContent: 'flex-start', gap: '10px' }}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #1e1e1e' }}>
            <button
              onClick={handlePublish}
              disabled={saving || project?.status === 'Published'}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', opacity: saving ? 0.7 : 1 }}
            >
              <Save size={15} />
              {project?.status === 'Published' ? 'Published ✓' : saving ? 'Publishing…' : 'Publish Case Study'}
            </button>
            <p style={{ fontSize: '11px', color: saved ? '#34d399' : '#4b5563', textAlign: 'center', margin: '10px 0 0', transition: 'color 0.3s' }}>
              {saved ? 'Changes saved ✓' : 'All changes are auto-saved.'}
            </p>
          </div>
        </div>

      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setBlockToDelete(null); }}
        onConfirm={deleteBlock}
        title="Delete Block"
        message="Are you sure you want to delete this block? This action cannot be undone."
      />
    </div>
  );
}
