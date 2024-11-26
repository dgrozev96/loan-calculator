import { useState } from 'react';

const useValidation = () => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  return { errors, validate };
};

export default useValidation;