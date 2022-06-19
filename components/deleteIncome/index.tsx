import { gql, useMutation } from '@apollo/client';
import React, { useContext } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { BudgetContext } from '../budgetProvider';
import { useModal } from '../modalStateProvider';
import { Spinner } from '../spinner';

export const DELETE_INCOME_MUTATION = gql`
  mutation DELETE_INCOME_MUTATION($id: Int!, $budgetId: Int!) {
    deleteIncome(id: $id, budgetId: $budgetId) {
      id
      budgetId
    }
  }
`;

export const DeleteIncome = ({ income }) => {
  const {
    ctx: { budget },
  } = useContext(BudgetContext);
  const { modal, setModal, resetModal } = useModal();
  const [deleteIncome, { data, error, loading }] = useMutation(
    DELETE_INCOME_MUTATION,
    { variables: { id: income.id, budgetId: budget.id } }
  );

  const handleDeleteItem = async () => {
    await deleteIncome({
      update(cache) {
        cache.modify({
          id: cache.identify({
            __typename: 'Budget',
            id: budget.id,
          }),
          fields: {
            incomes(existingIncomeRef, { readField }) {
              return existingIncomeRef.filter(
                (incomeRef) => income?.id !== readField('id', incomeRef)
              );
            },
          },
          optimistic: true,
        });
        cache.evict({
          id: cache.identify({
            __typename: 'Income',
            id: income.id,
          }),
        });
        cache.gc();
      },
    });
    // setModal({ ...modal, visible: false });
    resetModal();
  };

  const html = React.createElement('p', {
    children: (
      <>
        Are you sure you want to delete{' '}
        <span className="font-bold">{income.source}</span>?
      </>
    ),
  });

  return (
    <button
      type="button"
      onClick={() => {
        setModal({
          title: `Delete ${income.source}`,
          btnText: `Yes, delete ${income.source}.`,
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
