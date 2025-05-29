interface RangeSliderProps {
  value: number
  setValue: (newValue: number) => void
  min: number
  max: number
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  value,
  setValue,
  min,
  max,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value))
  }

  return (
    <div className="w-full">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
    </div>
  )
}

export default RangeSlider
