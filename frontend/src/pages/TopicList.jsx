import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { CATEGORIES } from '../config/categories'
import BottomNav from '../components/BottomNav'
import EmptyState from '../components/EmptyState'

export default function TopicList() {
  const { category } = useParams()
  const navigate = useNavigate()
  const cat = CATEGORIES[category] || {}
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.topic.list(category)
      .then(d => setTopics(d.itemList))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [category])

  return (
    <div style={wrap}>
      <div style={{ padding: '16px 20px', background: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <button onClick={() => navigate('/')} style={backBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
          Zpět
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
          <img src={cat.icon} alt={cat.label} style={{ width: 44, height: 44, objectFit: 'contain', flexShrink: 0, border: `2px solid ${cat.border}`, borderRadius: 10 }} />
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: cat.sub, margin: 0 }}>{cat.label}</p>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>Témata</h2>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: 16, paddingBottom: 88, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          [1,2,3].map(i => <div key={i} style={{ height: 68, background: '#f3f4f6', borderRadius: 16 }} />)
        ) : topics.length === 0 ? (
          <EmptyState message="V této kategorii zatím nejsou žádná témata." />
        ) : topics.map(t => (
          <button key={t.id} onClick={() => navigate(`/topic/${t.id}`)} style={topicCard}>
            <div style={{ width: 5, background: cat.border || '#e5e7eb', borderRadius: '4px 0 0 4px', flexShrink: 0 }} />
            <div style={{ padding: 16, flex: 1, textAlign: 'left' }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: 0 }}>{t.title}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', paddingRight: 16 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </button>
        ))}
      </div>
      <BottomNav />
    </div>
  )
}


const wrap = { maxWidth: 430, margin: '0 auto', minHeight: '100vh', background: '#f9fafb', display: 'flex', flexDirection: 'column', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }
const backBtn = { display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 600, color: '#374151', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', minHeight: 44 }
const topicCard = { display: 'flex', alignItems: 'stretch', background: 'white', borderRadius: 16, border: '1.5px solid #d1d5db', cursor: 'pointer', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }
