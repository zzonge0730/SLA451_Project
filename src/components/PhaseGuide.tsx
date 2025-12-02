type PhaseGuideProps = {
  title?: string
  purpose: string
  inputs: string[]
  outputs: string[]
  demoTips: string[]
}

export default function PhaseGuide({
  title = '시연 가이드',
  purpose,
  inputs,
  outputs,
  demoTips
}: PhaseGuideProps) {
  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <h2 className="card-title" style={{ fontSize: '1rem' }}>
        {title}
      </h2>
      <div style={{ marginBottom: '0.75rem' }}>
        <strong>목적</strong>
        <p style={{ marginTop: '0.35rem', color: '#555', lineHeight: '1.6', fontSize: '0.95rem' }}>
          {purpose}
        </p>
      </div>
      <div style={{ marginBottom: '0.75rem' }}>
        <strong>입력</strong>
        <ul style={{ marginTop: '0.35rem', paddingLeft: '1.25rem', color: '#555', lineHeight: '1.6', fontSize: '0.95rem' }}>
          {inputs.map((item, idx) => (
            <li key={idx} style={{ marginBottom: '0.35rem' }}>{item}</li>
          ))}
        </ul>
      </div>
      <div style={{ marginBottom: '0.75rem' }}>
        <strong>AI 출력</strong>
        <ul style={{ marginTop: '0.35rem', paddingLeft: '1.25rem', color: '#555', lineHeight: '1.6', fontSize: '0.95rem' }}>
          {outputs.map((item, idx) => (
            <li key={idx} style={{ marginBottom: '0.35rem' }}>{item}</li>
          ))}
        </ul>
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
