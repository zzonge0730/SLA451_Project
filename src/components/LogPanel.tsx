import { useState } from 'react'

type LogItem = {
  label: string
  content: string
  type: 'input' | 'output'
}

type LogPanelProps = {
  title?: string
  description?: string
  logs: LogItem[]
}

export default function LogPanel({ title = '입력 vs AI 출력 로그', description, logs }: LogPanelProps) {
  const [filter, setFilter] = useState<'all' | 'input' | 'output'>('all')

  const filteredLogs = logs.filter((log) => filter === 'all' || log.type === filter)

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <h2 className="card-title" style={{ fontSize: '1rem', marginBottom: 0 }}>
          {title}
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn ${filter === 'all' ? 'btn-primary' : ''}`}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.9rem' }}
            onClick={() => setFilter('all')}
          >
            전체
          </button>
          <button
            className={`btn ${filter === 'input' ? 'btn-primary' : ''}`}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.9rem' }}
            onClick={() => setFilter('input')}
          >
            입력
          </button>
          <button
            className={`btn ${filter === 'output' ? 'btn-primary' : ''}`}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.9rem' }}
            onClick={() => setFilter('output')}
          >
            AI 출력
          </button>
        </div>
      </div>
      {description && (
        <p className="text-muted" style={{ marginBottom: '0.75rem' }}>
          {description}
        </p>
      )}
      <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '6px' }}>
        {filteredLogs.map((log, idx) => (
          <div
            key={`${log.label}-${idx}`}
            style={{
              padding: '0.75rem 1rem',
              borderBottom: idx < filteredLogs.length - 1 ? '1px solid #f0f0f0' : 'none',
              background: log.type === 'input' ? '#f9f9f9' : '#f0f7ff'
            }}
          >
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: '0.35rem' }}>
              {log.label}
            </div>
            <div style={{ color: '#555', fontSize: '0.9rem', lineHeight: '1.6' }}>
              {log.content}
            </div>
          </div>
        ))}
        {filteredLogs.length === 0 && (
          <div style={{ padding: '1rem', color: '#777', fontSize: '0.9rem' }}>
            표시할 로그가 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}
