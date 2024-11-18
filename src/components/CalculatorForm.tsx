import React from 'react';
import LoanCalculator from './LoanCalculator';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useCalculatorContext } from '../context/CalculatorContext';
import { Calculator } from '../types/calculator.ts';

const CalculatorForm: React.FC = () => {
  const {
    calculators,
    setCalculators,
    repayments,
    setRepayments,
    minRepayment,
    setMinRepayment,
  } = useCalculatorContext();

// src/components/CalculatorForm.tsx

  const addCalculator = () => {
    const newId = calculators.length + 1;
    const newCalculators = [...calculators, { id: newId, loanAmount: 10000, annualInterestRate: 5, loanTerm: 3 }];
    setCalculators(newCalculators);
    updateMinRepayment(newCalculators);
  };

  const removeCalculator = (id: number) => {
    const newCalculators = calculators.filter(calc => calc.id !== id);
    setCalculators(newCalculators);
    setRepayments(repayments.filter(repayment => repayment.id !== id));
    updateMinRepayment(newCalculators);
  };

  const updateMinRepayment = (calculators: Calculator[]) => {
    if (calculators.length === 1) {
      setMinRepayment(null);
      return;
    }

    const updatedRepayments = calculators.map(calculator => ({
      id: calculator.id,
      amount: calculator.loanAmount + ((calculator.loanAmount * calculator.annualInterestRate) / 100) * calculator.loanTerm,
    }));

    const min = updatedRepayments.reduce((prev, curr) => (curr.amount < prev.amount ? curr : prev), updatedRepayments[0]);
    setMinRepayment(min);
    setRepayments(updatedRepayments);
  };

  return (
    <div>
      <button onClick={addCalculator} className="bg-green-500 text-white py-2 rounded-md mb-2">
        Add Calculator
      </button>
      <TransitionGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {calculators.map((calculator, index) => (
          <CSSTransition key={calculator.id} timeout={500} classNames="fade">
            <LoanCalculator
              id={calculator.id}
              index={index}
              onRemove={removeCalculator}
              updateMinRepayment={updateMinRepayment}
              isMinRepayment={minRepayment?.id === calculator.id}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
};

export default CalculatorForm;