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
import Phase3Participant from './screens/Phase3Participant'

type Screen = 
  | 'home'
  | 'phase-selector'
  | 'phase-0'
  | 'phase-1'
  | 'phase-2'
  | 'phase-3'
  | 'phase-4'
  | 'phase-0-participant'
  | 'phase-3-participant'

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
          // 참가자는 특정 Phase만 입력 화면, 나머지는 대기/조회 화면으로 처리
          if (phase === 0 || phase === 3) {
            setCurrentScreen(`phase-${phase}-participant` as Screen)
          } else {
            setCurrentScreen(`phase-${phase}` as Screen)
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
      // 참가자는 스스로 이동 불가 (주관자 통제 따름)
      // 테스트를 위해 허용할 수도 있음
      if (phase === 0 || phase === 3) {
        setCurrentScreen(`phase-${phase}-participant` as Screen)
      } else {
        setCurrentScreen(`phase-${phase}` as Screen)
      }
    }
  }

  const handleBackToHome = () => {
    setCurrentScreen('home')
    setSelectedMeeting(null)
    setUserRole('moderator')
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
      {/* 참가자용 Phase 화면들 (Phase0, Phase3만 별도 화면) */}
      {currentScreen === 'phase-0-participant' && (
        <Phase0Participant
          meeting={selectedMeeting}
          onBack={handleBackToPhaseSelector}
        />
      )}
      {currentScreen === 'phase-3-participant' && (
        <Phase3Participant
          meeting={selectedMeeting}
          onBack={handleBackToPhaseSelector}
        />
      )}
    </div>
  )
}

export default App
