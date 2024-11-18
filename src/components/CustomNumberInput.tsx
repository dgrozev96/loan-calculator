import React, { useState, useEffect } from 'react';

interface CustomNumberInputProps {
  id: string;
  name: string;
  value: number;
  onChange: (name: string, value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const CustomNumberInput: React.FC<CustomNumberInputProps> = ({
                                                               id,
                                                               name,
                                                               value,
                                                               onChange,
                                                               min,
                                                               max,
                                                               step,
                                                             }) => {
  const [inputValue, setInputValue] = useState<string>(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    const numericValue = parseFloat(newValue);
    if (!isNaN(numericValue)) {
      onChange(name, numericValue);
    }
  };

  const handleBlur = () => {
    if (inputValue === '' || isNaN(parseFloat(inputValue))) {
      setInputValue(value.toString());
    }
  };

  return (
    <input
      id={id}
      name={name}
      type="text"
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      min={min}
      max={max}
      step={step}
      className="p-1 mt-1 block w-full rounded text-gray-400"
    />
  );
};

export default CustomNumberInput;