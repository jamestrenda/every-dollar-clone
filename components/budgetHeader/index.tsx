import React, { useContext, useEffect, useState } from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';
import {
  FaEnvelope,
  FaFolder,
  FaRegEnvelopeOpen,
  FaRegTrashAlt,
} from 'react-icons/fa';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { GrTransaction } from 'react-icons/gr';
import formatNumber from '../../lib/formatNumber';
import { BudgetContext } from '../budgetProvider';
// import { ToolTip } from '../toolTip';
import { useTransactionMenu } from '../transactionMenuProvider';
import { useSidebar } from '../sidebarStateProvider';
import { StyledEllipseButton, StyledTransactionsToggleButton } from './styles';
import { useMutation } from '@apollo/client';
import { DELETE_BUDGET_MUTATION } from './mutations';
import { Button } from '../button';
import { formatDate } from '../../lib/formatDate';
import { useModal } from '../modalStateProvider';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export const BudgetHeader = () => {
  const {
    ctx: {
      categories,
      closedEnvelopes,
      setClosedEnvelopes,
      budget,
      setEveryDollarBudget,
    },
  } = useContext(BudgetContext);
  const { setActiveItem } = useSidebar();
  const { setModal } = useModal();
  const { push } = useRouter();
  const {
    data: { session },
  } = useSession();
  // TODO: set up for next two months
  // TODO: have a "dream" budget option as well

  const [dates, setDates] = useState();
  const [dateFocused, setDateFocused] = useState(false); // for react-dates date picker

  const [openUtilityMenu, setOpenUtilityMenu] = useState(false); // for react-dates date picker

  const { toggleTransactionMenu } = useTransactionMenu();

  const [
    deleteBudget,
    { loading: deleteBudgetLoading, error: deleteBudgetError },
  ] = useMutation(DELETE_BUDGET_MUTATION);

  const handleDeleteBudget = async (id) => {
    const res = await deleteBudget({
      variables: { id },
      update(cache) {
        cache.modify({
          id: cache.identify({
            __typename: 'User',
            id: session?.user.id,
          }),
          fields: {
            budgets(existingBudgetRef, { readField }) {
              return existingBudgetRef.filter(
                (budgetRef) => id !== readField('id', budgetRef)
              );
            },
          },
          optimistic: true,
        });
        cache.evict({
          id: cache.identify({
            __typename: 'Budget',
            id: id,
          }),
        });
        cache.gc();
      },
    });
  };

  const toggleEnvelopes = () => {
    // setOpenEnvelopes(!openEnvelopes);
    if (closedEnvelopes?.length === categories?.length + 1) {
      // all envelopes are currently closed
      // then open them all up
      setClosedEnvelopes([]);
    } else {
      const categoryIDs = categories?.map((cat) => cat.id);
      setClosedEnvelopes([0, ...categoryIDs]);
      setActiveItem(null);
    }
  };

  const toggleUtilityMenu = () => {
    setOpenUtilityMenu(!openUtilityMenu);
  };

  const totalPlanned =
    budget?.incomes?.reduce((total, t) => total + t.planned, 0) || 0;

  const totalBudgeted =
    budget?.categories?.reduce(
      (envelopeTotal, e) =>
        envelopeTotal +
        e.budgetItems.reduce(
          (budgetItemTotal, budgetItem) =>
            budgetItemTotal + budgetItem.plannedAmount,
          0
        ),
      0
    ) || 0;

  const everyDollar = totalPlanned && totalPlanned === totalBudgeted;

  useEffect(() => {
    if (everyDollar) {
      setEveryDollarBudget(true);
    } else {
      setEveryDollarBudget(false);
    }
  }, [everyDollar]);

  return (
    <div className="budgetHeader sticky top-0 pt-0 pb-3 md:py-6 bg-gray-50 w-full border-b border-gray-300 z-50">
      <span className="block absolute top-0 bottom-0 bg-gray-50 w-6 -left-6"></span>
      <div className="grid grid-cols-3">
        <div className="col-span-2">
          <h2 className="text-3xl mb-0 md:mb-6">
            <span className="hidden md:block">[BUDGET PICKER GOES HERE]</span>
            <span className="md:hidden text-indigo-500">
              <button type="button">
                <FaFolder />
              </button>
            </span>
          </h2>
          {everyDollar ? (
            <p className="text-green-400 font-bold">
              It's an EveryDollar Budget!
            </p>
          ) : (
            <>
              <p className={`text-sm md:text-lg text-gray-500`}>
                <span className="font-bold text-black">
                  ${formatNumber(totalPlanned - totalBudgeted)}
                </span>{' '}
                left to budget
              </p>
              <p className="text-sm italic hidden md:block">
                Total Planned Income - Total Budgeted Envelopes
              </p>
            </>
          )}
        </div>
        <div className="sticky top-0 bg-gray-50 p-6 pr-0 pt-0 pb-0 md:pb-6">
          <ul className="flex items-center justify-end">
            <li className="grid place-items-center">
              <button
                type="button"
                className="p-3"
                onClick={toggleEnvelopes}
                title={`${
                  closedEnvelopes.length < categories.length + 1
                    ? 'Close'
                    : 'Open'
                } All Envelopes`}
              >
                {closedEnvelopes.length < categories.length + 1 ? (
                  <FaRegEnvelopeOpen className="h-5 w-7" />
                ) : (
                  <FaEnvelope className="h-5 w-7 text-indigo-500" />
                )}
              </button>
            </li>
            <li className="grid place-items-center">
              <StyledTransactionsToggleButton
                type="button"
                className="p-3 transition"
                title="View Transactions"
                onClick={toggleTransactionMenu}
              >
                <GrTransaction className="h-5 w-7 " />
                {/* <ToolTip tip="Show Transactions" position="bottom" /> */}
              </StyledTransactionsToggleButton>
            </li>
            <li className="grid place-items-center relative">
              <StyledEllipseButton
                type="button"
                className="p-3 group transition"
                onClick={toggleUtilityMenu}
              >
                <IoEllipsisHorizontal className="h-6 w-7 group-hover:text-indigo-500" />
              </StyledEllipseButton>
              <div
                className={`${
                  openUtilityMenu ? '' : 'opacity-0'
                } absolute top-full shadow-md bg-white rounded-md transition-all right-0 mt-4`}
              >
                <div className="flex items-center p-4 text-red-500 whitespace-nowrap transition-all hover:rounded-md hover:bg-red-500 hover:text-white">
                  <FaRegTrashAlt />
                  <button
                    className="ml-2"
                    onClick={() =>
                      setModal({
                        title: `Delete ${formatDate(
                          budget.month,
                          'MMMM'
                        )}'s Budget?`,
                        btnText: 'Yes, delete it.',
                        message: 'This action cannot be undone.',
                        visible: true,
                        callback: () => handleDeleteBudget(budget.id),
                        type: 'delete',
                      })
                    }
                  >
                    Delete Budget
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <span className="block absolute top-0 bottom-0 bg-gray-50 w-6 -right-6"></span>
    </div>
  );
};
