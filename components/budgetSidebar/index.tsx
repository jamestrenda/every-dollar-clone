import { useContext } from 'react';
import { IoEllipsisVerticalSharp } from 'react-icons/io5';
import { AiFillPlusCircle } from 'react-icons/ai';
import { ItemOverview } from '../itemOverview';
import { useSidebar } from '../sidebarStateProvider';
import { BudgetOverview } from '../budgetOverview';
import { BudgetContext } from '../budgetProvider';
import { TransactionMenu } from '../transactionMenu';
import { useTransactionMenu } from '../transactionMenuProvider';
export const BudgetSidebar = () => {
  // TODO: convert to a off canvas implemenation on mobile

  const { activeItem } = useSidebar();
  const { open } = useTransactionMenu();

  return (
    <div className="mt-6 col-span-2 lg:col-span-1 sidebar">
      <div className="sticky top-48">
        <div
          className={`bg-white transition rounded-md p-6 ${
            open ? 'opacity-0 scale-95' : 'scale-100 shadow-md'
          }`}
        >
          {activeItem ? <ItemOverview /> : <BudgetOverview />}
        </div>
        <TransactionMenu />
      </div>
    </div>
  );
};
