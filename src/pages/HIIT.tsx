import React, { useEffect, useState, useRef, useMemo } from 'react'

interface HIITProps {}

const HIIT: React.FC<HIITProps> = ({}) => {
  const [countdownDuration, setCountdownDuration] = useState<number>(1)
  const [isRunning, setIsRunning] = useState<boolean>(false)

  const onCountdownFinish = () => {
    console.log('Finished')
  }

  return (
    <div
      onClick={() => setIsRunning((v) => !v)}
      className="flex flex-col w-full h-full justify-center items-center"
    >
      <HIITCountdown
        countdownDuration={countdownDuration}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        isFinishedCallback={onCountdownFinish}
      />
    </div>
  )
}

interface HIITCountdownProps {
  countdownDuration: number
  isRunning: boolean
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>
  isFinishedCallback: () => void
}

const HIITCountdown: React.FC<HIITCountdownProps> = ({
  countdownDuration,
  isRunning,
  setIsRunning,
  isFinishedCallback,
}) => {
  const [timeLeftMs, setTimeLeftMs] = useState(countdownDuration * 1000)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const progress = useMemo(() => {
    if (countdownDuration == 0) return 1
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
    if (isRunning == false && countdownDuration > 0 && timeLeftMs == 0)
      isFinishedCallback()
  }, [isRunning, countdownDuration, timeLeftMs])

  return (
    <div className="relative w-[min(70vw,60vh)] aspect-square">
      {/* SVG Layer (on top) */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <circle
          className="stroke-green-500"
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
      <div className="absolute inset-0 flex items-center justify-center text-6xl font-bold bg-transparent">
        {formatTime(timeLeftSec)}
      </div>
    </div>
  )
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export default HIIT
