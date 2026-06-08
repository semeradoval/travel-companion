import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { CATEGORIES, CATEGORY_ORDER } from '../config/categories'
import BottomNav from '../components/BottomNav'

export default function Home() {
  const navigate = useNavigate()
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const all = await api.topic.list()
        const c = {}
        for (const t of all.itemList) {
          c[t.category] = (c[t.category] || 0) + 1
        }
        setCounts(c)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div style={wrap}>
      <div style={header}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280' }}>Moje zápisky</p>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: '2px 0 0' }}>Kategorie</h1>
      </div>

      <div style={{ flex: 1, padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingBottom: 88 }}>
        {loading
          ? CATEGORY_ORDER.map(k => <div key={k} style={{ background: '#f3f4f6', borderRadius: 16, height: 120, animation: 'pulse 1.5s infinite' }} />)
          : CATEGORY_ORDER.map(k => {
              const cat = CATEGORIES[k]
              const count = counts[k] || 0
              return (
                <button key={k} onClick={() => navigate(`/category/${k}`)} style={{
                  background: cat.bg, border: `2px solid ${cat.border}`,
                  borderRadius: 16, padding: 16, textAlign: 'left', cursor: 'pointer',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    border: `2px solid ${cat.border}`, marginBottom: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: cat.bg, fontSize: 22,
                  }}>
                    {categoryEmoji(k)}
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 600, color: cat.text, margin: 0 }}>{cat.label}</p>
                  <p style={{ fontSize: 14, fontWeight: 500, color: cat.sub, margin: '2px 0 0' }}>
                    {count === 0 ? 'žádná témata' : `${count} ${topicWord(count)}`}
                  </p>
                </button>
              )
            })
        }
      </div>
      <BottomNav />
    </div>
  )
}

function categoryEmoji(key) {
  const map = { Transport: '🚇', Sightseeing: '🏰', Accommodations: '🛏️', Food: '🍽️', Shops: '🛍️', Phrases: '💬' }
  return map[key] || '📁'
}

function topicWord(n) {
  if (n === 1) return 'téma'
  if (n >= 2 && n <= 4) return 'témata'
  return 'témat'
}

const wrap = { maxWidth: 430, margin: '0 auto', minHeight: '100vh', background: '#f9fafb', display: 'flex', flexDirection: 'column', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }
const header = { padding: '20px 20px 16px', background: 'white', borderBottom: '1px solid #e5e7eb' }
