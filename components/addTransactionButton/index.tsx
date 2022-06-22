import { ReactNode } from 'react';
import { BsFillPlusCircleFill } from 'react-icons/bs';
import { useModal } from '../modalStateProvider';

type AddTransactionButtonProps = {
  item?: {};
  small?: boolean;
  children?: ReactNode;
  className?: string;
  context?: {};
};

export const AddTransactionButton = ({
  item = null,
  small = null,
  children = null,
  className = null,
  context,
}: AddTransactionButtonProps) => {
  const { setModal } = useModal();
  const blankItem = {
    amount: 0,
    budgetItem: null,
    budgetItemId: null,
    id: 0,
  };
  // const blankItem = {
  //   key: '',
  //   name: '',
  //   budgetItemId: null,
  //   categoryId: null,
  //   amount: 0,
  //   incomeId: null,
  //   debtId: null,
  // };
  // console.log('from add transaction button:', { item });
  return (
    <button
      className={`${className ? className : ''} group`}
      onClick={() =>
        setModal({
          visible: true,
          action: 'Add',
          type: 'transaction',
          context,
        })
      }
    >
      <BsFillPlusCircleFill
        className={`${
          small ? 'h-5 w-5' : 'h-10 w-10'
        } text-indigo-500 transition ring-indigo-300 rounded-full group-hover:ring bg-white`}
      />
      <span className="ml-2 uppercase font-bold text-xs">{children}</span>
    </button>
  );
};
