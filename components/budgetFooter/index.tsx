import { CgUndo } from 'react-icons/cg';
import { IoShareOutline } from 'react-icons/io5';

export const BudgetFooter = () => {
  // handleBudgetReset
  // show modal first

  return (
    <div className="grid grid-cols-2 py-6">
      <div className="flex items-center text-sm text-red-500">
        <CgUndo className="h-5 w-5 mr-1" />
        <button type="button">Reset Budget</button>
      </div>
      <div className="flex items-center justify-self-end text-sm text-indigo-500">
        <IoShareOutline className="h-5 w-5 mr-1" />
        <button type="button">Export CSV</button>
      </div>
    </div>
  );
};
