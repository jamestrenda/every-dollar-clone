import React, { useContext, useState, useEffect } from 'react';
import {
  MdAttachMoney,
  MdOutlineClose,
  MdOutlineKeyboardArrowDown,
  MdRemoveCircle,
} from 'react-icons/md';
import { GiReceiveMoney } from 'react-icons/gi';
import { IoCalendarOutline } from 'react-icons/io5';
import { useModal } from '../modalStateProvider';
import { useSidebar } from '../sidebarStateProvider';
import { FaMoneyBillAlt, FaMoneyCheck } from 'react-icons/fa';
import useForm from '../../lib/useForm';
import { BudgetItemDecimalInput } from '../budgetItemDecimalInput';
import { BudgetItemInput } from '../budgetItemInput';
// import { GlobalDatePickerStyles } from '../DatePicker/styles';
import { Dropdown } from 'semantic-ui-react';
import { BudgetContext } from '../budgetProvider';
import { gql, useMutation } from '@apollo/client';
import { Spinner } from '../spinner';
import formatNumber from '../../lib/formatNumber';
import { CloseButton } from '../closeButton';
import { useTransactionMenu } from '../transactionMenuProvider';
import { SINGLE_BUDGET_QUERY } from '../budget/queries';
import {
  CREATE_TRANSACTION_MUTATION,
  UPDATE_TRANSACTION_MUTATION,
} from './mutations';
import { Notice } from '../notice';
import {
  StyledSplitDropDown,
  StyledTransactionFields,
  StyledTransactionTypeRadioGroup,
} from './styles';

export const TransactionModal = () => {
  const { activeItem } = useSidebar() || {};
  const {
    modal: {
      action,
      visible,
      item = {
        // changed this from being a transactionItem to a transaction
        description: '',
        total: 0,
        note: '',
        checkNo: '',
        date: null,
        transactionItems: [
          {
            id: 0,
            amount: 0,
            budgetItem:
              activeItem?.__typename === 'BudgetItem' ? activeItem : null,
            budgetItemId:
              activeItem?.__typename === 'BudgetItem' ? activeItem.id : null,
            income: activeItem?.__typename === 'Income' ? activeItem : null,
            incomeId:
              activeItem?.__typename === 'Income' ? activeItem.id : null,
            debt: activeItem?.__typename === 'Debt' ? activeItem : null,
            debtId: activeItem?.__typename === 'Debt' ? activeItem.id : null,
          },
        ],
      },
    },
    closeModal,
  } = useModal();
  const {
    ctx: { budget },
  } = useContext(BudgetContext);

  const [
    createTransaction,
    { data: createData, loading: createLoading, error: createError },
  ] = useMutation(CREATE_TRANSACTION_MUTATION);
  const [updateTransaction, { data, loading, error }] = useMutation(
    UPDATE_TRANSACTION_MUTATION
  );
  const { closeMenu } = useTransactionMenu();
  const isIncome = item?.income?.id === 'Income';
  const [dateFocused, setDateFocused] = useState(false); // for react-dates date picker
  const [options, setOptions] = useState([]); // for semantic-ui dropdown
  const [selectedSplitValue, setSelectedSplitValue] = useState(null); // for semantic-ui dropdown change handler
  const [transactionItems, setTransactionItems] = useState(
    item.transactionItems
      ?.filter((result) => result.budgetItem || result.income || result.debt)
      .map((transactionItem) => ({
        id: transactionItem.id,
        key: transactionItem.budgetItemId
          ? `item-${transactionItem.budgetItemId}-parentCategory-${transactionItem.budgetItem?.parentCategoryId}`
          : transactionItem.incomeId
          ? `incomeSource-${transactionItem.incomeId}`
          : `debt-${transactionItem.debtId}`,
        name:
          transactionItem.budgetItem?.name ||
          transactionItem.income?.source ||
          transactionItem.debt?.name,
        amount: transactionItem.amount,
        budgetItemId: transactionItem.budgetItemId || null,
        incomeId: transactionItem.incomeId || null,
        debtId: transactionItem.debtId || null,
        categoryId: transactionItem.budgetItem?.parentCategoryId || null,
      })) || []
  );

  const [existingTransactionItems, setExistingTransactionItems] = useState(
    item.transactionItems
      ?.filter((result) => result.budgetItem || result.income || result.debt)
      .map((transactionItem) => ({
        id: transactionItem.id,
        key: transactionItem.budgetItemId
          ? `item-${transactionItem.budgetItemId}-parentCategory-${transactionItem.budgetItem?.parentCategoryId}`
          : transactionItem.incomeId
          ? `incomeSource-${transactionItem.incomeId}`
          : `debt-${transactionItem.debtId}`,
        name:
          transactionItem.budgetItem?.name ||
          transactionItem.income?.source ||
          transactionItem.debt?.name,
        amount: transactionItem.amount,
        budgetItemId: transactionItem.budgetItemId || null,
        incomeId: transactionItem.incomeId || null,
        debtId: transactionItem.debtId || null,
        categoryId: transactionItem.budgetItem?.parentCategoryId || null,
      })) || []
  );
  const [transactionSplitAmounts, setTransactionSplitAmounts] = useState(
    item.transactionItems
      ?.filter((result) => result.budgetItemId || result.income || result.debt)
      .reduce((result, transactionItem) => {
        result[
          transactionItem.budgetItemId
            ? `item-${transactionItem.budgetItemId}-parentCategory-${transactionItem.budgetItem?.parentCategoryId}`
            : transactionItem.incomeId
            ? `incomeSource-${transactionItem.incomeId}`
            : `debt-${transactionItem.debtId}`
        ] = transactionItem.amount;
        return result;
      }, {})
  );
  const [transactionSplitsTotal, setTransactionSplitsTotal] = useState(
    item.total || 0
  );
  const [emptySplitAmountsExist, setEmptySplitAmountsExist] = useState(false);

  const { inputs, handleChange, handleNumberChange } = useForm({
    transactionType: isIncome ? 'income' : 'expense',
    transactionTotal: item.total,
    transactionDescription: item.description,
    transactionNote: item.note,
    transactionCheckNo: item.checkNo,
    transactionDate: item.date || new Date(),
  });

  // shape the options that will be passed to the 'Add Split' drop down
  const budgetItemOptions =
    budget?.categories &&
    budget?.categories.reduce(
      (total, category) => [
        ...total,
        ...category.budgetItems?.map((item) => ({
          key: `item-${item.id}-parentCategory-${category.id}`,
          text: `${item.name} ${category.name}`,
          value: item.id,
          'data-budget-item-id': item.id,
          'data-name': item.name,
          'data-category-id': category.id,
          'data-key': `item-${item.id}-parentCategory-${category.id}`,
          description: category.name,
          content: <Dropdown.Item content={item.name} />,
        })),
      ],
      []
    );
  const incomeOptions =
    budget?.incomes &&
    budget?.incomes.reduce(
      (total, income) => [
        ...total,
        {
          key: `incomeSource-${income.id}`,
          text: `${income.source} income`,
          value: income.id,
          'data-name': income.source,
          'data-type': 'income',
          'data-key': `incomeSource-${income.id}`,
          description: 'Income',
          content: <Dropdown.Item content={income.source} />,
        },
      ],
      []
    );
  const debtOptions =
    budget?.debts &&
    budget?.debts.reduce(
      (total, debt) => [
        ...total,
        {
          key: `debt-${debt.id}`,
          text: `${debt.name} debt`,
          value: debt.id,
          'data-name': debt.name,
          'data-type': 'debt',
          'data-key': `debt-${debt.id}`,
          description: 'Debt',
          content: <Dropdown.Item content={debt.name} />,
        },
      ],
      []
    );

  // creates the options list and orders them correctly
  // (i.e. incomes first, then budget category items, then debts).
  // can be called without any params
  const reorderOptions = ({
    income = incomeOptions,
    budgetItems = budgetItemOptions,
    debt = debtOptions,
  } = {}) => {
    const filteredBudgetItemOptions = [...budgetItems].reduce(
      (totalItems, currentItem) => {
        // look for key in transactionItems
        const itemFound = transactionItems?.filter((transactionItem) => {
          return transactionItem.key === currentItem.key;
        });

        if (!itemFound?.length) return [...totalItems, currentItem];
        return [...totalItems];
      },
      []
    );
    const filteredIncomeOptions = [...income].reduce(
      (totalItems, currentItem) => {
        // look for key in transactionItems
        const itemFound = transactionItems?.filter((transactionItem) => {
          return transactionItem.key === currentItem.key;
        });

        if (!itemFound?.length) return [...totalItems, currentItem];

        return [...totalItems];
      },
      []
    );
    const filteredDebtOptions = [...debt].reduce((totalItems, currentItem) => {
      // find key value in transactionItems
      const itemFound = transactionItems?.filter((transactionItem) => {
        return transactionItem.key === currentItem.key;
      });

      if (!itemFound?.length) return [...totalItems, currentItem];

      return [...totalItems];
    }, []);

    setOptions([
      ...filteredIncomeOptions,
      ...filteredBudgetItemOptions,
      ...filteredDebtOptions,
    ]);
  };

  useEffect(() => {
    document.getElementById('transactionTotal').focus();
  }, [visible]);

  useEffect(() => {
    // every time an item is added or removed from transactionItems,
    // re-create the options list for the drop down

    // TODO: uncomment this once transaction code fully copied over
    // reorderOptions();

    // and set the drop down value to null, so that we'll always
    // trigger an onChange event when choosing an item from the drop down
    setSelectedSplitValue(null);

    if (transactionItems?.length === 1) {
      setTransactionSplitAmounts([]);
      setEmptySplitAmountsExist(false);
    } else {
      // make sure to disable the save changes button if every split amount field doesn't have a value

      if (transactionSplitAmounts) {
        const emptyValue = Object.values(transactionSplitAmounts).filter(
          (split) => split === 0
        );

        if (
          transactionItems?.length >
            Object.values(transactionSplitAmounts).length ||
          emptyValue.length
        ) {
          setEmptySplitAmountsExist(true);
        } else {
          setEmptySplitAmountsExist(false);
        }
      }
    }
  }, [transactionItems]);

  useEffect(() => {
    if (transactionSplitAmounts) {
      const splits = Object.values(transactionSplitAmounts);
      const total = splits?.reduce(
        (allSplits: number, currentSplit: number): number =>
          allSplits + currentSplit,
        0
      );

      // make sure to disable the save changes button if every split amount field doesn't have a value
      const emptyValue = splits?.filter((split) => split === 0);

      if (emptyValue?.length) {
        setEmptySplitAmountsExist(true);
      } else {
        setEmptySplitAmountsExist(false);
      }

      setTransactionSplitsTotal(total);
      // TODO: a bit redundant because we're already checking for this in another effect,
      // but for the sake of time this works, can re-factor it later...
      // if (transactionItems.length > 1 && total !== inputs['transactionTotal']) {
      //   setDisableSaveButton(true);
      // } else {
      //   setDisableSaveButton(false);
      // }
    }
  }, [transactionSplitAmounts]);
  const isIncomeChecked = inputs['transactionType'] === 'income';
  const isExpenseChecked = inputs['transactionType'] === 'expense';

  const handleAddSplit = ({ target }, data) => {
    // get key first so we can filter against existing transaction items

    // TODO: enter key seems to break transactionItems

    const key = target.dataset['key'];

    const existingItem = existingTransactionItems?.filter(
      (item) => item.key === key
    );

    const items = [...transactionItems];

    if (existingItem && existingItem.length) {
      // put the existing item back in so we can use its real ID,
      // triggering an 'update' in the upsert of the updateTransaction mutation
      setTransactionItems([...items, existingItem[0]]);
    } else {
      // new items will get an ID of 0, triggering a 'create' in the upsert
      // of the updateTransaction mutation
      const { value } = data;
      const name = target.dataset['name'];
      const budgetItemId = parseInt(target.dataset['budgetItemId']) || null;
      const categoryId = parseInt(target.dataset['categoryId']) || null;
      const type = target.dataset['type'];

      items.map((item) => {
        delete item.amount;

        return { ...item, amount: 0 };
      });

      const item = {
        id: 0,
        key,
        name,
        budgetItemId,
        categoryId,
        amount: 0, // we'll update this with the decimal input fields
        incomeId: type === 'income' ? value : null,
        debtId: type === 'debt' ? value : null,
      };

      setTransactionItems([...items, item]);
    }
  };
  const handleTransactionSplitAmountChange = (value, target) => {
    let { name, type } = target;

    if (type === 'number') {
      value = parseInt(value);
    }

    setTransactionSplitAmounts({
      ...transactionSplitAmounts,
      [name]: value,
    });
  };

  const handleDeleteSplit = (item) => {
    const { key } = item;

    // remove it from the transaction items
    const items = [...transactionItems];
    const filteredItems = items.filter((i) => i.key !== key);
    setTransactionItems(filteredItems); // triggers a useEffect which resets the options list

    // remove it from the amount splits that we're tracking as well
    const splits = { ...transactionSplitAmounts };
    delete splits[key];

    setTransactionSplitAmounts(splits);
  };

  const saveChanges = async () => {
    // 1. shape data to send off to mutation

    const copy = [...transactionItems];

    const transactionItemData = copy.map((item) => {
      const copy = { ...item };

      //
      if (transactionItems.length === 1) {
        // use transation total for the amount, since there will be zero splits
        copy.amount = inputs['transactionTotal'];

        if (existingTransactionItems.length) {
          // this is to ensure that if the budget item is changed to something
          // other than what it originally was, the transactionItem gets 'updated' with
          // the 'upsert' instead of a new transaction being 'created'. Basically,
          // it just swaps the budgetItemId with another one or with an incomeId or debtId
          copy.id = existingTransactionItems[0].id; // safe to assume 0-index here since length will be 1
        }
      } else {
        // use the amount in the splits object...

        // 1. get the keys
        const keys = Object.keys(transactionSplitAmounts);

        // 2. find the current item based on its key
        const key = keys.filter((k) => k === copy.key)[0];

        // 3. set the amount to the key's value
        copy.amount = transactionSplitAmounts[key];
      }

      // 4. deleted used props
      delete copy.key;
      delete copy.name;
      delete copy.categoryId;

      // 5. return what's left
      return {
        ...copy,
      };
    });

    if (item.id) {
      const variables = {
        id: item.id,
        description: inputs['transactionDescription'],
        total: inputs['transactionTotal'],
        note: inputs['transactionNote'],
        checkNo: inputs['transactionCheckNo'],
        date: inputs['transactionDate'],
        transactionItems: transactionItemData,
      };
      // console.log({ variables });
      // 2. we'll call our mutation updateTransaction
      await updateTransaction({
        variables,
        refetchQueries: [
          { query: SINGLE_BUDGET_QUERY, variables: { id: budget.id } },
        ],
        // going to need to evict any deleted transaction items...
        // update(cache) {
        // transactionItems.forEach((result) => {
        //   console.log({ result });
        //   cache.modify({
        //     id: cache.identify({
        //       __typename: result.budgetItemId
        //         ? 'BudgetItem'
        //         : result.incomeId
        //         ? 'Income'
        //         : 'Debt',
        //       id: result.budgetItemId || result.incomeId || result.debtId,
        //     }),
        //     fields: {
        //       transactions(existingTransactionsRefs, { INVALIDATE }) {
        //         return INVALIDATE;
        //       },
        //     },
        //   });
        // existingTransactionItems.forEach((result) =>
        //   cache.modify({
        //     id: cache.identify({
        //       __typename: result.budgetItemId
        //         ? 'BudgetItem'
        //         : result.incomeId
        //         ? 'Income'
        //         : 'Debt',
        //       id: result.budgetItemId || result.incomeId || result.debtId,
        //     }),
        //     fields: {
        //       transactions(existingTransactionsRefs, { readField }) {
        //         return existingTransactionsRefs.filter(
        //           (transactionRef) =>
        //             result.id !== readField('id', transactionRef)
        //         );
        //       },
        //     },
        //   })
        // );
        // transactionItems.forEach((result) =>
        //   cache.modify({
        //     id: cache.identify({
        //       __typename: result.budgetItemId
        //         ? 'BudgetItem'
        //         : result.incomeId
        //         ? 'Income'
        //         : 'Debt',
        //       id: result.budgetItemId || result.incomeId || result.debtId,
        //     }),
        //     fields: {
        //       transactions(transactionsRefs = [], { readField }) {
        //         const newTransactionRef = cache.writeFragment({
        //           data: updateTransaction,
        //           fragment: gql`
        //             fragment NewTransaction on Transaction {
        //               id
        //               description
        //               total
        //               note
        //               checkNo
        //               date
        //               transactionItems
        //             }
        //           `,
        //         });

        //         // Quick safety check - if the new comment is already
        //         // present in the cache, we don't need to add it again.
        //         if (
        //           transactionsRefs.some(
        //             (ref) => readField('id', ref) === result.id
        //           )
        //         ) {
        //           return transactionsRefs;
        //         }

        //         return [...transactionsRefs, newTransactionRef];
        //       },
        //     },
        //   })
        // );
        // cache.updateQuery({SINGLE_BUDGET_QUERY});
        // const newItemsCreated = transactionItemData.filter(
        //   (result) => !result.id
        // );
        // console.log({ newItemsCreated });
        // if (newItemsCreated.length) {
        //   newItemsCreated.map((result) =>
        //     cache.modify({
        //       id: cache.identify({
        //         __typename: result.budgetItemId
        //           ? 'BudgetItem'
        //           : result.incomeId
        //           ? 'Income'
        //           : 'Debt',
        //         id: result.budgetItemId
        //           || result.incomeId
        //           || result.debtId
        //       }),
        //       fields: {
        //         transactions(existingTransactions = []) {
        //           const newTransactionRef = cache.writeFragment({
        //             data: updateTransaction,
        //             fragment: gql`
        //               fragment NewTransaction on Transaction {
        //                 id
        //                 description
        //                 total
        //                 note
        //                 checkNo
        //                 date
        //                 transactionItems
        //               }
        //             `,
        //           });
        //           return [...existingTransactions, newTransactionRef];
        //         },
        //       },
        //       optimistic: true,
        //     })
        //   );
        // }
        // if (transactionItems.length !== existingTransactionItems.length) {
        //   // basically, deletes rogue splits from the cache...
        //   // actually i think this is causing a bit of an issue..need to re-examine this
        //   const itemsToDelete = differenceBy(
        //     existingTransactionItems,
        //     transactionItems,
        //     'id'
        //   );
        //   if (itemsToDelete.length) {
        //     for (const deleteItem of itemsToDelete) {
        //       cache.evict({
        //         id: cache.identify({
        //           __typename: 'TransactionItem',
        //           id: deleteItem['id'],
        //         }),
        //       });
        //     }
        //     cache.gc();
        //   }
        // }
        // },
      });
    } else if (!item.id) {
      const variables = {
        budgetId: budget.id,
        description: inputs['transactionDescription'],
        total: inputs['transactionTotal'],
        note: inputs['transactionNote'],
        checkNo: inputs['transactionCheckNo'],
        date: inputs['transactionDate'],
        transactionItems: transactionItemData,
      };
      await createTransaction({
        variables,
        update(cache, { data: { createTransaction } }) {
          cache.modify({
            id: cache.identify({
              __typename: 'Budget',
              id: budget.id,
            }),
            fields: {
              transactions(existingTransactions = []) {
                const newTransactionRef = cache.writeFragment({
                  data: createTransaction,
                  fragment: gql`
                    fragment NewTransaction on Transaction {
                      id
                      description
                      total
                      note
                      checkNo
                      date
                      transactionItems
                    }
                  `,
                });
                return [...existingTransactions, newTransactionRef];
              },
            },
            optimistic: true,
          });
        },
      });
    } else {
      return;
    }
  };

  return (
    <>
      {/* <GlobalDatePickerStyles /> */}
      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div className="flex flex-col min-h-[60vh]">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 relative">
            <CloseButton onClickHandler={closeModal} />
            <div className="flex flex-col items-center">
              <div
                className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
                  isIncomeChecked
                    ? 'bg-green-100 text-green-500'
                    : 'bg-orange-100 text-orange-500'
                }`}
              >
                {isIncomeChecked ? (
                  <FaMoneyBillAlt className={`h-5 w-5 `} />
                ) : (
                  <FaMoneyCheck className={`h-5 w-5 `} />
                )}
              </div>
              <div className="mt-3 text-center">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900 flex items-center"
                  id="modal-title"
                >
                  {`${action} ${isIncomeChecked ? 'Income' : 'Expense'}`}
                </h3>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 flex-grow flex flex-col">
            <div className="flex items-center justify-center">
              <StyledTransactionTypeRadioGroup>
                <input
                  type="radio"
                  name="transactionType"
                  id="expense"
                  checked={isExpenseChecked}
                  value="expense"
                  onChange={handleChange}
                />
                <label htmlFor="expense">Expense</label>
                <input
                  type="radio"
                  name="transactionType"
                  id="income"
                  checked={isIncomeChecked}
                  value="income"
                  onChange={handleChange}
                />
                <label htmlFor="income">Income</label>
                <span
                  className={`left-0 ${isIncomeChecked ? 'left-1/2' : ''}`}
                ></span>
              </StyledTransactionTypeRadioGroup>
            </div>
            <div className="flex-grow">
              <StyledTransactionFields>
                <div className="flex items-center">
                  <div className="relative ">
                    <IoCalendarOutline className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 z-[1]" />
                    {/* <SingleDatePicker
                      readOnly
                      date={moment(inputs['transactionDate']) || null} // momentPropTypes.momentObj or null
                      onDateChange={(date) =>
                        (inputs['transactionDate'] = date)
                      } // PropTypes.func.isRequired
                      focused={dateFocused} // PropTypes.bool
                      onFocusChange={({ focused }) => setDateFocused(focused)} // PropTypes.func.isRequired
                      id="transactionDate" // PropTypes.string.isRequired,
                      numberOfMonths={1}
                      hideKeyboardShortcutsPanel
                      displayFormat="MMMM D, YYYY"
                      noBorder
                      isOutsideRange={() => false}
                    /> */}
                  </div>
                  <div className="relative ml-2 flex-grow">
                    <MdAttachMoney className="pointer-events-none text-gray-600 h-5 w-5 absolute top-1/2 -translate-y-1/2 left-2" />
                    <BudgetItemDecimalInput
                      name="transactionTotal"
                      className="bg-white"
                      value={inputs[`transactionTotal`]}
                      handleChange={handleNumberChange}
                      align="right"
                    />
                  </div>
                </div>
                <div className="mt-2 relative">
                  <GiReceiveMoney className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 z-[1]" />
                  <BudgetItemInput
                    name="transactionDescription"
                    value={inputs[`transactionDescription`]}
                    align="center"
                    placeholder="Where did you spend this money?"
                    className="text-sm"
                    handleChange={() => handleChange}
                  />
                </div>
                <div className="mt-4">
                  <div>
                    {/* {!transactionItems.length && (
                      <Notice
                        className="mb-4"
                        type="warning"
                        heading
                        message="At least one budget item is required."
                      />
                    )} */}
                    {transactionItems?.map((transactionItem, index) => (
                      <div
                        key={transactionItem.key}
                        className="flex items-center mb-2 last:mb-0"
                      >
                        <div className="flex items-center flex-grow">
                          <button
                            type="button"
                            onClick={() => handleDeleteSplit(transactionItem)}
                          >
                            <MdRemoveCircle className="h-5 w-5 mr-2 text-red-500" />
                          </button>
                          <span className="text-sm">
                            {transactionItem.name}
                          </span>
                        </div>
                        <div className="flex-shrink text-right max-w-[100px]">
                          {transactionItems?.length > 1 ? (
                            <BudgetItemDecimalInput
                              name={transactionItem.key}
                              align="right"
                              value={
                                transactionSplitAmounts
                                  ? transactionSplitAmounts[transactionItem.key]
                                  : 0
                              }
                              handleChange={handleTransactionSplitAmountChange}
                            />
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    ))}
                    {transactionItems?.length > 1 && (
                      <div className="border-t border-gray-200 mt-2 pt-2 mb-b italic text-sm text-right">
                        (Remaining: $
                        {formatNumber(
                          inputs['transactionTotal'] -
                            (transactionSplitsTotal || 0)
                        )}
                        )
                      </div>
                    )}
                  </div>
                  {transactionItems?.length > 0 && (
                    <div className="text-indigo-500 text-base font-medium  mt-4 mb-2">
                      Add a Split
                    </div>
                  )}
                  <StyledSplitDropDown
                    className="icon"
                    floating
                    icon={<MdOutlineKeyboardArrowDown />}
                    options={options}
                    text="Choose Budget Item(s)"
                    search
                    onChange={handleAddSplit}
                    value={selectedSplitValue}
                    selectOnBlur={false}
                    onBlur={() => setSelectedSplitValue(null)}
                  />
                </div>
              </StyledTransactionFields>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ">
              <button
                type="button"
                onClick={async () => {
                  await saveChanges();
                  closeModal();
                  closeMenu();
                }}
                disabled={
                  loading ||
                  createLoading ||
                  !transactionItems.length ||
                  inputs['transactionTotal'] === 0 ||
                  !inputs['transactionDescription'].length ||
                  (transactionItems.length > 1 &&
                    transactionSplitsTotal !== inputs['transactionTotal']) ||
                  emptySplitAmountsExist
                }
                className={`${
                  isIncomeChecked
                    ? 'bg-green-500 hover:bg-green-600 ring-green-300'
                    : 'bg-orange-400 hover:bg-orange-500 ring-orange-300'
                } transition w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2  text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-offset-2  sm:ml-3 sm:w-auto sm:text-sm disabled:pointer-events-none disabled:bg-opacity-50 disabled:select-none `}
              >
                {loading || createLoading ? (
                  <span className="flex relative">
                    <Spinner className="" align="items-start" size="h-5 w-5" />
                    <span className="pl-7">Saving...</span>
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
              <button
                type="button"
                onClick={() => closeModal(false)}
                className={`transition hover:bg-gray-200 mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
