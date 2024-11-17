import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import CurrencySelector from './components/CurrencySelector';
import CalculatorForm from './components/CalculatorForm';
import { Calculator } from './types/calculator.ts';

const App: React.FC = () => {
    const [calculators, setCalculators] = useState<number[]>([]);
    const [repayments, setRepayments] = useState<{ id: number; amount: number }[]>([]);
    const [minRepayment, setMinRepayment] = useState<{ id: number; amount: number } | null>(null);
    const [currency, setCurrency] = useState<string>('BGN');
    const formikRef = useRef<any>(null);

    const addCalculator = () => {
        const newId = calculators.length + 1;
        setCalculators([...calculators, newId]);
        formikRef.current.setFieldValue('calculators', [
            ...formikRef.current.values.calculators,
            {
                id: newId,
                loanAmount: 10000,
                annualInterestRate: 5,
                loanTerm: 3,
            },
        ]);
    };

    const removeCalculator = (id: number) => {
        setCalculators(calculators.filter(calcId => calcId !== id));
        setRepayments(repayments.filter(repayment => repayment.id !== id));
        formikRef.current.setFieldValue(
          'calculators',
          formikRef.current.values.calculators.filter(
            (calculator: any) => calculator.id !== id,
          ),
        );
    };

    const updateMinRepayment = (calculators: Calculator[]) => {
        const updatedRepayments = calculators.map(calculator => ({
            id: calculator.id,
            amount:
              calculator.loanAmount +
              ((calculator.loanAmount * calculator.annualInterestRate) / 100) *
              calculator.loanTerm,
        }));

        const min = updatedRepayments.reduce(
          (prev, curr) => (curr.amount < prev.amount ? curr : prev),
          updatedRepayments[0],
        );
        setMinRepayment(min);
        setRepayments(updatedRepayments);
    };

    useEffect(() => {
        if (repayments.length > 0) {
            const min = repayments.reduce((prev, curr) =>
              curr.amount < prev.amount ? curr : prev,
            );
            setMinRepayment(min);
        } else {
            setMinRepayment(null);
        }
    }, [repayments]);

    return (
      <div className="flex items-center justify-center text-gray-900">
          <div className="items-center">
              <h1 className="text-xl font-bold text-white">Loan Calculator</h1>
              <CurrencySelector currency={currency} setCurrency={setCurrency} />
              <CalculatorForm
                calculators={calculators}
                formikRef={formikRef}
                addCalculator={addCalculator}
                removeCalculator={removeCalculator}
                updateMinRepayment={updateMinRepayment}
                minRepayment={minRepayment}
                currency={currency}
              />
          </div>
      </div>
    );
};

export default App;