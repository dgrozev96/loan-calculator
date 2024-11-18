import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Calculator {
  id: number;
  loanAmount: number;
  annualInterestRate: number;
  loanTerm: number;
}

interface CalculatorContextProps {
  calculators: Calculator[];
  repayments: { id: number; amount: number }[];
  minRepayment: { id: number; amount: number } | null;
  currency: string;
  setCalculators: React.Dispatch<React.SetStateAction<Calculator[]>>;
  setRepayments: React.Dispatch<React.SetStateAction<{ id: number; amount: number }[]>>;
  setMinRepayment: React.Dispatch<React.SetStateAction<{ id: number; amount: number } | null>>;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
}

interface CalculatorProviderProps {
  children: ReactNode;
}

const CalculatorContext = createContext<CalculatorContextProps | undefined>(undefined);

export const CalculatorProvider: React.FC<CalculatorProviderProps> = ({ children }) => {
  const [calculators, setCalculators] = useState<Calculator[]>([]);
  const [repayments, setRepayments] = useState<{ id: number; amount: number }[]>([]);
  const [minRepayment, setMinRepayment] = useState<{ id: number; amount: number } | null>(null);
  const [currency, setCurrency] = useState<string>('BGN');

  return (
    <CalculatorContext.Provider
      value={{
        calculators,
        repayments,
        minRepayment,
        currency,
        setCalculators,
        setRepayments,
        setMinRepayment,
        setCurrency,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
};

export const useCalculatorContext = () => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculatorContext must be used within a CalculatorProvider');
  }
  return context;
};