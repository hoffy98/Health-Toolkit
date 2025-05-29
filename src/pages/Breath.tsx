import React, { useEffect, useState } from 'react'
import './Breath.css'

interface BreathProps {}

const Breath: React.FC<BreathProps> = ({}) => {
  return (
    <div className="flex w-full h-full justify-center items-center">
      <BreathingCircle durations={[4000, 1000, 4000, 1000]} />
    </div>
  )
}

interface BreathingCircleProps {
  durations?: [number, number, number, number] // [breatheIn, hold1, breatheOut, hold2] in ms
}

const BreathingCircle: React.FC<BreathingCircleProps> = ({
  durations = [4000, 2000, 4000, 2000],
}) => {
  const [phaseIndex, setPhaseIndex] = useState(0)

  const phases = [
    {
      name: 'Breathe In',
      color: 'bg-green-400',
      animation: 'breathing-in',
      animationShadow: 'breathing-in-shadow',
    },
    {
      name: 'Hold',
      color: 'bg-green-400',
      animation: 'hold-in',
      animationShadow: 'hold-in-shadow',
    },
    {
      name: 'Breathe Out',
      color: 'bg-green-400',
      animation: 'breathing-out',
      animationShadow: 'breathing-out-shadow',
    },
    {
      name: 'Hold',
      color: 'bg-green-400',
      animation: 'hold-out',
      animationShadow: 'hold-out-shadow',
    },
  ]

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPhaseIndex((prev) => (prev + 1) % phases.length)
    }, durations[phaseIndex])

    return () => clearTimeout(timeout)
  }, [phaseIndex, durations])

  return (
    <div
      className={`flex items-center border rounded-full justify-center w-1/2 aspect-square ${phases[phaseIndex].animationShadow}`}
      style={{ animationDuration: `${durations[phaseIndex]}ms` }}
    >
      <div
        className={`aspect-square rounded-full ${phases[phaseIndex].color} ${phases[phaseIndex].animation}`}
        style={{ animationDuration: `${durations[phaseIndex]}ms` }}
      />
    </div>
  )
}

export default Breath
