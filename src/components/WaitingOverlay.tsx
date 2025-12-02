import { FaSpinner } from 'react-icons/fa'

type WaitingOverlayProps = {
  message?: string
  showRequestButton?: boolean
  onRequest?: () => void
  onSkip?: () => void
  onBack?: () => void
}

export default function WaitingOverlay({ 
  message = '진행자 신호를 기다리는 중...',
  showRequestButton = false,
  onRequest,
  onSkip,
  onBack
}: WaitingOverlayProps) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(255, 255, 255, 0.95)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(4px)'
    }}>
      {onBack && (
        <button
          className="btn"
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            padding: '0.6rem 1rem',
            minHeight: 'auto',
            fontSize: '0.95rem'
          }}
        >
          ← 홈으로
        </button>
      )}
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        maxWidth: '400px'
      }}>
        <FaSpinner 
          style={{
            fontSize: '3rem',
            color: '#455A64',
            marginBottom: '1rem',
            animation: 'spin 1s linear infinite'
          }}
        />
        <p style={{
          fontSize: '1.1rem',
          fontWeight: '500',
          color: '#263238',
          marginBottom: '0.5rem'
        }}>
          {message}
        </p>
        <p style={{
          fontSize: '0.9rem',
          color: '#546E7A',
          marginBottom: showRequestButton ? '1rem' : '0'
        }}>
          진행자가 다음 단계로 진행하면 자동으로 화면이 전환됩니다.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          {showRequestButton && onRequest && (
            <button
              className="btn"
              onClick={onRequest}
              style={{
                flex: 1,
                fontSize: '0.9rem',
                padding: '0.5rem 1rem'
              }}
            >
              진행자에게 요청
            </button>
          )}
          {onSkip && (
            <button
              className="btn btn-primary"
              onClick={onSkip}
              style={{
                flex: 1,
                fontSize: '0.9rem',
                padding: '0.5rem 1rem',
                background: '#455A64',
                borderColor: '#455A64',
                color: 'white'
              }}
            >
              데모: 신호 스킵
            </button>
          )}
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
