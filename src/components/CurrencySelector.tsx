import React from 'react';

interface CurrencySelectorProps {
  currency: string;
  setCurrency: (currency: string) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ currency, setCurrency }) => (
  <div className="flex gap-2 items-center justify-center my-2">
    <label htmlFor="currency" className="text-sm font-medium text-white">
      Select Currency
    </label>
    <select
      id="currency"
      value={currency}
      onChange={e => setCurrency(e.target.value)}
      className="p-2 border rounded-md max-w-xs text-gray-400"
    >
      <option value="USD">USD</option>
      <option value="EUR">EUR</option>
      <option value="BGN">BGN</option>
    </select>
  </div>
);

export default CurrencySelector;