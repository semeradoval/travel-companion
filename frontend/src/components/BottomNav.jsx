import { useNavigate, useLocation } from 'react-router-dom'

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const isActive = (path) => pathname === path

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430, height: 72,
      background: '#111827', display: 'flex', alignItems: 'center',
      justifyContent: 'space-around', padding: '0 4px 8px',
      zIndex: 50,
    }}>
      <button onClick={() => navigate('/')} style={navItemStyle(isActive('/'))}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill={isActive('/') ? 'white' : '#9ca3af'}>
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
        <span style={{ fontSize: 11, color: isActive('/') ? 'white' : '#9ca3af' }}>Přehled</span>
      </button>

<button onClick={() => navigate('/topic/undefined/entry/create')} style={navItemStyle(pathname.includes('/entry/create'))}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={pathname.includes('/entry/create') ? 'white' : '#9ca3af'} strokeWidth="2" strokeLinecap="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        <span style={{ fontSize: 11, color: pathname.includes('/entry/create') ? 'white' : '#9ca3af' }}>Přidat</span>
      </button>
    </nav>
  )
}

function navItemStyle(active) {
  return {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 3, minWidth: 44, minHeight: 44, padding: '6px 20px',
    borderRadius: 14, background: active ? '#374151' : 'transparent',
    border: 'none', cursor: 'pointer',
  }
}
