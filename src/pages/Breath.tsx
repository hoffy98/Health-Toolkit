import React, { useEffect, useState } from 'react'
import './Breath.css'

import Modal from '@/components/Modal'
import RangeSlider from '@/components/RangeSlider'

interface BreathProps {}

const Breath: React.FC<BreathProps> = ({}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)
  const [durations, setDurations] = useState<[number, number, number, number]>([
    4000, 1000, 4000, 1000,
  ])

  return (
    <div className="flex flex-col w-full h-full items-center">
      <div className="flex w-full h-full items-center justify-center">
        <BreathingCircle durations={durations} />
      </div>
      <button onClick={() => setIsSettingsOpen(true)}>Settings</button>
      {/* Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
        <BreathSettings durations={durations} setDurations={setDurations} />
      </Modal>
    </div>
  )
}

interface BreathSettingsProps {
  durations: [number, number, number, number] // [breatheIn, hold1, breatheOut, hold2] in ms
  setDurations: React.Dispatch<
    React.SetStateAction<[number, number, number, number]>
  >
}

const BreathSettings: React.FC<BreathSettingsProps> = ({
  durations,
  setDurations,
}) => {
  const setBreatheIn = (time_ms: number) => {
    setDurations((old) => [time_ms, old[1], old[2], old[3]])
  }

  const setHold1 = (time_ms: number) => {
    setDurations((old) => [old[0], time_ms, old[2], old[3]])
  }

  const setBreatheOut = (time_ms: number) => {
    setDurations((old) => [old[0], old[1], time_ms, old[3]])
  }

  const setHold2 = (time_ms: number) => {
    setDurations((old) => [old[0], old[1], old[2], time_ms])
  }

  const set424 = () => {
    setDurations([4000, 2000, 4000, 0])
  }

  const set478 = () => {
    setDurations([4000, 7000, 8000, 0])
  }

  const setBox = () => {
    setDurations((old) => [old[0], old[0], old[0], old[0]])
  }

  return (
    <div className="flex flex-col space-y-2">
      <h2>Settings</h2>
      <BreathTimeSlider
        name="In"
        value={durations[0]}
        setValue={setBreatheIn}
      />
      <BreathTimeSlider name="Hold" value={durations[1]} setValue={setHold1} />
      <BreathTimeSlider
        name="Out"
        value={durations[2]}
        setValue={setBreatheOut}
      />
      <BreathTimeSlider name="Hold" value={durations[3]} setValue={setHold2} />
      <div className="flex space-x-4">
        <div>Presets:</div>
        <button onClick={set424}>4-2-4</button>
        <button onClick={set478}>4-7-8</button>
        <button onClick={setBox}>Box</button>
      </div>
    </div>
  )
}

interface BreathTimeSliderProps {
  name: string
  value: number
  setValue: (newValue: number) => void
}

const BreathTimeSlider: React.FC<BreathTimeSliderProps> = ({
  name,
  value,
  setValue,
}) => {
  return (
    <div className="flex">
      <p className="w-28 text-right mr-2 shrink-0">
        {name} ({(value / 1000).toFixed(1)}s)
      </p>
      <RangeSlider min={0} max={9900} value={value} setValue={setValue} />
    </div>
  )
}

interface BreathingCircleProps {
  durations: [number, number, number, number] // [breatheIn, hold1, breatheOut, hold2] in ms
}

const BreathingCircle: React.FC<BreathingCircleProps> = ({ durations }) => {
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
    <>
      <div
        className={`flex items-center border rounded-full justify-center w-1/2 aspect-square ${phases[phaseIndex].animationShadow}`}
        style={{ animationDuration: `${durations[phaseIndex]}ms` }}
      >
        <div
          className={`aspect-square rounded-full ${phases[phaseIndex].color} ${phases[phaseIndex].animation}`}
          style={{ animationDuration: `${durations[phaseIndex]}ms` }}
        />
      </div>
    </>
  )
}

export default Breath
