import { useState, useEffect, useRef } from 'react'
import './styles.css'
import Home from './screens/Home'
import PhaseSelector from './screens/PhaseSelector'
import Phase0 from './screens/Phase0'
import Phase1 from './screens/Phase1'
import Phase2 from './screens/Phase2'
import Phase3 from './screens/Phase3'
import Phase4 from './screens/Phase4'
import Phase0Participant from './screens/Phase0Participant'
import ParticipantLiveScreen from './screens/ParticipantLiveScreen'
import ParticipantTranslationScreen from './screens/ParticipantTranslationScreen'
import ParticipantConsensusScreen from './screens/ParticipantConsensusScreen'
import WaitingOverlay from './components/WaitingOverlay'

type Screen = 
  | 'home'
  | 'phase-selector'
  | 'phase-0'
  | 'phase-1'
  | 'phase-2'
  | 'phase-3'
  | 'phase-4'
  | 'phase-0-participant'
  | 'participant-live'
  | 'participant-translation'
  | 'participant-consensus'

type Meeting = {
  id: string
  name: string
  agenda: string
}

type UserRole = 'moderator' | 'participant'

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home')
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [userRole, setUserRole] = useState<UserRole>('moderator')
  const [isWaiting, setIsWaiting] = useState(false)
  const [hasReceivedPhaseChange, setHasReceivedPhaseChange] = useState(false)
  
  // 📡 브로드캐스트 채널 생성 (탭 간 통신용)
  const channelRef = useRef<BroadcastChannel | null>(null)
  
  useEffect(() => {
    // BroadcastChannel 초기화
    if (typeof BroadcastChannel !== 'undefined') {
      channelRef.current = new BroadcastChannel('demo_sync_channel')
      
      // 메시지 수신 핸들러 (참가자용)
      const handleMessage = (event: MessageEvent) => {
        const { type, phase, meeting } = event.data
        
        if (type === 'PHASE_CHANGE') {
          setHasReceivedPhaseChange(true)
          setIsWaiting(false)
          // 참가자는 페르소나별 필요한 화면만 표시
          if (phase === 0) {
            setCurrentScreen('phase-0-participant')
          } else if (phase >= 1 && phase <= 3) {
            // Phase 1, 2, 3은 모두 Live Participation 화면
            setCurrentScreen('participant-live')
          } else if (phase === 4) {
            // Phase 4는 합의문 피드백 화면
            setCurrentScreen('participant-consensus')
          }
        }
        
        if (type === 'MEETING_SELECT') {
          setSelectedMeeting(meeting)
        }
      }
      
      channelRef.current.onmessage = handleMessage
      
      return () => {
        if (channelRef.current) {
          channelRef.current.onmessage = null
          channelRef.current.close()
        }
      }
    }
  }, [])
  
  // 참가자 모드에서 phase-selector 이후 대기 상태 설정
  useEffect(() => {
    if (userRole === 'participant' && currentScreen === 'phase-selector') {
      setIsWaiting(true)
      setHasReceivedPhaseChange(false)
    } else if (hasReceivedPhaseChange || currentScreen === 'home') {
      // 홈 화면으로 돌아가면 대기 상태 해제
      setIsWaiting(false)
    }
  }, [userRole, currentScreen, hasReceivedPhaseChange])

  const handleMeetingSelect = (meeting: Meeting, role: UserRole) => {
    setSelectedMeeting(meeting)
    setUserRole(role)
    setCurrentScreen('phase-selector')
    
    // 주관자가 회의를 고르면 참가자들에게도 알림
    if (role === 'moderator' && channelRef.current) {
      channelRef.current.postMessage({ type: 'MEETING_SELECT', meeting })
    }
  }

  const handlePhaseSelect = (phase: number) => {
    if (userRole === 'moderator') {
      setCurrentScreen(`phase-${phase}` as Screen)
      // 📡 주관자가 Phase 변경 시 참가자들에게 신호 발송
      if (channelRef.current) {
        channelRef.current.postMessage({ type: 'PHASE_CHANGE', phase })
      }
    } else {
      // 참가자는 주관자 통제 따름 (테스트용으로만 직접 이동 가능)
      if (phase === 0) {
        setCurrentScreen('phase-0-participant')
      } else if (phase >= 1 && phase <= 3) {
        setCurrentScreen('participant-live')
      } else if (phase === 4) {
        setCurrentScreen('participant-consensus')
      }
    }
  }

  const handleBackToHome = () => {
    setCurrentScreen('home')
    setSelectedMeeting(null)
    setUserRole('moderator')
    setIsWaiting(false)
    setHasReceivedPhaseChange(false)
  }

  const handleBackToPhaseSelector = () => {
    setCurrentScreen('phase-selector')
  }

  const handleNextPhase = (currentPhase: number) => {
    if (currentPhase < 4) {
      const nextPhase = currentPhase + 1
      if (userRole === 'moderator') {
        setCurrentScreen(`phase-${nextPhase}` as Screen)
        // 📡 주관자가 다음 Phase로 이동 시 참가자들에게 신호 발송
        if (channelRef.current) {
          channelRef.current.postMessage({ type: 'PHASE_CHANGE', phase: nextPhase })
        }
      } else {
        handlePhaseSelect(nextPhase)
      }
    } else {
      handleBackToHome()
    }
  }

  return (
    <div className="container">
      {currentScreen === 'home' && (
        <Home onMeetingSelect={handleMeetingSelect} />
      )}
      {currentScreen === 'phase-selector' && selectedMeeting && (
        <PhaseSelector
          meeting={selectedMeeting}
          onPhaseSelect={handlePhaseSelect}
          onBack={handleBackToHome}
          userRole={userRole}
        />
      )}
      {currentScreen === 'phase-0' && (
        <Phase0
          meeting={selectedMeeting}
          onBack={handleBackToPhaseSelector}
          onNext={() => handleNextPhase(0)}
        />
      )}
      {currentScreen === 'phase-1' && (
        <Phase1
          meeting={selectedMeeting}
          onBack={handleBackToPhaseSelector}
          onNext={() => handleNextPhase(1)}
        />
      )}
      {currentScreen === 'phase-2' && (
        <Phase2
          meeting={selectedMeeting}
          onBack={handleBackToPhaseSelector}
          onNext={() => handleNextPhase(2)}
        />
      )}
      {currentScreen === 'phase-3' && (
        <Phase3
          meeting={selectedMeeting}
          onBack={handleBackToPhaseSelector}
          onNext={() => handleNextPhase(3)}
        />
      )}
      {currentScreen === 'phase-4' && (
        <Phase4
          meeting={selectedMeeting}
          onBack={handleBackToHome}
          onNext={() => handleNextPhase(4)}
        />
      )}
      {/* 참가자용 화면들 (페르소나별 최소 화면 구성) */}
      {currentScreen === 'phase-0-participant' && (
        <Phase0Participant
          meeting={selectedMeeting}
          onBack={handleBackToPhaseSelector}
          onNext={() => {
            // 참가자는 Phase 1~3이 모두 Live Participation 화면
            setCurrentScreen('participant-live')
          }}
        />
      )}
      {currentScreen === 'participant-live' && (
        <ParticipantLiveScreen
          meeting={selectedMeeting}
          onBack={handleBackToPhaseSelector}
          onNext={() => {
            // 참가자는 발언 완료 후 번역 화면으로
            setCurrentScreen('participant-translation')
          }}
        />
      )}
      {currentScreen === 'participant-translation' && (
        <ParticipantTranslationScreen
          meeting={selectedMeeting}
          onBack={handleBackToPhaseSelector}
          onNext={() => {
            // 번역 확인 후 합의문 화면으로
            setCurrentScreen('participant-consensus')
          }}
        />
      )}
      {currentScreen === 'participant-consensus' && (
        <ParticipantConsensusScreen
          meeting={selectedMeeting}
          onBack={handleBackToPhaseSelector}
        />
      )}
      
      {/* 참가자 대기 화면 */}
      {userRole === 'participant' && isWaiting && !hasReceivedPhaseChange && (
        <WaitingOverlay 
          message="진행자 신호를 기다리는 중..."
          showRequestButton={true}
          onRequest={() => {
            if (channelRef.current) {
              channelRef.current.postMessage({ type: 'PARTICIPANT_PING', message: '신호 요청' })
            }
          }}
          onBack={handleBackToHome}
          onSkip={() => {
            // 데모용: 대기 상태 스킵하고 자동으로 다음 화면으로 이동
            setIsWaiting(false)
            setHasReceivedPhaseChange(true)
            // Phase 0이면 phase-0-participant로, 아니면 participant-live로
            if (currentScreen === 'phase-selector') {
              setCurrentScreen('phase-0-participant')
            }
          }}
        />
      )}
    </div>
  )
}

export default App
