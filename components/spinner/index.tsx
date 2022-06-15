import { CgSpinner } from 'react-icons/cg';

type SpinnerProps = {
  align?: string; // tailwind css class name
  size?: string; // tailwind css class name
  className?: string; // tailwind css class name
};

export const Spinner = ({
  align = null,
  size = null,
  className = '',
}: SpinnerProps) => {
  return (
    <div className={`grid ${align || 'place-items-center'}`}>
      <CgSpinner
        className={`animate-[spin_500ms_linear_infinite] ${
          size || 'h-6 w-6'
        } ${className}`}
      />
    </div>
  );
};
