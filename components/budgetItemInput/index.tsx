import { ChangeEventHandler, FocusEventHandler, FormEventHandler } from 'react';

type BudgetItemProps = {
  type?: 'text' | 'number' | 'tel' | 'email';
  value: string;
  align?:
    | 'start'
    | 'end'
    | 'left'
    | 'right'
    | 'center'
    | 'justify'
    | 'match-parent';
  name: string;
  handleChange?: ChangeEventHandler | undefined;
  handleBlur?: FocusEventHandler | undefined;
  handleFocus?: FocusEventHandler | undefined;
  handleInput?: FormEventHandler | undefined;
  className?: string;
  style?: object;
  placeholder?: string;
};

export const BudgetItemInput = ({
  type = 'text',
  value = '',
  align = 'left',
  name = 'budgetItem',
  handleChange,
  handleBlur,
  handleFocus,
  handleInput,
  className = '',
  style = {},
  placeholder = '',
}: BudgetItemProps) => {
  return (
    <input
      className={`border-none bg-transparent hover:bg-gray-50 focus:bg-gray-50 rounded-sm focus:ring-0 px-2 w-full ${className}`}
      type={type}
      name={name}
      id={name}
      placeholder={placeholder}
      value={value}
      style={{ textAlign: align, ...style }}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onInput={handleInput}
    />
  );
};
