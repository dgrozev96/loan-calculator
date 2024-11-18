import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CalculatorForm from '../components/CalculatorForm';
import { CalculatorProvider } from '../context/CalculatorContext';

describe('LoanCalculator', () => {
  const mockOnRemove = vi.fn();

  const renderComponent = () => {
    render(
      <CalculatorProvider>
        <CalculatorForm />
      </CalculatorProvider>,
    );
    const addButton = screen.getByText(/add calculator/i);
    fireEvent.click(addButton);
  };

  it('renders loan amount input correctly', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByLabelText(/loan amount/i)).toBeInTheDocument();
    });
  });

  it('renders annual interest rate input correctly', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByLabelText(/annual interest rate \(%\)/i)).toBeInTheDocument();
    });
  });

  it('renders loan term input correctly', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByLabelText(/loan term \(years\)/i)).toBeInTheDocument();
    });
  });

  it('handles loan amount input change', async () => {
    renderComponent();
    const loanAmountInput = await waitFor(() => screen.getByLabelText(/loan amount/i));
    fireEvent.change(loanAmountInput, { target: { value: '20000' } });
    expect((loanAmountInput as HTMLInputElement).value).toBe('20000');
  });

  it('handles annual interest rate input change', async () => {
    renderComponent();
    const interestRateInput = await waitFor(() => screen.getByLabelText(/annual interest rate \(%\)/i));
    fireEvent.change(interestRateInput, { target: { value: '10' } });
    expect((interestRateInput as HTMLInputElement).value).toBe('10');
  });

  it('handles loan term input change', async () => {
    renderComponent();
    const loanTermInput = await waitFor(() => screen.getByLabelText(/loan term \(years\)/i));
    fireEvent.change(loanTermInput, { target: { value: '5' } });
    expect((loanTermInput as HTMLInputElement).value).toBe('5');
  });
});