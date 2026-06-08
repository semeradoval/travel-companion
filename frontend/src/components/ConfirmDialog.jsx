export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: 24,
    }}>
      <div style={{
        background: 'white', borderRadius: 16, padding: 24,
        width: '100%', maxWidth: 320, boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <p style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 8 }}>Potvrdit smazání</p>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24 }}>{message}</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '10px 0', borderRadius: 12, border: '1.5px solid #d1d5db',
            background: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#374151',
          }}>Zrušit</button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: '10px 0', borderRadius: 12, border: 'none',
            background: '#dc2626', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'white',
          }}>Smazat</button>
        </div>
      </div>
    </div>
  )
}
