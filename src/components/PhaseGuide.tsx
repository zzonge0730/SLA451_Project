type PhaseGuideProps = {
  title?: string
  purpose: string
  demoTips: string[]
}

export default function PhaseGuide({
  title = '시연 가이드',
  purpose,
  demoTips
}: PhaseGuideProps) {
  return (
    <div className="card phase-guide-card" style={{ 
      marginBottom: '1.5rem',
      borderLeft: '5px solid #4a90e2',
      backgroundColor: '#f8fbff'
    }}>
      <h2 className="card-title" style={{ fontSize: '1.1rem', color: '#1565c0' }}>
        {title}
      </h2>
      <div style={{ marginBottom: '0.75rem' }}>
        <strong>목적</strong>
        <p style={{ marginTop: '0.35rem', color: '#555', lineHeight: '1.6', fontSize: '0.95rem' }}>
          {purpose}
        </p>
      </div>
      <div>
        <strong>데모 포인트</strong>
        <ul style={{ marginTop: '0.35rem', paddingLeft: '1.25rem', color: '#555', lineHeight: '1.6', fontSize: '0.95rem' }}>
          {demoTips.map((tip, idx) => (
            <li key={idx} style={{ marginBottom: '0.35rem' }}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
