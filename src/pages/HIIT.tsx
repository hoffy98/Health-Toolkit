import React, { useEffect, useState, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'

interface HIITProps {}

const HIIT: React.FC<HIITProps> = ({}) => {
  const [countdownDuration, setCountdownDuration] = useState<number>(10)
  const [countdonwTrigger, setCountdownTrigger] = useState<boolean>(false)

  const onCountdownFinished = () => {}

  return (
    <div
      onClick={() => setCountdownTrigger((v) => !v)}
      className="flex flex-col w-full h-full justify-center items-center"
    >
      <HIITCountdown
        countdownDuration={countdownDuration}
        countdonwTrigger={countdonwTrigger}
        countdownCallback={onCountdownFinished}
      />
    </div>
  )
}

interface HIITCountdownProps {
  countdownDuration: number
  countdonwTrigger: boolean
  countdownCallback: () => void
}

const HIITCountdown: React.FC<HIITCountdownProps> = ({
  countdownDuration,
  countdonwTrigger,
  countdownCallback,
}) => {
  const [countdown, setCountdown] = useState<number>(0)
  const [isCounting, setIsCounting] = useState<boolean>(false)

  const strokeWidth = 5
  const radius = 50 - strokeWidth / 2
  const circumference = 2 * Math.PI * radius

  const controls = useAnimation()

  useEffect(() => {
    triggerCountdown()
  }, [countdonwTrigger])

  const triggerCountdown = () => {
    startAnimation(countdownDuration, countdownCallback)
    triggerTimer(countdownDuration)
  }

  // Timer
  useEffect(() => {
    setCountdown(countdownDuration)
  }, [countdownDuration])

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

  const triggerTimer = (time_s: number) => {
    setCountdown(time_s)
    setIsCounting(true)
  }

  // Circle
  const startAnimation = (duration: number, onComplete?: () => void) => {
    resetAnimation()
    controls
      .start({
        strokeDashoffset: 0,
        transition: { duration, ease: 'linear' },
      })
      .then(() => {
        if (onComplete) onComplete()
      })
  }

  const resetAnimation = () => {
    controls.set({
      strokeDashoffset: circumference,
    })
  }

  return (
    <div className="relative w-[min(70vw,60vh)] aspect-square">
      {/* SVG Layer (on top) */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <motion.circle
          className="stroke-green-500"
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={controls}
          initial={{ strokeDashoffset: circumference }}
          style={{
            transformOrigin: '50% 50%',
            rotate: -90,
          }}
        />
      </motion.svg>

      {/* Text in the center */}
      <div className="absolute inset-0 flex items-center justify-center text-6xl font-bold bg-transparent">
        {formatTime(countdown)}
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
