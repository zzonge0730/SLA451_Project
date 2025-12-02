type StepIndicatorProps = {
  steps: string[]
  current: number // 1-based
}

export default function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <div style={{
      display: 'flex',
      gap: '0.75rem',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      background: '#ECEFF1',
      border: '1px solid #CFD8DC',
      borderRadius: '10px',
      marginBottom: '1rem'
    }}>
      {steps.map((label, idx) => {
        const stepNumber = idx + 1
        const isDone = stepNumber < current
        const isCurrent = stepNumber === current
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: isDone ? '#546E7A' : isCurrent ? '#455A64' : '#FFF',
              color: isDone || isCurrent ? '#FFF' : '#546E7A',
              border: `2px solid ${isDone || isCurrent ? '#455A64' : '#CFD8DC'}`,
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {stepNumber}
            </div>
            <div style={{ color: isCurrent ? '#263238' : '#546E7A', fontWeight: isCurrent ? 700 : 500, fontSize: '0.95rem' }}>
              {label}
            </div>
            {stepNumber !== steps.length && (
              <div style={{ width: '18px', height: '1px', background: '#CFD8DC', marginLeft: '0.35rem', marginRight: '0.35rem' }} />
            )}
          </div>
        )
      })}
      <div style={{ marginLeft: 'auto', fontSize: '0.9rem', color: '#546E7A', fontWeight: 600 }}>
        {current}/{steps.length}
      </div>
    </div>
  )
}
