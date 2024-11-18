import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useFormikContext, Field, ErrorMessage, FormikTouched, FormikErrors } from 'formik';
import RepaymentDetails from './RepaymentDetails';
import { Calculator } from '../types/calculator.ts';

interface LoanCalculatorProps {
  id: number;
  index: number;
  onRemove: (id: number) => void;
  updateMinRepayment: (calculators: Calculator[]) => void;
  isMinRepayment: boolean;
  currency: string;
}


const LoanCalculator: React.FC<LoanCalculatorProps> = ({
                                                         id,
                                                         index,
                                                         onRemove,
                                                         updateMinRepayment,
                                                         isMinRepayment,
                                                         currency,
  
                                                       }) => {
  const { values, errors, touched } = useFormikContext<any>();

  const annualInterestRateDecimal = useMemo(
    () => values?.calculators[index]?.annualInterestRate / 100,
    [values?.calculators[index]?.annualInterestRate],
  );

  const totalInterest = useMemo(
    () =>
      values?.calculators[index]?.loanAmount *
      annualInterestRateDecimal *
      values?.calculators[index]?.loanTerm,
    [
      values?.calculators[index]?.loanAmount,
      annualInterestRateDecimal,
      values?.calculators[index]?.loanTerm,
    ],
  );

  const totalRepayment = useMemo(
    () => values?.calculators[index]?.loanAmount + totalInterest,
    [values?.calculators[index]?.loanAmount, totalInterest],
  );

  const prevTotalRepaymentRef = useRef<number>(totalRepayment);

  useEffect(() => {
    if (prevTotalRepaymentRef.current !== totalRepayment) {
      updateMinRepayment(values.calculators);
      prevTotalRepaymentRef.current = totalRepayment;
    }
  }, [totalRepayment, updateMinRepayment, values]);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const hasError = useCallback(
    (field: string): boolean => {
      const touchedCalculators = touched?.calculators as FormikTouched<any>[] | undefined;
      const errorsCalculators = errors?.calculators as FormikErrors<any>[] | undefined;
      return !!(
        touchedCalculators?.[index]?.[field] &&
        errorsCalculators?.[index]?.[field]
      );
    },
    [touched, errors, index],
  );

  const isHighlight = useMemo(() => {
    return isMinRepayment && values.calculators.length > 1;
  }, [isMinRepayment, values.calculators.length]);

  return (
    <div
      className={`p-2 px-4 w-60 h-98 border break-words rounded-lg shadow-md ${
        isHighlight ? 'bg-yellow-100' : 'bg-gray-300'
      } transition-transform transform duration-500 ease-in-out`}
    >
      <div className="mb-4">
        <label
          htmlFor={`loanAmount-${id}`}
          className="block text-sm font-medium text-gray-700"
        >
          Loan Amount
        </label>
        <Field
          id={`loanAmount-${id}`}
          name={`calculators[${index}].loanAmount`}
          type="range"
          min="1000"
          max="100000"
          step="1000"
          className="mt-1 block w-full"
        />
        <Field
          id={`loanAmountInput-${id}`}
          name={`calculators[${index}].loanAmount`}
          type="number"
          className="p-1 mt-1 block w-full rounded text-gray-400"
        />
        <ErrorMessage
          name={`calculators[${index}].loanAmount`}
          component="div"
          className="text-red-500 text-sm"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor={`annualInterestRate-${id}`}
          className="block text-sm font-medium text-gray-700"
        >
          Annual Interest Rate (%)
        </label>
        <Field
          id={`annualInterestRate-${id}`}
          name={`calculators[${index}].annualInterestRate`}
          type="range"
          min="1"
          max="100"
          step="0.1"
          className="mt-1 block w-full"
        />
        <Field
          id={`annualInterestRateInput-${id}`}
          name={`calculators[${index}].annualInterestRate`}
          type="number"
          className="p-1 mt-1 block w-full rounded text-gray-400"
        />
        <ErrorMessage
          name={`calculators[${index}].annualInterestRate`}
          component="div"
          className="text-red-500 text-sm"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor={`loanTerm-${id}`}
          className="block text-sm font-medium text-gray-700"
        >
          Loan Term (years)
        </label>
        <Field
          id={`loanTerm-${id}`}
          name={`calculators[${index}].loanTerm`}
          type="range"
          min="1"
          max="30"
          step="1"
          className="mt-1 block w-full"
        />
        <Field
          id={`loanTermInput-${id}`}
          name={`calculators[${index}].loanTerm`}
          type="number"
          step="1"
          className="p-1 mt-1 block w-full text-gray-400 rounded"
        />
        <ErrorMessage
          name={`calculators[${index}].loanTerm`}
          component="div"
          className="text-red-500 text-sm"
        />
      </div>

      <RepaymentDetails
        totalInterest={totalInterest}
        totalRepayment={totalRepayment}
        hasError={hasError}
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