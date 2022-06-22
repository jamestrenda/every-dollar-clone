import { gql, useMutation } from '@apollo/client';
import { Spinner } from '../spinner';

export const CREATE_BUDGET_ITEM_MUTATION = gql`
  mutation CREATE_BUDGET_ITEM_MUTATION($index: Int!, $parentCategoryId: Int!) {
    createBudgetItem(index: $index, parentCategoryId: $parentCategoryId) {
      id
      index
      name
      plannedAmount
      parentCategoryId
      parentCategory {
        id
      }
    }
  }
`;

export const AddBudgetItem = ({ parentEnvelope = null, children }) => {
  // item template
  const newItem = {
    id: 0,
    index: parentEnvelope?.budgetItems?.length,
    parentCategoryId: parentEnvelope?.id,
  };
  const [createBudgetItem, { data, error, loading }] = useMutation(
    CREATE_BUDGET_ITEM_MUTATION,
    { variables: newItem }
  );

  const handleAddItem = async () => {
    await createBudgetItem({
      update(cache, { data: { createBudgetItem } }) {
        cache.modify({
          id: cache.identify({
            __typename: 'Category',
            id: parentEnvelope.id,
          }),
          fields: {
            budgetItems(existingBudgetItems = []) {
              const newBudgetItemRef = cache.writeFragment({
                data: createBudgetItem,
                fragment: gql`
                  fragment NewBudgetItem on BudgetItem {
                    id
                    index
                    name
                    plannedAmount
                    parentCategoryId
                    parentCategory
                  }
                `,
              });
              return [...existingBudgetItems, newBudgetItemRef];
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
