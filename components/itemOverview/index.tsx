import { gql, useMutation } from '@apollo/client';
import { useContext, useEffect, useState } from 'react';
import { IoBookmark, IoBookmarkOutline } from 'react-icons/io5';
import formatNumber from '../../lib/formatNumber';
import { AddTransactionButton } from '../addTransactionButton';
import { UPDATE_BUDGET_ITEM_MUTATION } from '../budgetItem/mutations';
import { BudgetItemInput } from '../budgetItemInput';
import { BudgetContext } from '../budgetProvider';
import { useModal } from '../modalStateProvider';
import { UPDATE_INCOME_MUTATION } from '../paycheck';
import { Progress } from '../progress';
import { useSidebar } from '../sidebarStateProvider';
import { TransactionItem } from '../transactionItem';

export const CREATE_FAVORITE_MUTATION = gql`
  mutation CREATE_FAVORITE_MUTATION($budgetItemId: Int!, $budgetId: Int!) {
    createFavorite(budgetId: $budgetId, budgetItemId: $budgetItemId) {
      id
    }
  }
`;

export const DELETE_FAVORITE_MUTATION = gql`
  mutation DELETE_FAVORITE_MUTATION($id: String!, $budgetItemId: Int!) {
    deleteFavorite(id: $id, budgetItemId: $budgetItemId) {
      id
    }
  }
`;

export const ItemOverview = () => {
  const {
    ctx: { budget },
  } = useContext(BudgetContext);

  const { activeItem, setActiveItem } = useSidebar();
  const { modal, setModal, resetModal } = useModal();

  const handleKeyDown = (e) => {
    const { key } = e;
    if (key) {
      const isEscape = key === 'Escape' || key === 'Esc';
      if (isEscape) {
        if (modal.visible) {
          resetModal();
        } else {
          setActiveItem(null);
        }
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  const { id, transactions, isFavorite, note } = activeItem;
  const name = activeItem.name || activeItem.source;
  const planned = activeItem.planned || activeItem.plannedAmount;
  const parent = activeItem.parentCategory?.name || 'Income';
  const type = activeItem.__typename;
  const isBudgetItem = type === 'BudgetItem';
  const isIncome = type === 'Income';

  const [noteValue, setNoteValue] = useState();

  const noteName = `note-${isIncome ? 'income-' : 'budgetItem-'}${
    activeItem?.id
  }${isBudgetItem ? `-parentCategory-${activeItem?.parentCategory?.id}` : ''}`;

  function handleChange(e) {
    let { value } = e.target;

    setNoteValue(value);
  }

  const activeTransactions = transactions?.filter(
    (transactionItem) => transactionItem.transaction.active
  );

  const transactionsTotal = activeTransactions?.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );

  const budgetItemTransactionTotal =
    type === 'BudgetItem'
      ? activeTransactions?.reduce(
          (total, transaction) => total + transaction.amount,
          0
        )
      : 0;

  const progress = (transactionsTotal / planned) * 100 || 0;
  const budgetItemProgress =
    ((planned - budgetItemTransactionTotal) / planned) * 100 || 100;

  const titles = {
    income: 'Planned',
    budgetitem: 'Remaining',
    debt: 'Balance',
  };

  const [updateBudgetItem, { data, loading, error }] = useMutation(
    UPDATE_BUDGET_ITEM_MUTATION
  );

  const [
    updateIncome,
    { data: incomeData, loading: incomeLoading, error: incomeError },
  ] = useMutation(UPDATE_INCOME_MUTATION);

  const [createFavorite] = useMutation(CREATE_FAVORITE_MUTATION, {
    variables: { budgetItemId: id, budgetId: budget.id },
  });

  const [deleteFavorite] = useMutation(DELETE_FAVORITE_MUTATION, {
    variables: { id: activeItem?.favorite?.id, budgetItemId: id },
  });

  const handleToggleFavorite = async () => {
    if (!activeItem?.isFavorite) {
      await createFavorite({
        update(cache, { data: { createFavorite } }) {
          cache.modify({
            id: cache.identify({
              __typename: 'Budget',
              id: budget.id,
            }),
            fields: {
              favorites(existingFavorites = []) {
                const newFavoriteRef = cache.writeFragment({
                  data: createFavorite,
                  fragment: gql`
                    fragment NewFavorite on Favorite {
                      id
                      budgetItem
                    }
                  `,
                });
                return [...existingFavorites, newFavoriteRef];
              },
            },
            optimistic: true,
          });
        },
      });
    } else {
      await deleteFavorite({
        variables: {
          id: activeItem?.favorite?.id,
          budgetItemId: id,
        },
        update(cache) {
          cache.modify({
            id: cache.identify({
              __typename: 'Budget',
              id: budget.id,
            }),
            fields: {
              favorites(existingFavoriteRef, { readField }) {
                return existingFavoriteRef.filter(
                  (favoriteRef) =>
                    activeItem.favorite?.id !== readField('id', favoriteRef)
                );
              },
            },
            optimistic: true,
          });
        },
      });
    }
  };

  const handleBlur = async (newValue, oldValue) => {
    if (oldValue === newValue) return;

    if (isBudgetItem) {
      await updateBudgetItem({
        variables: {
          id,
          note: newValue,
        },
      });
    }
    if (isIncome) {
      await updateIncome({
        variables: {
          id,
          note: newValue,
        },
      });
    }
  };

  useEffect(() => {
    setNoteValue(note);
  }, [activeItem]);

  return (
    <div className="sidebar__itemOverview">
      <div className="flex justify-between">
        <div className="flex items-center text-gray-400 text-sm font-bold">
          <button
            type="button"
            className="mr-2 group"
            // onClick={handleToggleFavorite}
          >
            {isFavorite ? (
              <IoBookmark className="h-5 w-5 text-indigo-500" />
            ) : (
              <>
                <IoBookmarkOutline className={`h-5 w-5 group-hover:hidden`} />
                <IoBookmark
                  className={`h-5 w-5 text-indigo-500 hidden group-hover:block`}
                />
              </>
            )}
          </button>
          {parent}
        </div>
        <div className="text-gray-400 text-sm">
          {titles[type?.toLowerCase()]}
        </div>
      </div>
      <div className="mt-2 flex justify-between text-lg font-bold my-2">
        <div className=" ">{name}</div>
        <div>
          $
          {formatNumber(
            isBudgetItem ? budgetItemTransactionTotal || planned : planned || 0,
            true
          )}
        </div>
      </div>
      <div className="mb-4">
        <span className="text-green-400 font-bold mr-1">
          $
          {formatNumber(
            isBudgetItem ? budgetItemTransactionTotal : transactionsTotal || 0,
            true
          )}
        </span>
        <span>{isBudgetItem ? 'spent' : 'received'}</span>
      </div>
      <div>
        <Progress
          sidebar
          value={isBudgetItem ? budgetItemProgress : progress}
        />
      </div>
      <div>
        <BudgetItemInput
          className="bg-gray-50 mt-4"
          style={{ backgroundColor: '#f5f5f5' }}
          name={noteName}
          value={noteValue || ''}
          placeholder="Add a note"
          handleChange={handleChange}
          handleBlur={() => handleBlur(noteValue, note)}
        />
      </div>
      <div className="flex justify-between mt-4 items-center">
        <div className="text-base font-bold text-gray-500">
          {activeTransactions?.length} Transaction
          {activeTransactions?.length === 1 ? '' : 's'}
        </div>
        <div>
          <AddTransactionButton
            context={{ budget }}
            className="flex items-center"
            small
          >
            Add New
          </AddTransactionButton>
        </div>
      </div>
      {activeTransactions?.length ? (
        <div className="border-t border-gray-300">
          {activeTransactions?.map((transactionItem, index) => (
            <TransactionItem key={index} item={transactionItem} />
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
