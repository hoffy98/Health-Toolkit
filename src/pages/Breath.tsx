import React, { useEffect, useRef, useState } from 'react'

import { motion, useAnimation } from 'framer-motion'

import Modal from '@/components/Modal'
import RangeSlider from '@/components/RangeSlider'

interface BreathProps {}

const Breath: React.FC<BreathProps> = ({}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)
  const [restartTrigger, setRestartTrigger] = useState<boolean>(false)
  const [durations, setDurations] = useState<[number, number, number, number]>([
    4000, 1000, 4000, 1000,
  ])

  const onAnimationStart = () => {
    console.log('Animation Start')
  }

  const triggerAnimationRestart = () => {
    setRestartTrigger((old) => !old)
  }

  return (
    <div className="flex flex-col w-full h-full items-center">
      <div
        onClick={triggerAnimationRestart}
        className="flex w-full h-full items-center justify-center"
      >
        <BreathingCircle
          onAnimationStart={onAnimationStart}
          durationsMs={durations}
          restartTrigger={restartTrigger}
        />
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
  durationsMs: [number, number, number, number] // [breatheIn, hold1, breatheOut, hold2]
  onAnimationStart: () => void
  restartTrigger: boolean
}

const BreathingCircle: React.FC<BreathingCircleProps> = ({
  durationsMs,
  onAnimationStart,
  restartTrigger,
}) => {
  const durations = durationsMs.map((d) => d / 1000)
  const totalDuration = durations.reduce((a, b) => a + b)
  const controls = useAnimation()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Cancel any previous intervals immediately
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // Fire immediately
    onAnimationStart?.()

    // Start interval for repeated callbacks
    intervalRef.current = setInterval(() => {
      onAnimationStart?.()
    }, totalDuration * 1000)

    // Start the animation
    controls.set({ width: '0%' }) // Reset to initial state
    controls.start({
      width: ['0%', '100%', '100%', '0%', '0%'],
      transition: {
        repeat: Infinity,
        duration: totalDuration,
        ease: ['easeOut', 'linear', 'easeOut', 'linear'],
        times: [
          0,
          durations[0] / totalDuration,
          (durations[0] + durations[1]) / totalDuration,
          (durations[0] + durations[1] + durations[2]) / totalDuration,
          1,
        ],
      },
    })

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [durationsMs.join(','), restartTrigger]) // Trigger only when values change

  return (
    <div className="flex items-center border rounded-full justify-center w-1/2 aspect-square">
      <motion.div
        className="aspect-square rounded-full bg-green-500"
        animate={controls}
      />
    </div>
  )
}

export default Breath
