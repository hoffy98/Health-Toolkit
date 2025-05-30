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
  const [repeats, setRepeats] = useState<number>(0)

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
          durationsMs={durations}
          restartTrigger={restartTrigger}
          repeats={repeats}
        />
      </div>
      <button onClick={() => setIsSettingsOpen(true)}>Settings</button>
      {/* Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
        <BreathSettings
          durations={durations}
          setDurations={setDurations}
          repeats={repeats}
          setRepeats={setRepeats}
        />
      </Modal>
    </div>
  )
}

interface BreathSettingsProps {
  durations: [number, number, number, number] // [breatheIn, hold1, breatheOut, hold2] in ms
  setDurations: React.Dispatch<
    React.SetStateAction<[number, number, number, number]>
  >
  repeats: number
  setRepeats: React.Dispatch<React.SetStateAction<number>>
}

const BreathSettings: React.FC<BreathSettingsProps> = ({
  durations,
  setDurations,
  repeats,
  setRepeats,
}) => {
  const totalDuration =
    repeats * durations.map((d) => d / 1000).reduce((a, b) => a + b)

  const totalDuration_min = Math.floor(totalDuration / 60)
  const totalDuration_s = Math.round(totalDuration - totalDuration_min * 60)

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
      <div className="flex">
        <p className="w-28 text-right mr-2 shrink-0">Times ({repeats})</p>
        <RangeSlider min={0} max={50} value={repeats} setValue={setRepeats} />
      </div>
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
      <p className="opacity-20">
        {totalDuration_min}min {totalDuration_s}s
      </p>
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
  restartTrigger: boolean
  repeats: number
}

const BreathingCircle: React.FC<BreathingCircleProps> = ({
  durationsMs,
  restartTrigger,
  repeats,
}) => {
  const [repeatsLeft, setRepeatsLeft] = useState<number>(0)
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

    setRepeatsLeft(repeats)

    intervalRef.current = setInterval(() => {
      setRepeatsLeft((val) => Math.max(0, val - 1))
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
  }, [durationsMs.join(','), restartTrigger, repeats]) // Trigger only when values change

  return (
    <div className="flex flex-col space-y-5 items-center justify-center w-full h-full">
      <div className="flex items-center border rounded-full justify-center aspect-square w-[min(70vw,60vh)]">
        <motion.div
          className="aspect-square rounded-full bg-green-500"
          animate={controls}
        />
      </div>
      <p className="opacity-20">{repeatsLeft}</p>
    </div>
  )
}

export default Breath
