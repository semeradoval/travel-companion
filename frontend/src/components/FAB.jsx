import { useState } from 'react'

export default function FAB({ onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 88,
        right: 'max(20px, calc(50vw - 215px + 20px))',
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <div style={{
          background: 'rgba(17, 24, 39, 0.88)',
          color: 'white',
          fontSize: 12,
          fontWeight: 600,
          padding: '6px 12px',
          borderRadius: 20,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}>
          Přidat do tohoto tématu
        </div>
      )}
      <button
        onClick={onClick}
        aria-label="Přidat zápisek do tohoto tématu"
        style={{
          width: 52, height: 52,
          background: '#111827',
          borderRadius: '50%',
          border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </button>
    </div>
  )
}
