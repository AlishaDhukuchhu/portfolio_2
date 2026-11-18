import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, PenLine, Upload, Home } from 'lucide-react';

/* ── Helpers ───────────────────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(mins  / 60);
  const days  = Math.floor(hours / 24);
  const weeks = Math.floor(days  / 7);
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  if (days  <  7)  return `${days}d ago`;
  if (weeks <  4)  return `${weeks}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

/* ── Sub-components ────────────────────────────────────────── */
function StatCard({ title, value, sub, barColor, barPct }) {
  return (
    <div style={{
      backgroundColor: '#111111',
      border: '1px solid #1e1e1e',
      borderRadius: '12px',
      padding: '24px 24px 20px',
    }}>
      <p style={{ color: '#6b7280', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px' }}>
        {title}
      </p>
      <p style={{ color: '#f3f4f6', fontSize: '38px', fontWeight: 600, margin: '0 0 18px', lineHeight: 1 }}>
        {value}
      </p>
      <div style={{ height: '3px', backgroundColor: '#1e1e1e', borderRadius: '2px', marginBottom: '10px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.min(barPct, 100)}%`, backgroundColor: barColor, borderRadius: '2px', transition: 'width 0.6s ease' }} />
      </div>
      <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>{sub}</p>
    </div>
  );
}

function QuickAction({ icon, title, sub, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        padding: '16px 18px',
        backgroundColor: hov ? '#161616' : '#111111',
        border: '1px solid #1e1e1e',
        borderRadius: '10px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background-color 0.15s ease, border-color 0.15s ease',
        borderColor: hov ? '#2a2a2a' : '#1e1e1e',
        fontFamily: 'inherit',
        width: '100%',
      }}
    >
      <div style={{
        width: '34px', height: '34px', borderRadius: '8px',
        backgroundColor: '#1a1a1a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#9ca3af', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ color: '#e5e7eb', fontSize: '14px', fontWeight: 500, margin: '0 0 3px' }}>{title}</p>
        <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>{sub}</p>
      </div>
    </button>
  );
}

function StatusBadge({ status }) {
  const map = {
    published:   { bg: 'rgba(16,185,129,0.15)',  color: '#34d399', label: 'Published'   },
    draft:       { bg: 'rgba(245,158,11,0.15)',   color: '#fbbf24', label: 'Draft'       },
    'case study':{ bg: 'rgba(139,92,246,0.15)',   color: '#a78bfa', label: 'Case study'  },
  };
  const s = map[(status || '').toLowerCase()] ?? map.draft;
  return (
    <span style={{
      padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 500,
      backgroundColor: s.bg, color: s.color, whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  );
}

const DRAFT_COLORS = ['#fbbf24', '#38bdf8', '#a78bfa', '#fb923c'];
const DRAFT_HINTS  = [
  'Needs SEO description',
  'Missing cover image',
  'No results section',
  'Only a title so far',
];

/* ── Main Component ────────────────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate();
  const [projects,    setProjects]    = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3001/api/projects').then(r => r.json()).catch(() => []),
      fetch('http://localhost:3001/api/case-studies').then(r => r.json()).catch(() => []),
    ]).then(([proj, cs]) => {
      setProjects(Array.isArray(proj) ? proj : []);
      setCaseStudies(Array.isArray(cs) ? cs : []);
      setLoading(false);
    });
  }, []);

  const published   = projects.filter(p => p.status?.toLowerCase() === 'published').length;
  const drafts      = projects.filter(p => p.status?.toLowerCase() === 'draft').length;
  const total       = projects.length;
  const pubPct      = total ? Math.round((published / total) * 100) : 0;
  const csPct       = total ? Math.round((caseStudies.length / total) * 100) : 0;

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updatedAt ?? b.createdAt) - new Date(a.updatedAt ?? a.createdAt))
    .slice(0, 5);

  const draftProjects = projects
    .filter(p => p.status?.toLowerCase() === 'draft')
    .slice(0, 4);

  const subtitle = drafts > 0
    ? `${drafts} draft${drafts !== 1 ? 's' : ''} waiting to publish.`
    : 'Everything is up to date.';

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '36px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 400, color: '#f3f4f6', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
            {getGreeting()}
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>{subtitle}</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => navigate('/projects/new')}
          style={{ display: 'flex', alignItems: 'center', gap: '7px', whiteSpace: 'nowrap' }}
        >
          <Plus size={15} /> + New project
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
        <StatCard
          title="Total projects"
          value={total}
          sub={`${published} published · ${drafts} drafts`}
          barColor="#38bdf8"
          barPct={100}
        />
        <StatCard
          title="Published"
          value={published}
          sub={`${pubPct}% of all projects`}
          barColor="#34d399"
          barPct={pubPct}
        />
        <StatCard
          title="Case studies"
          value={caseStudies.length}
          sub={`${csPct}% of all projects`}
          barColor="#38bdf8"
          barPct={csPct}
        />
        <StatCard
          title="Contact messages"
          value={3}
          sub="2 unread"
          barColor="#fbbf24"
          barPct={67}
        />
      </div>

      {/* ── Quick Actions ── */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontSize: '11px', fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
          Quick actions
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <QuickAction icon={<Plus size={17} />}      title="Add project"    sub="Create a new portfolio entry" onClick={() => navigate('/projects/new')} />
          <QuickAction icon={<PenLine size={17} />}   title="Add case study" sub="Long-form project write-up"   onClick={() => navigate('/case-studies')} />
          <QuickAction icon={<Upload size={17} />}    title="Upload media"   sub="Images and video assets"      onClick={() => navigate('/media')} />
          <QuickAction icon={<Home size={17} />}      title="Edit homepage"  sub="Hero, about and sections"     onClick={() => navigate('/hero')} />
        </div>
      </div>

      {/* ── Bottom two-column ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>

        {/* Recent Projects */}
        <div style={{ backgroundColor: '#111111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <span style={{ fontWeight: 500, color: '#f3f4f6', fontSize: '15px' }}>Recent projects</span>
            <button
              onClick={() => navigate('/projects')}
              style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '13px', cursor: 'pointer', padding: 0 }}
            >
              View all
            </button>
          </div>

          {loading ? (
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Loading…</p>
          ) : recentProjects.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>No projects yet.</p>
          ) : (
            <div>
              {recentProjects.map((p, i) => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '13px 0',
                    borderBottom: i < recentProjects.length - 1 ? '1px solid #1a1a1a' : 'none',
                  }}
                >
                  <span style={{ color: '#d1d5db', fontSize: '14px' }}>{p.title}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0, marginLeft: '12px' }}>
                    <StatusBadge status={p.status} />
                    <span style={{ color: '#6b7280', fontSize: '12px', minWidth: '46px', textAlign: 'right' }}>
                      {timeAgo(p.updatedAt ?? p.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drafts to Finish */}
        <div style={{ backgroundColor: '#111111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: 500, color: '#f3f4f6', fontSize: '15px' }}>Drafts to finish</span>
              {drafts > 0 && (
                <span style={{
                  backgroundColor: '#1a1a1a', color: '#9ca3af',
                  borderRadius: '6px', padding: '2px 8px', fontSize: '12px', fontWeight: 600,
                }}>
                  {drafts}
                </span>
              )}
            </div>
            <button
              onClick={() => navigate('/projects')}
              style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '13px', cursor: 'pointer', padding: 0 }}
            >
              All drafts
            </button>
          </div>

          {loading ? (
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Loading…</p>
          ) : draftProjects.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>No drafts — all caught up! 🎉</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {draftProjects.map((p, i) => {
                const color = DRAFT_COLORS[i % DRAFT_COLORS.length];
                const pct   = 25 + i * 18;
                const hint  = DRAFT_HINTS[i % DRAFT_HINTS.length];
                const isFirst = i === 0;
                return (
                  <div key={p.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ color: '#d1d5db', fontSize: '14px' }}>{p.title}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, marginLeft: '12px' }}>
                        <span style={{ color: '#6b7280', fontSize: '12px' }}>{timeAgo(p.updatedAt ?? p.createdAt)}</span>
                        <button
                          onClick={() => navigate(`/projects/edit/${p.id}`)}
                          style={{
                            padding: '4px 14px',
                            backgroundColor: isFirst ? '#38bdf8' : '#1a1a1a',
                            border: isFirst ? 'none' : '1px solid #2a2a2a',
                            color: isFirst ? '#000' : '#e5e7eb',
                            borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
                            fontFamily: 'inherit', fontWeight: isFirst ? 600 : 400,
                            transition: 'background-color 0.15s ease',
                          }}
                        >
                          {isFirst ? 'Publish' : 'Continue'}
                        </button>
                      </div>
                    </div>
                    <div style={{ height: '3px', backgroundColor: '#1a1a1a', borderRadius: '2px', marginBottom: '5px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, backgroundColor: color, borderRadius: '2px' }} />
                    </div>
                    <span style={{ color: '#6b7280', fontSize: '12px' }}>{hint}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
