import React, { ChangeEventHandler, FocusEventHandler } from 'react';
import DecimalInput from '../inputs/decimal';

type BudgetItemDecimalProps = {
  value: number;
  align?:
    | 'start'
    | 'end'
    | 'left'
    | 'right'
    | 'center'
    | 'justify'
    | 'match-parent';
  name: string;
  handleChange?:
    | ChangeEventHandler
    | ((value: any, target: any) => void)
    | undefined;
  handleBlur?: FocusEventHandler | (() => void) | undefined;
  handleFocus?: FocusEventHandler | (() => void) | undefined;
  className?: string;
  placeholder?: string;
};

export const BudgetItemDecimalInput = ({
  name = 'budgetItem',
  value = 0,
  align,
  handleChange,
  handleBlur,
  handleFocus,
  placeholder = '0.00',
  className = '',
}: BudgetItemDecimalProps) => {
  return (
    <DecimalInput
      className={`text-sm md:text-base border-none bg-transparent hover:bg-gray-50 rounded-sm focus:ring-0 px-2 w-full ${className}`}
      name={name}
      placeholder={placeholder}
      onFocus={handleFocus}
      onValueChange={handleChange}
      onBlur={handleBlur}
      value={value}
      style={{ textAlign: align ? align : 'left' }}
    />
  );
};
