import { gql, useMutation } from '@apollo/client';
import React, { useContext, useEffect, useState } from 'react';
import formatNumber from '../../lib/formatNumber';
import useForm from '../../lib/useForm';
import { BudgetItemDecimalInput } from '../budgetItemDecimalInput';
import { BudgetItemInput } from '../budgetItemInput';
import { BudgetContext } from '../budgetProvider';
import { DragHandle } from '../dragHandle';
import { Progress } from '../progress';
import { FaRegTrashAlt } from 'react-icons/fa';
import { DeleteBudgetItem } from '../deleteBudgetItem';
import { useSidebar } from '../sidebarStateProvider';
import { useTransactionMenu } from '../transactionMenuProvider';
import { UPDATE_BUDGET_ITEM_MUTATION } from './mutations';
import { StyledBudgetItem } from './styles';

export const BudgetItem = ({
  item,
  dragHandleProps = {},
  isDragging = false,
}) => {
  const { activeItem, setActiveItem } = useSidebar();
  const { closeMenu } = useTransactionMenu();
  const [updateBudgetItem, { data, loading, error }] = useMutation(
    UPDATE_BUDGET_ITEM_MUTATION
  );
  const { inputs, handleChange, handleNumberChange } = useForm({
    [`budgetItemName-${item.id}-parentCategory-${item.parentCategory.id}`]:
      item.name,
    [`budgetItemAmount-${item.id}-parentCategory-${item.parentCategory.id}`]:
      item.plannedAmount,
  });

  const {
    ctx: { showSpent, toggleSpent },
  } = useContext(BudgetContext);

  const handleFocus = (e) => {
    e.stopPropagation();

    if (activeItem) {
      if (
        item.id === activeItem.id &&
        item.__typename === activeItem.__typename
      ) {
        return;
      }
    }
    setActiveItem(item);
    closeMenu();
  };

  const [spent, setSpent] = useState(0);
  const [remaining, setRemaining] = useState(0);

  const handleBlur = async (newValue, oldValue) => {
    if (oldValue === newValue) return;

    await updateBudgetItem({
      variables: {
        id: item.id,
        name: inputs[
          `budgetItemName-${item.id}-parentCategory-${item.parentCategory.id}`
        ],
        plannedAmount:
          inputs[
            `budgetItemAmount-${item.id}-parentCategory-${item.parentCategory.id}`
          ],
      },
    });
  };
  useEffect(() => {
    const transactions = item.transactions?.filter(
      (transaction) => transaction.transaction.active && transaction
    );

    const total = transactions.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );
    setSpent(total);
    setRemaining(item.plannedAmount - total);
  }, [item]);

  return (
    <StyledBudgetItem
      className={`bg-white relative px-6 text-sm md:text-base ${
        isDragging ? 'bg-gray-100 drop-shadow-md rounded-md' : ''
      } ${
        activeItem?.id === item.id && item.__typename === activeItem?.__typename
          ? 'has-focus'
          : ''
      }`}
    >
      <div onClick={handleFocus} className="group">
        <span
          {...dragHandleProps}
          tabIndex={-1}
          className={`absolute top-1/2 -translate-y-1/2 left-0 grid place-items-center transition-opacity cursor-move ${
            activeItem?.id === item.id &&
            item.__typename === activeItem?.__typename
              ? 'opacity-100'
              : 'opacity-0'
          } group-hover:opacity-100`}
        >
          {activeItem?.id !== item.id ||
          item.__typename !== activeItem?.__typename ? (
            <DragHandle />
          ) : (
            <DeleteBudgetItem item={item} />
          )}
        </span>
        <div className={`grid grid-cols-4 py-2`}>
          <span className="col-span-2 text-base -ml-2">
            <BudgetItemInput
              name={`budgetItemName-${item.id}-parentCategory-${item.parentCategory.id}`}
              value={
                inputs[
                  `budgetItemName-${item.id}-parentCategory-${item.parentCategory.id}`
                ]
              }
              handleFocus={handleFocus}
              handleChange={handleChange}
              handleBlur={() =>
                handleBlur(
                  item.name,
                  inputs[
                    `budgetItemName-${item.id}-parentCategory-${item.parentCategory.id}`
                  ]
                )
              }
            />
          </span>
          <span className="text-right">
            <BudgetItemDecimalInput
              name={`budgetItemAmount-${item.id}-parentCategory-${item.parentCategory.id}`}
              value={
                inputs[
                  `budgetItemAmount-${item.id}-parentCategory-${item.parentCategory.id}`
                ]
              }
              handleFocus={handleFocus}
              handleChange={handleNumberChange}
              align="right"
              handleBlur={() =>
                handleBlur(
                  item.plannedAmount,
                  inputs[
                    `budgetItemAmount-${item.id}-parentCategory-${item.parentCategory.id}`
                  ]
                )
              }
            />
          </span>
          <span
            className={`text-right grid items-center cursor-default ${
              showSpent && spent <= item.plannedAmount ? 'text-green-400' : ''
            } ${spent > item.plannedAmount ? '!text-red-400' : ''}`}
            onClick={toggleSpent}
          >
            ${formatNumber(showSpent ? spent : remaining)}
          </span>
        </div>
        {!isDragging && (
          <Progress
            style={{
              display:
                activeItem?.id === item.id &&
                item.__typename === activeItem?.__typename
                  ? 'none'
                  : 'block',
            }}
            negative={spent > item.plannedAmount}
            value={
              (spent /
                inputs[
                  `budgetItemAmount-${item.id}-parentCategory-${item.parentCategory.id}`
                ]) *
                100 || 0
            }
          />
        )}
      </div>
    </StyledBudgetItem>
  );
};
