interface NumberInputProps {
  value: number
  setValue: (newValue: number) => void
  min: number
  max: number
}

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  setValue,
  min,
  max,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    let newNumberValue = parseInt(newValue, 10)
    if (newValue == '') newNumberValue = 0
    if (isNaN(newNumberValue)) return
    if (newNumberValue > max || newNumberValue < min) return

    setValue(newNumberValue)
  }

  return (
    <>
      <input
        className="w-full outline-0"
        value={value}
        onChange={handleChange}
      />
    </>
  )
}

export default NumberInput
