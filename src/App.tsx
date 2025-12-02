import { useState } from 'react'
import './styles.css'
import Home from './screens/Home'
import PhaseSelector from './screens/PhaseSelector'
import Phase0 from './screens/Phase0'
import Phase1 from './screens/Phase1'
import Phase2 from './screens/Phase2'
import Phase3 from './screens/Phase3'
import Phase4 from './screens/Phase4'
import Phase0Participant from './screens/Phase0Participant'
import Phase1Participant from './screens/Phase1Participant'
import Phase2Participant from './screens/Phase2Participant'
import Phase3Participant from './screens/Phase3Participant'
import Phase4Participant from './screens/Phase4Participant'

type Screen = 
  | 'home'
  | 'phase-selector'
  | 'phase-0'
  | 'phase-1'
  | 'phase-2'
  | 'phase-3'
  | 'phase-4'
  | 'phase-0-participant'
  | 'phase-1-participant'
  | 'phase-2-participant'
  | 'phase-3-participant'
  | 'phase-4-participant'

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

  const handleMeetingSelect = (meeting: Meeting, role: UserRole) => {
    setSelectedMeeting(meeting)
    setUserRole(role)
    setCurrentScreen('phase-selector')
  }

  const handlePhaseSelect = (phase: number) => {
    if (userRole === 'participant') {
      setCurrentScreen(`phase-${phase}-participant` as Screen)
    } else {
      setCurrentScreen(`phase-${phase}` as Screen)
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
        />
      )}
      {currentScreen === 'phase-1' && (
        <Phase1
          meeting={selectedMeeting}
          onBack={handleBackToPhaseSelector}
        />
      )}
      {currentScreen === 'phase-2' && (
        <Phase2
          meeting={selectedMeeting}
          onBack={handleBackToPhaseSelector}
        />
      )}
      {currentScreen === 'phase-3' && (
        <Phase3
          meeting={selectedMeeting}
          onBack={handleBackToPhaseSelector}
        />
      )}
      {currentScreen === 'phase-4' && (
        <Phase4
          meeting={selectedMeeting}
          onBack={handleBackToHome}
        />
      )}
      {/* 참가자용 Phase 화면들 */}
      {currentScreen === 'phase-0-participant' && (
        <Phase0Participant
          meeting={selectedMeeting}
          onBack={handleBackToPhaseSelector}
        />
      )}
      {currentScreen === 'phase-1-participant' && (
        <Phase1Participant
          meeting={selectedMeeting}
          onBack={handleBackToPhaseSelector}
        />
      )}
      {currentScreen === 'phase-2-participant' && (
        <Phase2Participant
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
      {currentScreen === 'phase-4-participant' && (
        <Phase4Participant
          meeting={selectedMeeting}
          onBack={handleBackToHome}
        />
      )}
    </div>
  )
}

export default App
