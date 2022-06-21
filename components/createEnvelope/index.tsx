import { gql, makeReference, useMutation } from '@apollo/client';
import React, { useContext } from 'react';
import { HiPlusSm } from 'react-icons/hi';
import { SINGLE_BUDGET_QUERY } from '../budget/queries';
import { BudgetContext } from '../budgetProvider';
import { Spinner } from '../spinner';

export const CREATE_CATEGORY_MUTATION = gql`
  mutation CREATE_CATEGORY_MUTATION($budgetId: Int!) {
    createCategory(budgetId: $budgetId) {
      id
      name
      index
      budgetId
      budgetItems {
        id
        index
        name
        plannedAmount
        transactions {
          id
          amount
          budgetItemId
        }
        parentCategory {
          id
        }
      }
    }
  }
`;

export const CreateEnvelope = ({ id }) => {
  const { ctx: categories } = useContext(BudgetContext);
  const [createCategory, { loading, error }] = useMutation(
    CREATE_CATEGORY_MUTATION,
    {
      variables: { budgetId: id },
      update(cache, { data: { createCategory } }) {
        cache.modify({
          id: cache.identify({
            __typename: 'Budget',
            id,
          }),
          fields: {
            categories(existingCategories = []) {
              const newCategoryRef = cache.writeFragment({
                data: createCategory,
                fragment: gql`
                  fragment NewCategory on Category {
                    id
                    name
                    index
                    budgetId
                    budgetItems
                  }
                `,
              });
              return [...existingCategories, newCategoryRef];
            },
          },
          optimistic: true,
        });
      },
      // onQueryUpdated(observableQuery) {
      //   // Define any custom logic for determining whether to refetch
      //   if (shouldRefetchQuery(observableQuery)) {
      //     return observableQuery.refetch();
      //   }
      // },
      // refetchQueries: [{ query: SINGLE_BUDGET_QUERY, variables: { id } }],
      // optimisticResponse: {
      //   createCategory: {
      //     __typename: 'Category',
      //     id: 0,
      //     name: 'Untitled',
      //     index: categories?.length,
      //     budgetId: id,
      //     budgetItems: [],
      //   },
      // },
    }
  );

  const handleAddEnvelope = async () => {
    await createCategory();
  };

  return (
    <button
      type="button"
      onClick={handleAddEnvelope}
      className="relative flex items-center p-6 border border-dotted border-gray-300 rounded-md cursor-pointer text-gray-500 hover:text-indigo-500 hover:bg-white transition-all"
    >
      {loading ? (
        <>
          <Spinner
            align="items-start"
            className="text-indigo-500 ml-4"
            size="w-5 h-5"
          />{' '}
          <span className="ml-6">Adding Envelope...</span>
        </>
      ) : (
        <>
          <HiPlusSm className="h-5 w-5 mr-2" />
          <span className="uppercase font-bold">Add Envelope</span>
        </>
      )}
    </button>
  );
};
