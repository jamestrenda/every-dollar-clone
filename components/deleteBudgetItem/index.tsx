import { gql, useMutation } from '@apollo/client';
import React, { useContext } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { BudgetContext } from '../budgetProvider';
import { useModal } from '../modalStateProvider';
import { useSidebar } from '../sidebarStateProvider';
import { Spinner } from '../spinner';

export const DELETE_BUDGET_ITEM_MUTATION = gql`
  mutation DELETE_BUDGET_ITEM_MUTATION(
    $id: Int!
    $parentCategoryId: Int!
    $budgetId: Int!
  ) {
    deleteBudgetItem(
      id: $id
      parentCategoryId: $parentCategoryId
      budgetId: $budgetId
    ) {
      id
      parentCategoryId
    }
  }
`;

export const DeleteBudgetItem = ({ item }) => {
  const {
    ctx: { budget },
  } = useContext(BudgetContext);
  const { modal, setModal, resetModal } = useModal();
  const { setActiveItem } = useSidebar();
  const [deleteBudgetItem, { data, error, loading }] = useMutation(
    DELETE_BUDGET_ITEM_MUTATION,
    {
      variables: {
        id: item.id,
        parentCategoryId: item.parentCategoryId,
        budgetId: budget.id,
      },
    }
  );

  const handleDeleteItem = async () => {
    await deleteBudgetItem({
      update(cache) {
        cache.modify({
          id: cache.identify({
            __typename: 'Category',
            id: item?.parentCategoryId,
          }),
          fields: {
            budgetItems(existingBudgetItemRef, { readField }) {
              return existingBudgetItemRef.filter(
                (budgetItemRef) => item.id !== readField('id', budgetItemRef)
              );
            },
          },
          optimistic: true,
        });
        cache.evict({
          id: cache.identify({
            __typename: 'BudgetItem',
            id: item.id,
          }),
        });
        cache.gc();
      },
    });
    // setModal({ ...modal, visible: false });
    resetModal();
    setActiveItem(null);
  };

  const html = React.createElement('p', {
    children: (
      <>
        Are you sure you want to delete{' '}
        <span className="font-bold">{item.name}</span>?
      </>
    ),
  });

  return (
    <button
      type="button"
      onClick={(e) => {
        setModal({
          title: `Delete ${item.name}`,
          btnText: 'Yes, delete it.',
          message: html,
          visible: true,
          callback: handleDeleteItem,
          type: 'error',
        });
      }}
      disabled={loading}
      className="-ml-2 text-gray-400 hover:text-red-500 transition-colors relative"
    >
      {loading ? (
        <Spinner align="items-start" size="w-5 h-5" />
      ) : (
        <FaRegTrashAlt />
      )}
    </button>
  );
};
