import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { CATEGORIES } from '../config/categories'
import BottomNav from '../components/BottomNav'
import FAB from '../components/FAB'
import EmptyState from '../components/EmptyState'
import ConfirmDialog from '../components/ConfirmDialog'

export default function TopicDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [topic, setTopic] = useState(null)
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState(false)

  useEffect(() => {
    Promise.all([api.topic.get(id), api.entry.list(id)])
      .then(([t, e]) => { setTopic(t); setEntries(e.itemList) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    try {
      await api.topic.delete(id)
      navigate(`/category/${topic.category}`)
    } catch (e) { console.error(e) }
  }

  const cat = topic ? (CATEGORIES[topic.category] || {}) : {}

  return (
    <div style={wrap}>
      <div style={{ padding: '16px 20px', background: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <button onClick={() => navigate(`/category/${topic?.category || ''}`)} style={backBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
          Témata
        </button>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginTop: 4 }}>
          <div style={{ flex: 1 }}>
            {topic && <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: cat.bg, color: cat.text, padding: '2px 10px', borderRadius: 999 }}>{cat.label}</span>}
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '8px 0 0', lineHeight: 1.3 }}>{topic?.title}</h2>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginTop: 4 }}>
            <button onClick={() => navigate(`/topic/${id}/edit`)} style={iconBtn('#f3f4f6')} aria-label="Upravit téma">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button onClick={() => setConfirm(true)} style={iconBtn('#fef2f2')} aria-label="Smazat téma">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: 16, paddingBottom: 104, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          [1,2,3].map(i => <div key={i} style={{ height: 80, background: '#f3f4f6', borderRadius: 16 }} />)
        ) : entries.length === 0 ? (
          <EmptyState message="Toto téma zatím nemá žádné zápisky." />
        ) : entries.map(e => (
          <button key={e.id} onClick={() => navigate(`/topic/${id}/entry/${e.id}`)} style={entryCard}>
            <div style={{ width: 5, background: cat.border || '#e5e7eb', borderRadius: '4px 0 0 4px', flexShrink: 0 }} />
            <div style={{ padding: 16, flex: 1, textAlign: 'left' }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: 0 }}>{e.title}</p>
              <p style={{ fontSize: 13, color: '#6b7280', margin: '2px 0 0', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{e.text}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', paddingRight: 16 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </button>
        ))}
      </div>

      <FAB onClick={() => navigate(`/topic/${id}/entry/create`)} />
      <BottomNav />
      {confirm && <ConfirmDialog message={`Smazat téma „${topic?.title}"? Budou smazány i všechny zápisky.`} onConfirm={handleDelete} onCancel={() => setConfirm(false)} />}
    </div>
  )
}

const wrap = { maxWidth: 430, margin: '0 auto', minHeight: '100vh', background: '#f9fafb', display: 'flex', flexDirection: 'column', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }
const backBtn = { display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 600, color: '#374151', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', minHeight: 44 }
const iconBtn = (bg) => ({ width: 44, height: 44, borderRadius: 12, background: bg, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' })
const entryCard = { display: 'flex', alignItems: 'stretch', background: 'white', borderRadius: 16, border: '1.5px solid #d1d5db', cursor: 'pointer', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }
