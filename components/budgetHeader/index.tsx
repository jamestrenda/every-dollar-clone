import React, { useContext, useState } from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';
import {
  FaAlignRight,
  FaEnvelope,
  FaFolder,
  FaRegEnvelopeOpen,
} from 'react-icons/fa';
import {
  IoAdd,
  IoEllipsisHorizontal,
  IoEllipsisVerticalSharp,
} from 'react-icons/io5';
import styled from 'styled-components';
import tw from 'twin.macro';
import { GrTransaction } from 'react-icons/gr';
import formatNumber from '../../lib/formatNumber';
import { BudgetConsumer, BudgetContext } from '../budgetProvider';
// import { ToolTip } from '../toolTip';
import { useTransactionMenu } from '../transactionMenuProvider';
import { useSidebar } from '../sidebarStateProvider';

const StyledTransactionsToggleButton = styled.button`
  position: relative;
  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    right: 0;
    margin: 0 auto;
    ${tw`bg-gray-200 transition h-12 w-12 rounded-full`}
    opacity: 0;
    pointer-events: none;
  }
  &:hover {
    ${tw`text-indigo-500`};
    &::before {
      opacity: 1;
    }
    path {
      stroke: currentColor;
    }
  }
`;

const StyledEllipseButton = styled.button`
  position: relative;
  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    right: 0;
    margin: 0 auto;
    ${tw`bg-gray-200 transition h-12 w-12 rounded-full`}
    opacity: 0;
    pointer-events: none;
  }
  &:hover {
    ${tw`text-indigo-500`};
    &::before {
      opacity: 1;
    }
  }
`;

export const BudgetHeader = () => {
  const {
    ctx: { categories, closedEnvelopes, setClosedEnvelopes, budget },
  } = useContext(BudgetContext);
  // const [openEnvelopes, setOpenEnvelopes] = useState(false);
  const { setActiveItem } = useSidebar();

  // set up two years of dates

  const [dates, setDates] = useState();
  const [dateFocused, setDateFocused] = useState(false); // for react-dates date picker

  const { toggleTransactionMenu } = useTransactionMenu();

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
  // console.log({ budget });
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

  const everyDollar = totalPlanned === totalBudgeted;

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
            <li className="grid place-items-center">
              <StyledEllipseButton
                type="button"
                className="p-3 group transition"
              >
                <IoEllipsisHorizontal className="h-6 w-7 group-hover:text-indigo-500" />
              </StyledEllipseButton>
            </li>
          </ul>
        </div>
      </div>

      <span className="block absolute top-0 bottom-0 bg-gray-50 w-6 -right-6"></span>
    </div>
  );
};
