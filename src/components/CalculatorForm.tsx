import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import LoanCalculator from './LoanCalculator.tsx';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface CalculatorFormProps {
  calculators: any[];
  formikRef: any;
  addCalculator: () => void;
  removeCalculator: (id: number) => void;
  updateMinRepayment: (calculators: any[]) => void;
  minRepayment: any;
  currency: string;
}


const CalculatorForm: React.FC<CalculatorFormProps> = ({
                                                         calculators,
                                                         formikRef,
                                                         addCalculator,
                                                         removeCalculator,
                                                         updateMinRepayment,
                                                         minRepayment,
                                                         currency,
                                                       }) => (
  <Formik
    innerRef={formikRef}
    initialValues={{
      calculators: calculators.map(id => ({
        id,
        loanAmount: 10000,
        annualInterestRate: 5,
        loanTerm: 3,
      })),
    }}
    validationSchema={Yup.object({
      calculators: Yup.array().of(
        Yup.object({
          loanAmount: Yup.number()
            .required('Required')
            .positive('Must be positive')
            .max(10000000, 'Must not exceed 10 million'),
          annualInterestRate: Yup.number()
            .required('Required')
            .min(1, 'Must be at least 1')
            .max(100, 'Must be at most 100'),
          loanTerm: Yup.number()
            .required('Required')
            .min(1, 'Must be at least 1')
            .max(100, 'Must be at most 100')
            .integer('Must be an integer'),
        }),
      ),
    })}
    onSubmit={() => {
    }}
  >
    {({ values }) => (
      <div>
        <button
          onClick={addCalculator}
          className="bg-green-500 text-white py-2 rounded-md mb-2"
        >
          Add Calculator
        </button>
        <TransitionGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.calculators.map((calculator, index) => (
            <CSSTransition
              key={calculator.id}
              timeout={500}
              classNames="fade"
            >
              <LoanCalculator
                id={calculator.id}
                index={index}
                onRemove={removeCalculator}
                updateMinRepayment={updateMinRepayment}
                isMinRepayment={minRepayment?.id === calculator.id}
                currency={currency}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    )}
  </Formik>
);

export default CalculatorForm;