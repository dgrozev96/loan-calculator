import React from 'react';

interface RepaymentDetailsProps {
  totalInterest: number;
  totalRepayment: number;
  hasError: (field: string) => boolean;
  formatter: Intl.NumberFormat;
}

const RepaymentDetails: React.FC<RepaymentDetailsProps> = ({
                                                             totalInterest,
                                                             totalRepayment,
                                                             hasError,
                                                             formatter,
                                                           }) => (
  <div className="mb-4">
    <p className="text-gray-900">
      Total Interest:{' '}
      {hasError('loanAmount') || hasError('annualInterestRate') || hasError('loanTerm')
        ? '-'
        : formatter.format(totalInterest)}
    </p>
    <p className="text-gray-900">
      Total Repayment:{' '}
      {hasError('loanAmount') || hasError('annualInterestRate') || hasError('loanTerm')
        ? '-'
        : formatter.format(totalRepayment)}
    </p>
  </div>
);

export default RepaymentDetails;