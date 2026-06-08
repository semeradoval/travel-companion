export default function FAB({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Přidat zápisek"
      style={{
        position: 'fixed',
        bottom: 88,
        right: 'max(20px, calc(50vw - 215px + 20px))',
        width: 52, height: 52,
        background: '#111827',
        borderRadius: '50%',
        border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
        cursor: 'pointer',
        zIndex: 40,
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
        <path d="M12 5v14M5 12h14"/>
      </svg>
    </button>
  )
}
