import React from 'react';
import './App.css';
import CurrencySelector from './components/CurrencySelector';
import CalculatorForm from './components/CalculatorForm';
import { CalculatorProvider } from './context/CalculatorContext';

const App: React.FC = () => {
  return (
    <CalculatorProvider>
      <div className="flex items-center justify-center text-gray-900">
        <div className="items-center">
          <h1 className="text-xl font-bold text-white">Loan Calculator</h1>
          <CurrencySelector />
          <CalculatorForm />
        </div>
      </div>
    </CalculatorProvider>
  );
};

export default App;