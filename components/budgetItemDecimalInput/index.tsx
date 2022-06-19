import React from 'react';
import DecimalInput from '../inputs/decimal';

export const BudgetItemDecimalInput = ({
  name = 'budgetItem',
  value = 0,
  align = null,
  handleChange = null,
  handleBlur = null,
  handleFocus = null,
  className = '',
}) => {
  return (
    <DecimalInput
      className={`border-none bg-transparent hover:bg-gray-50 rounded-sm focus:ring-0 px-2 w-full ${className}`}
      name={name}
      placeholder={'0.00'}
      onFocus={handleFocus}
      onValueChange={handleChange}
      onBlur={handleBlur}
      value={value}
      style={{ textAlign: align ? align : 'left' }}
    />
  );
};
