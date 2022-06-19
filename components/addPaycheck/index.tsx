import { gql, useMutation } from '@apollo/client';
import { useContext } from 'react';
import { BudgetContext } from '../budgetProvider';
import { Spinner } from '../spinner';

export const CREATE_INCOME_MUTATION = gql`
  mutation CREATE_INCOME_MUTATION($index: Int!, $budgetId: Int!) {
    createIncome(index: $index, budgetId: $budgetId) {
      id
      index
      source
      planned
    }
  }
`;

export const AddPaycheck = ({ children }) => {
  const {
    ctx: { budget },
  } = useContext(BudgetContext);

  // item template
  const newItem = {
    index: budget?.incomes?.length || 0,
    budgetId: budget?.id,
  };
  const [createIncome, { data, error, loading }] = useMutation(
    CREATE_INCOME_MUTATION,
    { variables: newItem }
  );

  const handleAddItem = async () => {
    await createIncome({
      update(cache, { data: { createIncome } }) {
        cache.modify({
          id: cache.identify({
            __typename: 'Budget',
            id: budget.id,
          }),
          fields: {
            incomes(existingIncomes = []) {
              const newIncomeRef = cache.writeFragment({
                data: createIncome,
                fragment: gql`
                  fragment NewIncome on Income {
                    id
                    index
                    source
                    planned
                  }
                `,
              });
              return [...existingIncomes, newIncomeRef];
            },
          },
          optimistic: true,
        });
      },
    });
  };

  return (
    <button
      onClick={handleAddItem}
      className="flex text-sm text-indigo-500 relative"
      type="button"
      disabled={loading}
    >
      {loading ? <Spinner align="items-start" size="w-5 h-5" /> : children}
    </button>
  );
};
