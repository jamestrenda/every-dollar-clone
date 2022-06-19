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
  handleChange?: (e?) => void;
  handleBlur?: (e?) => void;
  handleFocus?: (e?) => void;
  handleInput?: (e?) => void;
  className?: string;
  style?: object;
  placeholder?: string;
};

export const BudgetItemInput = ({
  type = 'text',
  value = '',
  align = 'left',
  name = 'budgetItem',
  handleChange = null,
  handleBlur = null,
  handleFocus = null,
  handleInput = null,
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
