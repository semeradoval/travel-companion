import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { CATEGORIES, CATEGORY_ORDER } from '../config/categories'
import BottomNav from '../components/BottomNav'

const MAX = 20

export default function CreateTopic() {
  const navigate = useNavigate()
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const valid = category && title.trim() && title.length <= MAX

  async function handleSubmit() {
    if (!valid) return
    setSaving(true)
    try {
      const t = await api.topic.create({ title: title.trim(), category })
      navigate(`/topic/${t.id}`)
    } catch (e) {
      setError(e?.message || 'Chyba při ukládání.')
      setSaving(false)
    }
  }

  return (
    <div style={wrap}>
      <div style={{ padding: '16px 20px', background: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => navigate(-1)} style={textBtn}>Zrušit</button>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Nové téma</h2>
          <button onClick={handleSubmit} disabled={!valid || saving} style={submitBtn(!valid || saving)}>Uložit</button>
        </div>
      </div>

      <div style={{ flex: 1, padding: 20, paddingBottom: 88, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={labelStyle}>Kategorie</label>
          <select value={category} onChange={e => setCategory(e.target.value)} style={selectStyle}>
            <option value="">Vyber kategorii…</option>
            {CATEGORY_ORDER.map(k => <option key={k} value={k}>{CATEGORIES[k].label}</option>)}
          </select>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <label style={labelStyle}>Název tématu</label>
            <span style={{ fontSize: 13, color: title.length > MAX ? '#dc2626' : '#6b7280' }}>{title.length} / {MAX}</span>
          </div>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={MAX + 5}
            placeholder="Název tématu…"
            style={inputStyle(title.length > MAX)}
          />
        </div>

        {error && <p style={{ fontSize: 14, color: '#dc2626', margin: 0 }}>{error}</p>}
      </div>
      <BottomNav />
    </div>
  )
}

const wrap = { maxWidth: 430, margin: '0 auto', minHeight: '100vh', background: 'white', display: 'flex', flexDirection: 'column', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }
const textBtn = { fontSize: 14, fontWeight: 600, color: '#374151', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0', minHeight: 44 }
const submitBtn = (disabled) => ({ fontSize: 14, fontWeight: 600, color: disabled ? '#9ca3af' : 'white', background: disabled ? '#e5e7eb' : '#111827', border: 'none', borderRadius: 12, padding: '8px 16px', minHeight: 44, cursor: disabled ? 'not-allowed' : 'pointer' })
const labelStyle = { fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#374151', display: 'block', marginBottom: 8 }
const inputStyle = (err) => ({ width: '100%', padding: '14px 16px', borderRadius: 16, border: `2px solid ${err ? '#dc2626' : '#9ca3af'}`, fontSize: 16, color: '#111827', background: '#f9fafb', outline: 'none', boxSizing: 'border-box' })
const selectStyle = { width: '100%', padding: '14px 16px', borderRadius: 16, border: '2px solid #9ca3af', fontSize: 16, color: '#111827', background: '#f9fafb', outline: 'none', cursor: 'pointer' }
