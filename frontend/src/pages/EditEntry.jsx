import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { CATEGORIES, CATEGORY_ORDER } from '../config/categories'
import BottomNav from '../components/BottomNav'

const MAX_TITLE = 30
const MAX_TEXT = 1800

export default function EditEntry() {
  const { entryId } = useParams()
  const navigate = useNavigate()
  const [category, setCategory] = useState('')
  const [topics, setTopics] = useState([])
  const [topicId, setTopicId] = useState('')
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.entry.get(entryId)
      .then(async e => {
        setTitle(e.title); setText(e.text); setTopicId(e.topicId)
        const t = await api.topic.get(e.topicId)
        setCategory(t.category)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [entryId])

  useEffect(() => {
    if (!category) return
    api.topic.list(category).then(d => setTopics(d.itemList)).catch(console.error)
  }, [category])

  const valid = category && topicId && title.trim() && title.length <= MAX_TITLE && text.length <= MAX_TEXT

  async function handleSubmit() {
    if (!valid) return
    setSaving(true)
    try {
      await api.entry.update({ id: entryId, title: title.trim(), text, topicId })
      navigate(-1)
    } catch (e) {
      setError(e?.message || 'Chyba při ukládání.')
      setSaving(false)
    }
  }

  if (loading) return <div style={{ ...wrap, alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#6b7280' }}>Načítám…</p></div>

  return (
    <div style={wrap}>
      <div style={{ padding: '16px 20px', background: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => navigate(-1)} style={textBtn}>Zrušit</button>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Upravit zápisek</h2>
          <button onClick={handleSubmit} disabled={!valid || saving} style={submitBtn(!valid || saving)}>Uložit</button>
        </div>
      </div>

      <div style={{ flex: 1, padding: 20, paddingBottom: 88, display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto' }}>
        <div>
          <label style={labelStyle}>Kategorie</label>
          <select value={category} onChange={e => { setCategory(e.target.value); setTopicId('') }} style={selectStyle}>
            {CATEGORY_ORDER.map(k => <option key={k} value={k}>{CATEGORIES[k].label}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Téma</label>
          <select value={topicId} onChange={e => setTopicId(e.target.value)} style={selectStyle}>
            {topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <label style={labelStyle}>Název</label>
            <span style={{ fontSize: 13, color: title.length > MAX_TITLE ? '#dc2626' : '#6b7280' }}>{title.length} / {MAX_TITLE}</span>
          </div>
          <input value={title} onChange={e => setTitle(e.target.value)} style={inputStyle(title.length > MAX_TITLE)} />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <label style={labelStyle}>Text</label>
            <span style={{ fontSize: 13, color: text.length > MAX_TEXT ? '#dc2626' : '#6b7280' }}>{text.length} / {MAX_TEXT}</span>
          </div>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={7} style={{ ...inputStyle(text.length > MAX_TEXT), resize: 'none', lineHeight: 1.6 }} />
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
const labelStyle = { fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#374151', display: 'block', marginBottom: 0 }
const inputStyle = (err) => ({ width: '100%', padding: '14px 16px', borderRadius: 16, border: `2px solid ${err ? '#dc2626' : '#111827'}`, fontSize: 16, color: '#111827', background: '#f9fafb', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' })
const selectStyle = { width: '100%', padding: '14px 16px', borderRadius: 16, border: '2px solid #9ca3af', fontSize: 16, color: '#111827', background: '#f9fafb', outline: 'none', cursor: 'pointer' }
