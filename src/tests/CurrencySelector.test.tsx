import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CurrencySelector from '../components/CurrencySelector';
import { CalculatorProvider } from '../context/CalculatorContext';

describe('CurrencySelector', () => {
  test('renders correctly and changes currency', () => {
    render(
      <CalculatorProvider>
        <CurrencySelector />
      </CalculatorProvider>,
    );

    const selectElement = screen.getByLabelText(/select currency/i);
    expect(selectElement).toBeInTheDocument();

    fireEvent.change(selectElement, { target: { value: 'EUR' } });
    expect(selectElement).toHaveValue('EUR');
  });
});