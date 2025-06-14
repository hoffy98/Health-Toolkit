import React, { useEffect, useState, useMemo } from 'react'

import Modal from '@/components/Modal'
import RangeSlider from '@/components/RangeSlider'

interface TrainProps {}

const Train: React.FC<TrainProps> = ({}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)
  const [exercises, setExercises] = useState<string[]>(['Pull', 'Push', 'Leg'])
  const [sets, setSets] = useState<number>(3)
  const [restTime, setRestTime] = useState<number>(2 * 60)
  const [countdown, setCountdown] = useState<number>(2 * 60)
  const [isCounting, setIsCounting] = useState<boolean>(false)

  const isReady = useMemo(
    () => !isCounting && countdown === 0,
    [isCounting, countdown]
  )

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

  useEffect(() => {
    setCountdown(restTime)
    setIsCounting(false)
  }, [restTime])

  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <div className="flex flex-col w-full h-full justify-center items-center">
        <h1
          onClick={triggerTimer}
          onDoubleClick={clearTimer}
          className="my-6 text-6xl font-bold"
        >
          {formatTime(countdown)}
        </h1>
        <Exercises
          triggerTimer={triggerTimer}
          exercises={exercises}
          sets={sets}
          isReady={isReady}
        />
        <TrainBackgroundColoring isReady={isReady} />
      </div>
      <button className="my-5" onClick={() => setIsSettingsOpen(true)}>
        Settings
      </button>
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
        <TrainSettings
          exercises={exercises}
          sets={sets}
          restTime={restTime}
          setExercises={setExercises}
          setSets={setSets}
          setRestTime={setRestTime}
        />
      </Modal>
    </div>
  )
}

interface TrainBackgroundColoringProps {
  isReady: boolean
}

const TrainBackgroundColoring: React.FC<TrainBackgroundColoringProps> = ({
  isReady,
}) => {
  const greenBgClass = 'bg-green-500'

  useEffect(() => {
    const rootDiv = document.getElementById('root')
    if (!rootDiv) return

    const setBgGreen = isReady

    if (setBgGreen) rootDiv.classList.add(greenBgClass)
    else rootDiv.classList.remove(greenBgClass)

    return () => {
      rootDiv.classList.remove(greenBgClass)
    }
  }, [isReady])

  return (
    <div className="hidden w-0 h-0">
      <div className="bg-green-500"></div>
    </div>
  )
}

interface TrainSettingsProps {
  exercises: string[]
  sets: number
  restTime: number
  setExercises: React.Dispatch<React.SetStateAction<string[]>>
  setSets: React.Dispatch<React.SetStateAction<number>>
  setRestTime: React.Dispatch<React.SetStateAction<number>>
}

const TrainSettings: React.FC<TrainSettingsProps> = ({
  exercises,
  sets,
  restTime,
  setExercises,
  setSets,
  setRestTime,
}) => {
  const [newExercise, setNewExercise] = useState<string>('')

  const handleExerciseNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewExercise(event.target.value)
  }

  const onAddNewExcersice = () => {
    setExercises((old) => {
      if (!old.includes(newExercise)) {
        return [...old, newExercise]
      }
      return old
    })
    setNewExercise('')
  }

  const handleExerciseKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      onAddNewExcersice()
    }
  }

  const onRemoveExcercise = (exerciseToRemove: string) => {
    setExercises((prevItems) =>
      prevItems.filter((item) => item !== exerciseToRemove)
    )
  }

  return (
    <div className="flex flex-col space-y-2">
      <h2>Settings</h2>
      <div className="flex">
        <p className="w-30 text-right mr-2 shrink-0">Sets ({sets})</p>
        <RangeSlider min={1} max={6} value={sets} setValue={setSets} />
      </div>
      <div className="flex">
        <p className="w-30 text-right mr-2 shrink-0">
          Rest ({formatTime(restTime)})
        </p>
        <RangeSlider
          min={0}
          max={5 * 60}
          value={restTime}
          setValue={setRestTime}
        />
      </div>
      <div className="flex items-center">
        <p className="w-30 text-right mr-2 shrink-0">Excercise</p>
        <input
          className="w-full border rounded"
          type="text"
          value={newExercise}
          onChange={handleExerciseNameChange}
          onKeyDown={handleExerciseKeyDown}
        />
        <button onClick={onAddNewExcersice} className="ml-2">
          Add
        </button>
      </div>
      <div className="flex space-x-5">
        {exercises.map((exercise) => (
          <p
            key={exercise}
            onClick={() => onRemoveExcercise(exercise)}
            className="hover:text-red-500 hover:cursor-pointer"
          >
            {exercise}
          </p>
        ))}
      </div>
    </div>
  )
}

interface ExercisesProps {
  exercises: string[]
  sets: number
  triggerTimer: () => void
  isReady: boolean
}

const Exercises: React.FC<ExercisesProps> = ({
  exercises,
  sets,
  triggerTimer,
  isReady,
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
            <ExerciseSet
              key={index}
              triggerTimer={triggerTimer}
              sets={sets}
              isReady={isReady}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

interface ExerciseSetProps {
  sets: number
  triggerTimer: () => void
  isReady: boolean
}

const ExerciseSet: React.FC<ExerciseSetProps> = ({
  sets,
  triggerTimer,
  isReady,
}) => {
  const [done, setDone] = useState<boolean>(false)

  const handleClick = () => {
    setDone((d) => !d)
    triggerTimer()
  }

  return (
    <div
      onClick={handleClick}
      className={`border-4 rounded-xl aspect-square hover:cursor-pointer ${
        isReady
          ? done
            ? 'border-green-500 bg-primary_light opacity-30'
            : 'bg-primary_dark border-green-500'
          : done
          ? 'bg-green-500 border-primary_dark'
          : 'bg-primary_light opacity-30 border-primary_dark'
      }`}
      style={{ width: `${100 / (sets + 2)}%` }}
    ></div>
  )
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export default Train
