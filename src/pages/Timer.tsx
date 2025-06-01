import React, { useEffect, useState } from 'react'

interface TimerProps {}

const Timer: React.FC<TimerProps> = ({}) => {
  const [countdown, setCountdown] = useState<number>(0)
  const [isCounting, setIsCounting] = useState<boolean>(false)

  const triggerTimer = (time_s: number) => {
    setCountdown(time_s)
    setIsCounting(true)
  }

  const clearTimer = () => {
    setCountdown(0)
    setIsCounting(false)
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isCounting && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    } else if (countdown === 0 && isCounting) {
      setIsCounting(false) // Stop counting
    }
    return () => clearTimeout(timer)
  }, [countdown, isCounting])

  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <div className="flex flex-col w-full h-full justify-center items-center space-y-10">
        <h1 className="text-8xl font-bold">{formatTime(countdown)}</h1>
        <div className="flex flex-col items-center space-y-5">
          <div className="flex space-x-5">
            <PresetTimer time={30} trigger={triggerTimer} />
            <PresetTimer time={60} trigger={triggerTimer} />
          </div>
          <div className="flex space-x-5">
            <PresetTimer time={90} trigger={triggerTimer} />
            <PresetTimer time={120} trigger={triggerTimer} />
          </div>
          <div className="flex space-x-5">
            <PresetTimer time={150} trigger={triggerTimer} />
            <div
              onClick={clearTimer}
              className="flex items-center justify-center text-xl border border-red-500 rounded-4xl bg-red-500 hover:cursor-pointer w-32 aspect-square"
            >
              Reset
            </div>
          </div>
        </div>
      </div>
      <button className="my-5 invisible">
        Settings
      </button>
    </div>
  )
}

interface PresetTimerProps {
  time: number
  trigger: (time: number) => void
}

const PresetTimer: React.FC<PresetTimerProps> = ({ time, trigger }) => {
  return (
    <div
      onClick={() => trigger(time)}
      className="flex items-center justify-center text-xl border rounded-4xl active:bg-primary_light active:text-primary_dark hover:bg-primary_light hover:text-primary_dark hover:cursor-pointer w-32 aspect-square"
    >
      {formatTime(time)}
    </div>
  )
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export default Timer
