import { useContext } from 'react';
import formatNumber from '../../lib/formatNumber';
import { BudgetContext } from '../budgetProvider';

export const BudgetOverview = () => {
  const {
    ctx: { budget },
  } = useContext(BudgetContext);

  const totalIncome = budget?.incomes?.reduce(
    (total, income) => total + income.planned,
    0
  );

  return (
    <div>
      <div className="grid place-items-center">
        <div className="font-bold text-gray-500">Planned Income</div>
        <div className="text-xl font-bold mt-2">
          ${formatNumber(totalIncome, true)}
        </div>
      </div>
    </div>
  );
};
