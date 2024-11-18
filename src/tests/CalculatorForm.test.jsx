import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CalculatorForm from '../components/CalculatorForm';
import { CalculatorProvider } from '../context/CalculatorContext';

describe('CalculatorForm', () => {
  test('renders correctly and adds a calculator', () => {
    render(
      <CalculatorProvider>
        <CalculatorForm />
      </CalculatorProvider>,
    );

    const addButton = screen.getByText(/add calculator/i);
    expect(addButton).toBeInTheDocument();

    fireEvent.click(addButton);
    const loanAmountInput = screen.getByLabelText(/loan amount/i);
    expect(loanAmountInput).toBeInTheDocument();
  });
});