import React, { useEffect, useRef, useMemo, useState } from 'react';
import RepaymentDetails from './RepaymentDetails';
import { useCalculatorContext } from '../context/CalculatorContext';
import CustomNumberInput from './CustomNumberInput';
import { Calculator } from '../types/calculator.ts';

interface LoanCalculatorProps {
  id: number;
  index: number;
  onRemove: (id: number) => void;
  updateMinRepayment: (calculators: Calculator[]) => void;
  isMinRepayment: boolean;
}

const LoanCalculator: React.FC<LoanCalculatorProps> = ({
                                                         id,
                                                         index,
                                                         onRemove,
                                                         updateMinRepayment,
                                                         isMinRepayment,
                                                       }) => {
  const { calculators, setCalculators, currency } = useCalculatorContext();

  const calculator = calculators[index];

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Calculate annual interest rate as a decimal
  const annualInterestRateDecimal = useMemo(
    () => calculator ? calculator.annualInterestRate / 100 : 0,
    [calculator?.annualInterestRate],
  );

  // Calculate total interest
  const totalInterest = useMemo(
    () => calculator ? calculator.loanAmount * annualInterestRateDecimal * calculator.loanTerm : 0,
    [calculator?.loanAmount, annualInterestRateDecimal, calculator?.loanTerm],
  );

  // Calculate total repayment
  const totalRepayment = useMemo(
    () => calculator ? calculator.loanAmount + totalInterest : 0,
    [calculator?.loanAmount, totalInterest],
  );

  const prevTotalRepaymentRef = useRef<number>(totalRepayment || 0);

  // Update minimum repayment when total repayment changes
  useEffect(() => {
    if (calculator && prevTotalRepaymentRef.current !== totalRepayment) {
      updateMinRepayment(calculators);
      prevTotalRepaymentRef.current = totalRepayment;
    }
  }, [totalRepayment, updateMinRepayment, calculators, calculator]);

  if (!calculator) {
    return null;
  }

  // Formatter for currency display
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Validate input values
  const validate = (name: string, value: number) => {
    const newErrors: { [key: string]: string } = { ...errors };
    if (name === 'loanAmount' && (value < 1000 || value > 100000)) {
      newErrors.loanAmount = 'Loan amount must be between 1000 and 100000';
    } else if (name === 'annualInterestRate' && (value < 1 || value > 100)) {
      newErrors.annualInterestRate = 'Annual interest rate must be between 1% and 100%';
    } else if (name === 'loanTerm' && (value < 1 || value > 30)) {
      newErrors.loanTerm = 'Loan term must be between 1 and 30 years';
    } else {
      delete newErrors[name];
    }
    setErrors(newErrors);
  };

  // Handle input changes
  const handleInputChange = (name: string, value: number) => {
    const updatedCalculators = calculators.map((calc, idx) =>
      idx === index ? { ...calc, [name]: value } : calc,
    );
    setCalculators(updatedCalculators);
    validate(name, value);
  };

  return (
    <div
      className={`p-2 px-4 w-60 h-98 border break-words rounded-lg shadow-md ${isMinRepayment ? 'bg-yellow-100' : 'bg-gray-300'} transition-transform transform duration-500 ease-in-out`}>
      <div className="mb-4">
        <label
          htmlFor={`loanAmount-${id}`}
          className="block text-sm font-medium text-gray-700"
        >
          Loan Amount
        </label>
        <input
          id={`loanAmount-${id}`}
          name="loanAmount"
          type="range"
          min="1000"
          max="100000"
          step="1000"
          value={calculator.loanAmount}
          className="mt-1 block w-full"
          onChange={(e) => handleInputChange('loanAmount', Number(e.target.value))}
        />
        <CustomNumberInput
          id={`loanAmountInput-${id}`}
          name="loanAmount"
          value={calculator.loanAmount}
          onChange={handleInputChange}
          min={1000}
          max={100000}
          step={1000}
        />
        {errors.loanAmount && <div className="text-red-500 text-sm">{errors.loanAmount}</div>}
      </div>

      <div className="mb-4">
        <label
          htmlFor={`annualInterestRate-${id}`}
          className="block text-sm font-medium text-gray-700"
        >
          Annual Interest Rate (%)
        </label>
        <input
          id={`annualInterestRate-${id}`}
          name="annualInterestRate"
          type="range"
          min="1"
          max="100"
          step="0.1"
          value={calculator.annualInterestRate}
          className="mt-1 block w-full"
          onChange={(e) => handleInputChange('annualInterestRate', Number(e.target.value))}
        />
        <CustomNumberInput
          id={`annualInterestRateInput-${id}`}
          name="annualInterestRate"
          value={calculator.annualInterestRate}
          onChange={handleInputChange}
          min={1}
          max={100}
          step={0.1}
        />
        {errors.annualInterestRate && <div className="text-red-500 text-sm">{errors.annualInterestRate}</div>}
      </div>

      <div className="mb-4">
        <label
          htmlFor={`loanTerm-${id}`}
          className="block text-sm font-medium text-gray-700"
        >
          Loan Term (years)
        </label>
        <input
          id={`loanTerm-${id}`}
          name="loanTerm"
          type="range"
          min="1"
          max="30"
          step="1"
          value={calculator.loanTerm}
          className="mt-1 block w-full"
          onChange={(e) => handleInputChange('loanTerm', Number(e.target.value))}
        />
        <CustomNumberInput
          id={`loanTermInput-${id}`}
          name="loanTerm"
          value={calculator.loanTerm}
          onChange={handleInputChange}
          min={1}
          max={30}
          step={1}
        />
        {errors.loanTerm && <div className="text-red-500 text-sm">{errors.loanTerm}</div>}
      </div>

      <RepaymentDetails
        totalInterest={totalInterest || 0}
        totalRepayment={totalRepayment || 0}
        hasError={() => !!(errors.loanAmount || errors.annualInterestRate || errors.loanTerm)}
        formatter={formatter}
      />

      <button
        type="button"
        onClick={() => onRemove(id)}
        className="bg-red-500 text-white px-4 py-2 rounded-md"
      >
        Remove
      </button>
    </div>
  );
};

export default LoanCalculator;