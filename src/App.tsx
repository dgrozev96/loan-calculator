import React, { useState, useEffect, useRef } from 'react';
import LoanCalculator from './components/LoanCalculator';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Formik } from 'formik';
import * as Yup from 'yup';
import './App.css';
import {Calculator} from "./types/calculator.ts";

const App: React.FC = () => {
    const [calculators, setCalculators] = useState<number[]>([]);
    const [repayments, setRepayments] = useState<{ id: number, amount: number }[]>([]);
    const [minRepayment, setMinRepayment] = useState<{ id: number, amount: number } | null>(null);
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
        setCalculators(calculators.filter((calcId) => calcId !== id));
        setRepayments(repayments.filter((repayment) => repayment.id !== id));
        formikRef.current.setFieldValue('calculators', formikRef.current.values.calculators.filter((calculator: any) => calculator.id !== id));
    };

    const updateMinRepayment = (calculators: Calculator[]) => {
        const updatedRepayments = calculators.map((calculator) => ({
            id: calculator.id,
            amount: calculator.loanAmount + (calculator.loanAmount * calculator.annualInterestRate / 100 * calculator.loanTerm),
        }));

        const min = updatedRepayments.reduce((prev, curr) => (curr.amount < prev.amount ? curr : prev), updatedRepayments[0]);
        setMinRepayment(min);
        setRepayments(updatedRepayments);
    };

    useEffect(() => {
        if (repayments.length > 0) {
            const min = repayments.reduce((prev, curr) => (curr.amount < prev.amount ? curr : prev));
            setMinRepayment(min);
        } else {
            setMinRepayment(null);
        }
    }, [repayments]);

    return (
        <div className="flex items-center justify-center min-h-screen text-gray-900">
            <div className=" p-4 items-center">
                <h1 className="text-2xl font-bold mb-4 text-white">Loan Calculator</h1>
                <div className='flex gap-2 items-center justify-center my-4'>
                    <label htmlFor="currency" className=" text-sm font-medium text-white">
                        Select Currency
                    </label>
                    <select
                        id="currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="p-2 border rounded-md max-w-xs text-gray-400"
                    >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="BGN">BGN</option>
                    </select>

                    <button onClick={addCalculator} className="bg-green-500 text-white py-2 rounded-md">
                        Add Calculator
                    </button>
                </div>

                <Formik
                    innerRef={formikRef}
                    initialValues={{
                        calculators: calculators.map(id => ({
                            id,
                            loanAmount: 10000,
                            annualInterestRate: 5,
                            loanTerm: 3,
                        }))
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
                            })
                        )
                    })}
                    onSubmit={() => {}}
                >
                    {({ values }) => (
                        <TransitionGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {values.calculators.map((calculator, index) => (
                                <CSSTransition key={calculator.id} timeout={500} classNames="fade">
                                    {calculator && (
                                        <LoanCalculator
                                            id={calculator.id}
                                            index={index}
                                            onRemove={removeCalculator}
                                            updateMinRepayment={updateMinRepayment}
                                            isMinRepayment={minRepayment?.id === calculator.id}
                                            currency={currency}
                                        />
                                    )}
                                </CSSTransition>
                            ))}
                        </TransitionGroup>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default App;