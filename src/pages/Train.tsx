import React, { useEffect, useRef, useState } from 'react'

import Modal from '@/components/Modal'

interface TrainProps {}

const Train: React.FC<TrainProps> = ({}) => {
  const [exercises, setExercises] = useState<string[]>(['Pull', 'Push', 'Leg'])
  const [sets, setSets] = useState<number>(3)
  const [restTime, setRestTime] = useState<number>(3)
  const [countdown, setCountdown] = useState<number>(3)
  const [isCounting, setIsCounting] = useState<boolean>(false)

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(
      2,
      '0'
    )}`
  }

  const triggerTimer = () => {
    setCountdown(restTime)
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
    <div className="flex flex-col w-full h-full justify-center items-center space-y-5">
      <h1
        onClick={triggerTimer}
        onDoubleClick={clearTimer}
        className={`text-6xl font-bold ${countdown == 0 ? "text-green-500" : ""}`}
      >
        {formatTime(countdown)}
      </h1>
      <Exercises
        triggerTimer={triggerTimer}
        exercises={exercises}
        sets={sets}
      />
      <hr className='mt-12' />
    </div>
  )
}

interface ExercisesProps {
  exercises: string[]
  sets: number
  triggerTimer: () => void
}

const Exercises: React.FC<ExercisesProps> = ({
  exercises,
  sets,
  triggerTimer,
}) => {
  return (
    <div className="flex flex-col w-[90vw] max-w-md">
      {exercises.map((exercise) => (
        <div className="flex" key={exercise}>
          <p
            style={{ width: `${100 / (sets + 2)}%` }}
            className="my-auto text-right p-2"
          >
            {exercise}
          </p>
          {Array.from({ length: sets }).map((_, index) => (
            <ExerciseSet key={index} triggerTimer={triggerTimer} sets={sets} />
          ))}
        </div>
      ))}
    </div>
  )
}

interface ExerciseSetProps {
  sets: number
  triggerTimer: () => void
}

const ExerciseSet: React.FC<ExerciseSetProps> = ({ sets, triggerTimer }) => {
  const [done, setDone] = useState<boolean>(false)

  const handleClick = () => {
    setDone((d) => !d)
    triggerTimer()
  }

  return (
    <div
      onClick={handleClick}
      className={`border-4 border-primary_dark rounded-xl aspect-square ${
        done ? 'bg-green-500' : 'bg-primary_light opacity-30'
      }`}
      style={{ width: `${100 / (sets + 2)}%` }}
    ></div>
  )
}

export default Train
