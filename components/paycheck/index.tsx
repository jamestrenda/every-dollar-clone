import React, { useState, useContext, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import formatNumber from '../../lib/formatNumber';
import useForm from '../../lib/useForm';
import { BudgetItemDecimalInput } from '../budgetItemDecimalInput';
import { BudgetItemInput } from '../budgetItemInput';
import { DragHandle } from '../dragHandle';
import { Progress } from '../progress';
import { StyledBudgetItem } from '../budgetItem/styles';
import { DeleteIncome } from '../deleteIncome';
import { BudgetContext } from '../budgetProvider';
import { useSidebar } from '../sidebarStateProvider';
import { IncomingMessage } from 'http';

export const UPDATE_INCOME_MUTATION = gql`
  mutation (
    $id: Int!
    $index: Int
    $source: String
    $planned: Int
    $note: String
  ) {
    updateIncome(
      id: $id
      index: $index
      source: $source
      planned: $planned
      note: $note
    ) {
      id
      index
      source
      planned
      note
      transactions {
        id
      }
    }
  }
`;

export const Paycheck = ({
  income,
  isDragging = false,
  dragHandleProps = {},
}) => {
  const { activeItem, setActiveItem } = useSidebar();
  const [updateIncome, { data, loading, error }] = useMutation(
    UPDATE_INCOME_MUTATION
  );
  const { inputs, handleChange, handleNumberChange } = useForm({
    [`incomeSource-${income.id}`]: income.source,
    [`incomeSource-${income.id}-plannedAmount`]: income.planned,
  });

  const [amountRecieved, setAmountReceived] = useState(0);

  const handleFocus = (e) => {
    e.stopPropagation();

    if (activeItem) {
      if (
        activeItem.id === income.id &&
        income.__typename === activeItem.__typename
      ) {
        return;
      }
    }
    setActiveItem(income);
  };
  const handleBlur = async (newValue, oldValue) => {
    if (oldValue === newValue) return;
    await updateIncome({
      variables: {
        id: income.id,
        source: inputs[`incomeSource-${income.id}`],
        planned: inputs[`incomeSource-${income.id}-plannedAmount`],
      },
    });
  };

  useEffect(() => {
    const transactions = income.transactions?.filter(
      (transaction) => transaction.transaction.active && transaction
    );
    const total = transactions.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );
    setAmountReceived(total);
  }, [income]);
  return (
    <StyledBudgetItem
      className={`relative px-6 ${
        isDragging ? 'bg-gray-100 drop-shadow-md rounded-md' : ''
      }  ${
        activeItem?.id === income.id &&
        income.__typename === activeItem?.__typename
          ? 'has-focus'
          : ''
      }`}
    >
      <div onClick={handleFocus} className="group">
        <span
          {...dragHandleProps}
          tabIndex={-1}
          className={`absolute top-1/2 -translate-y-1/2 left-0 grid place-items-center transition-opacity cursor-move ${
            activeItem?.id === income.id &&
            income.__typename === activeItem?.__typename
              ? 'opacity-100'
              : 'opacity-0'
          } group-hover:opacity-100`}
        >
          {activeItem?.id !== income.id ||
          income.__typename !== activeItem?.__typename ? (
            <DragHandle />
          ) : (
            <DeleteIncome income={income} />
          )}
        </span>

        <div className="grid grid-cols-4 py-2">
          <span className="col-span-2 text-base -ml-2">
            <BudgetItemInput
              name={`incomeSource-${income.id}`}
              value={inputs[`incomeSource-${income.id}`]}
              handleChange={handleChange}
              handleFocus={handleFocus}
              handleBlur={() =>
                handleBlur(income.source, inputs[`incomeSource-${income.id}`])
              }
            />
          </span>
          <span className="text-right">
            <BudgetItemDecimalInput
              name={`incomeSource-${income.id}-plannedAmount`}
              value={inputs[`incomeSource-${income.id}-plannedAmount`]}
              align="right"
              handleChange={handleNumberChange}
              handleFocus={handleFocus}
              handleBlur={() =>
                handleBlur(
                  income.planned,
                  inputs[`incomeSource-${income.id}-plannedAmount`]
                )
              }
            />
          </span>
          <span className="text-right grid items-center">
            ${formatNumber(amountRecieved)}
          </span>
        </div>
        {!isDragging && (
          <Progress
            style={{
              display:
                activeItem?.id === income.id &&
                income.__typename === activeItem?.__typename
                  ? 'none'
                  : 'block',
            }}
            value={
              (amountRecieved /
                inputs[`incomeSource-${income.id}-plannedAmount`]) *
                100 || 0
            }
          />
        )}
      </div>
    </StyledBudgetItem>
  );
};
