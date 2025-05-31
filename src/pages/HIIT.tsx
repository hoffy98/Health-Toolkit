import React from 'react'
import { motion, useAnimation } from 'framer-motion'

interface HIITProps {}

const HIIT: React.FC<HIITProps> = ({}) => {
  const strokeWidth = 5
  const radius = 50 - strokeWidth / 2
  const circumference = 2 * Math.PI * radius

  const controls = useAnimation()

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
    <div className="flex flex-col w-full h-full justify-center items-center">
      <div
        onClick={() => startAnimation(1)}
        className="relative w-[min(70vw,60vh)] aspect-square border border-red-500"
      >
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
          00:05
        </div>
      </div>
    </div>
  )
}

export default HIIT
