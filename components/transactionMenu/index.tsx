import { useContext, useState } from 'react';
import { isAfter } from 'date-fns';
import { AddTransactionButton } from '../addTransactionButton';
import { BudgetContext } from '../budgetProvider';
import { CloseButton } from '../closeButton';
import { useTransactionMenu } from '../transactionMenuProvider';
import { StyledBadge, StyledTab, StyledTransactionMenu } from './styles';
import { TransactionItem } from '../transactionItem';

// TODO: Ramsey is bring in all transactions associated with the user, not just the budget
//       so when we get users working, we'll have to set up a query to do just that...might have to
//       modify the budget context some to make sure any edited transactions are updated on the
//       proper budget... he's also pulling them in by month

// const ALL_USER_TRANSACTION_QUERY = gql`
// query ALL_USER_TRANSACTION_QUERY {
//   transactions
// }
// `;

export const TransactionMenu = () => {
  const { open, closeMenu } = useTransactionMenu();
  const {
    ctx: { budget },
  } = useContext(BudgetContext);

  const trackedTransactions = budget.transactions
    ?.filter(
      (result) =>
        result?.active &&
        result?.transactionItems?.length &&
        result?.transactionItems?.filter(
          (transactionItem) =>
            transactionItem.budgetItem ||
            transactionItem.income ||
            transactionItem.debt
        ).length
    )
    .sort((a, b) => (isAfter(a.date, b.date) ? -1 : 0));
  const newTransactions = budget?.transactions
    ?.filter(
      (result) =>
        result?.active &&
        result?.transactionItems?.filter(
          (transactionItem) =>
            !transactionItem.budgetItem &&
            !transactionItem.income &&
            !transactionItem.debt
        ).length
    )
    .sort((a, b) => (isAfter(a.date, b.date) ? -1 : 0));
  const deletedTransactions = budget?.transactions
    ?.filter((result) => !result.active)
    .sort((a, b) => (isAfter(a.date, b.date) ? -1 : 0));

  const [activeTab, setActiveTab] = useState(2);
  return (
    <StyledTransactionMenu
      className={`absolute transition top-0 ${
        open ? 'visible' : ''
      } w-full min-h-[50vh] z-[999] bg-white rounded-md shadow-md p-6`}
    >
      <CloseButton onClickHandler={closeMenu} className="top-4 right-4" />
      <div className="">
        <div className="text-lg font-bold mb-2">Transactions</div>

        <AddTransactionButton
          context={budget}
          small
          className="flex items-center mr-2"
        >
          Add New
        </AddTransactionButton>
      </div>
      <div className="flex justify-between text-sm font-bold my-4 border-b-2 border-gray-200">
        <StyledTab
          type="button"
          onClick={() => setActiveTab(1)}
          active={activeTab}
        >
          New <StyledBadge>{newTransactions.length}</StyledBadge>
        </StyledTab>
        <StyledTab
          type="button"
          onClick={() => setActiveTab(2)}
          active={activeTab}
        >
          Tracked <StyledBadge>{trackedTransactions.length}</StyledBadge>
        </StyledTab>
        <StyledTab
          type="button"
          onClick={() => setActiveTab(3)}
          active={activeTab}
        >
          Deleted <StyledBadge>{deletedTransactions.length}</StyledBadge>
        </StyledTab>
      </div>
      <div>
        {/* new */}
        <div className={`${activeTab === 1 ? '' : 'hidden'}`}>
          {newTransactions.length ? (
            newTransactions.map((transaction, index) =>
              transaction.transactionItems.map((transactionItem) => (
                <>
                  {/* <p>[transaction item goes here]</p> */}
                  <TransactionItem key={index} item={transactionItem} />
                </>
              ))
            )
          ) : (
            <p className="text-sm italic">No transactions.</p>
          )}
        </div>
        {/* tracked */}
        <div className={`${activeTab === 2 ? '' : 'hidden'}`}>
          {trackedTransactions.length ? (
            trackedTransactions.map((transaction, index) =>
              transaction.transactionItems.map((transactionItem) => (
                <>
                  {/* <p>[transaction item goes here]</p> */}
                  <TransactionItem key={index} item={transactionItem} />
                </>
              ))
            )
          ) : (
            <p className="text-sm italic">No transactions.</p>
          )}
        </div>
        {/* deleted */}
        <div className={`${activeTab === 3 ? '' : 'hidden'}`}>
          {deletedTransactions.length ? (
            deletedTransactions.map((transaction, index) =>
              transaction.transactionItems.map((transactionItem) => (
                <>
                  {/* <p>[transaction item goes here]</p> */}
                  <TransactionItem deleted key={index} item={transactionItem} />
                </>
              ))
            )
          ) : (
            <p className="text-sm italic">No transactions.</p>
          )}
        </div>
      </div>
    </StyledTransactionMenu>
  );
};
