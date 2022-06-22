import { gql, useMutation } from '@apollo/client';
import { format, parseISO } from 'date-fns';
import { useContext } from 'react';
import { CgUndo } from 'react-icons/cg';
import { IoShareOutline } from 'react-icons/io5';
import notLiveNotice from '../../lib/notLiveNotice';
import { SINGLE_BUDGET_QUERY } from '../budget/queries';
import { BudgetContext } from '../budgetProvider';
import { useModal } from '../modalStateProvider';
import { Spinner } from '../spinner';

const RESET_BUDGET_MUTATION = gql`
  mutation RESET_BUDGET_MUTATION($id: Int!) {
    resetBudget(id: $id) {
      id
    }
  }
`;

export const BudgetFooter = () => {
  const {
    ctx: { budget },
  } = useContext(BudgetContext);

  const [resetBudget, { data, loading, error }] = useMutation(
    RESET_BUDGET_MUTATION,
    {
      variables: {
        id: budget?.id,
      },
      refetchQueries: [
        { query: SINGLE_BUDGET_QUERY, variables: { id: budget.id } },
      ],
    }
  );

  const { setModal } = useModal();

  const handleBudgetRest = async (id) => {
    const budgetMonth = format(parseISO(budget.createdAt), 'MMMM');

    setModal({
      title: `Reset ${budgetMonth} Budget`,
      btnText: 'Yes, reset it.',
      message: (
        <div>
          <p className="font-medium text-gray-900 !text-lg">
            Wait! Are you sure? This cannot be undone.
          </p>
          <p>
            Your envelopes <em>will not</em> be shredded, but they will be
            emptied of all amounts and transactions. All of your active
            transactions will become un-tracked and moved under the 'New' tab in
            the main transaction menu.
          </p>
          <p className="font-bold">
            NOTE: If you want to start completely over, you will need to delete
            this budget first and then create a new budget for {budgetMonth}.
          </p>
        </div>
      ),
      visible: true,
      callback: resetBudget,
      type: 'error',
      icon: <CgUndo className="h-5 w-5 text-red-500" />,
    });
  };

  return (
    <div className="grid grid-cols-2 py-6">
      <div className="flex items-center text-sm text-red-500">
        <CgUndo className="h-5 w-5 mr-1" />
        <button type="button" onClick={() => handleBudgetRest(budget.id)}>
          Reset Budget
        </button>
      </div>
      <div className="flex items-center justify-self-end text-sm text-indigo-500">
        <IoShareOutline className="h-5 w-5 mr-1" />
        <button type="button" onClick={() => notLiveNotice()}>
          Export CSV
        </button>
      </div>
    </div>
  );
};
