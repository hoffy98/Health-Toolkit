import React, { useEffect, useState, useRef, useMemo } from 'react'

import { FaPauseCircle, FaPlayCircle } from 'react-icons/fa'
import Modal from '@/components/Modal'
import NumberInput from '@/components/NumberInput'

type HIITSetting = {
  warmup: number
  cooldown: number
  work: number
  rest: number
  rounds: number
}

const initialHIITSetting: HIITSetting = {
  warmup: 60,
  cooldown: 60,
  work: 30,
  rest: 90,
  rounds: 8,
}

type RoundState = 'finished' | 'warmup' | 'work' | 'rest' | 'cooldown'

interface HIITProps {}

const HIIT: React.FC<HIITProps> = ({}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)
  const [setting, setSetting] = useState<HIITSetting>(initialHIITSetting)

  const [currentRound, setCurrentRound] = useState<number>(0)
  const [currentRoundState, setCurrentRoundState] =
    useState<RoundState>('finished')

  const [countdownDuration, setCountdownDuration] = useState<number>(0)
  const [isRunning, setIsRunning] = useState<boolean>(false)

  useEffect(() => {
    setCurrentRound(0)
    setCurrentRoundState('finished')
    setCountdownDuration(0)
    setIsRunning(false)
  }, [setting])

  const gotoNextInterval = () => {
    switch (currentRoundState) {
      case 'finished':
        setCountdownDuration(setting.warmup)
        setCurrentRoundState('warmup')
        setIsRunning(true)
        setCurrentRound(0)
        break
      case 'warmup':
        setCountdownDuration(setting.work)
        setCurrentRoundState('work')
        setIsRunning(true)
        setCurrentRound(1)
        break
      case 'work':
        setCountdownDuration(setting.rest)
        setCurrentRoundState('rest')
        setIsRunning(true)
        break
      case 'rest':
        if (currentRound >= setting.rounds) {
          setCountdownDuration(setting.cooldown)
          setCurrentRoundState('cooldown')
          setIsRunning(true)
        } else {
          setCountdownDuration(setting.work)
          setCurrentRoundState('work')
          setCurrentRound(currentRound + 1)
          setIsRunning(true)
        }
        break
      case 'cooldown':
        setCurrentRoundState('finished')
        setCountdownDuration(0)
        break
    }
  }

  const onCountdownFinish = () => {
    if (currentRoundState == 'finished') return
    gotoNextInterval()
  }

  const toggleIsRunning = () => {
    if (currentRoundState == 'finished') {
      setCountdownDuration(setting.warmup)
      setCurrentRoundState('warmup')
      setCurrentRound(0)
    }
    setIsRunning((v) => !v)
  }

  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <div className="flex flex-col w-full h-full justify-center items-center space-y-5">
        <HIITCountdown
          topString={
            currentRoundState == 'finished'
              ? ''
              : currentRoundState.toUpperCase()
          }
          bottomString={
            currentRoundState == 'work' || currentRoundState == 'rest'
              ? `${currentRound}/${setting.rounds}`
              : ''
          }
          countdownDuration={countdownDuration}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          isFinishedCallback={onCountdownFinish}
        />
        <div className="flex">
          <button className="text-6xl" onClick={toggleIsRunning}>
            {isRunning ? <FaPauseCircle /> : <FaPlayCircle />}
          </button>
        </div>
        <HIITBackgroundColoring currentRoundState={currentRoundState} />
      </div>
      <button className="my-5" onClick={() => setIsSettingsOpen(true)}>
        Settings
      </button>
      {/* Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
        <HIITSettings setting={setting} setSetting={setSetting} />
      </Modal>
    </div>
  )
}

interface HIITSettingsProps {
  setting: HIITSetting
  setSetting: React.Dispatch<React.SetStateAction<HIITSetting>>
}

const HIITSettings: React.FC<HIITSettingsProps> = ({ setting, setSetting }) => {
  const setSettingWarmup = (val: number) => {
    setSetting((prev) => ({
      ...prev,
      warmup: val,
    }))
  }
  const setSettingCooldown = (val: number) => {
    setSetting((prev) => ({
      ...prev,
      cooldown: val,
    }))
  }
  const setSettingWork = (val: number) => {
    setSetting((prev) => ({
      ...prev,
      work: val,
    }))
  }
  const setSettingRest = (val: number) => {
    setSetting((prev) => ({
      ...prev,
      rest: val,
    }))
  }
  const setSettingRounds = (val: number) => {
    setSetting((prev) => ({
      ...prev,
      rounds: val,
    }))
  }

  return (
    <div className="flex flex-col space-y-2">
      <HIITSettingsItem
        name="Warmup"
        unit="s"
        value={setting.warmup}
        setValue={setSettingWarmup}
      />
      <HIITSettingsItem
        name="Work"
        unit="s"
        value={setting.work}
        setValue={setSettingWork}
      />
      <HIITSettingsItem
        name="Rest"
        unit="s"
        value={setting.rest}
        setValue={setSettingRest}
      />
      <HIITSettingsItem
        name="Cooldown"
        unit="s"
        value={setting.cooldown}
        setValue={setSettingCooldown}
      />
      <HIITSettingsItem
        name="Rounds"
        unit=""
        value={setting.rounds}
        setValue={setSettingRounds}
      />
    </div>
  )
}

interface HIITSettingsItemProps {
  name: string
  unit: string
  value: number
  setValue: (newValue: number) => void
}

const HIITSettingsItem: React.FC<HIITSettingsItemProps> = ({
  name,
  unit,
  value,
  setValue,
}) => {
  return (
    <div className="flex justify-center items-center space-x-2">
      <p className="w-22 text-right">{name}:</p>
      <div className="w-12 border p-1 rounded-lg">
        <NumberInput min={0} max={Infinity} value={value} setValue={setValue} />
      </div>
      <p className="w-5 text-left">{unit}</p>
    </div>
  )
}

interface HIITCountdownProps {
  topString?: string
  bottomString?: string
  countdownDuration: number
  isRunning: boolean
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>
  isFinishedCallback: () => void
}

const HIITCountdown: React.FC<HIITCountdownProps> = ({
  topString,
  bottomString,
  countdownDuration,
  isRunning,
  setIsRunning,
  isFinishedCallback,
}) => {
  const [timeLeftMs, setTimeLeftMs] = useState(countdownDuration * 1000)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const progress = useMemo(() => {
    if (countdownDuration == 0) return 0
    const totalMs = countdownDuration * 1000
    return Math.max(0, Math.min(1, 1 - timeLeftMs / totalMs))
  }, [timeLeftMs, countdownDuration])

  const timeLeftSec = useMemo(() => {
    return Math.ceil(Math.max(0, timeLeftMs / 1000))
  }, [timeLeftMs])

  const strokeWidth = 5
  const radius = 50 - strokeWidth / 2
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    setTimeLeftMs(countdownDuration * 1000) // reset if countdownDuration changes
  }, [countdownDuration])

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)

    if (isRunning) {
      let initialTimeLeft = timeLeftMs

      // If starting while at 0, reset to full duration
      if (timeLeftMs <= 0) {
        initialTimeLeft = countdownDuration * 1000
        setTimeLeftMs(initialTimeLeft)
      }

      const startTime = Date.now()
      const endTime = startTime + initialTimeLeft

      intervalRef.current = setInterval(() => {
        const now = Date.now()
        const newTimeLeft = endTime - now

        if (newTimeLeft <= 0) {
          setTimeLeftMs(0)
          setIsRunning(false)
          clearInterval(intervalRef.current!)
        } else {
          setTimeLeftMs(newTimeLeft)
        }
      }, 10)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  useEffect(() => {
    if (isRunning == false && timeLeftMs == 0) isFinishedCallback()
  }, [isRunning, timeLeftMs])

  return (
    <div className="relative w-[min(80vw,60vh)] aspect-square">
      {/* SVG Layer (on top) */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <circle
          className="stroke-primary_light"
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeOpacity={0.2}
          style={{
            transformOrigin: '50% 50%',
          }}
        />
        <circle
          className="stroke-primary_dark"
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={(1 - progress) * circumference}
          style={{
            transformOrigin: '50% 50%',
            transform: 'rotate(-90deg)',
          }}
        />
      </svg>

      {/* Text in the center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent">
        <h1 className="h-8">{topString}</h1>
        <h1 className="text-6xl my-5 font-bold">{formatTime(timeLeftSec)}</h1>
        <h1 className="h-8">{bottomString}</h1>
      </div>
    </div>
  )
}

interface HIITBackgroundColoringProps {
  currentRoundState: RoundState
}

const HIITBackgroundColoring: React.FC<HIITBackgroundColoringProps> = ({
  currentRoundState,
}) => {
  const roundStateToColor: Record<RoundState, string> = {
    finished: 'bg-primary_dark',
    warmup: 'bg-blue-500',
    work: 'bg-green-500',
    rest: 'bg-orange-500',
    cooldown: 'bg-blue-500',
  }

  useEffect(() => {
    const rootDiv = document.getElementById('root')
    if (!rootDiv) return

    // Remove any previously applied background class
    Object.values(roundStateToColor).forEach((colorClass) => {
      rootDiv.classList.remove(colorClass)
    })

    // Add the new background class based on currentRoundState
    const newColor = roundStateToColor[currentRoundState]
    rootDiv.classList.add(newColor)

    return () => {
      // Remove any previously applied background class
      Object.values(roundStateToColor).forEach((colorClass) => {
        rootDiv.classList.remove(colorClass)
      })
    }
  }, [currentRoundState])

  return (
    <div className="hidden w-0 h-0">
      <div className="bg-blue-500"></div>
      <div className="bg-green-500"></div>
      <div className="bg-orange-500"></div>
    </div>
  )
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export default HIIT
