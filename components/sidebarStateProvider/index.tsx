import { gql, useLazyQuery, useQuery } from '@apollo/client';
import React, { createContext, useContext, useState } from 'react';
import { SINGLE_BUDGET_ITEM_QUERY, SINGLE_INCOME_QUERY } from './queries';
const LocalStateContext = createContext(null);

const SidebarStateProvider = ({ children }) => {
  const [activeItem, setActiveItem] = useState<
    IIncomeItemProps | IBudgetItemProps | null
  >(null);

  // we could potentially accept an item id and then inside here query the budgetItem for that id and then set activeItem to that
  // const [budgetItem] = useLazyQuery(SINGLE_BUDGET_ITEM_QUERY);
  // const [income] = useLazyQuery(SINGLE_INCOME_QUERY);
  // async function setActiveItem(item: IIncomeItemProps | IBudgetItemProps) {
  //   if (item) {
  //     if (item.__typename === 'BudgetItem') {
  //       const res = await budgetItem({
  //         variables: {
  //           id: item?.id,
  //         },
  //       });
  //       const { data } = res;
  //       if (data?.budgetItem) {
  //         setItem(data.budgetItem);
  //       }
  //     }

  //     if (item.__typename === 'Income') {
  //       const res = await income({
  //         variables: {
  //           id: item?.id,
  //         },
  //       });
  //       const { data } = res;
  //       if (data?.income) {
  //         setItem(data.income);
  //       }
  //     }
  //   } else {
  //     setItem(null);
  //   }
  // }

  return (
    <LocalStateContext.Provider value={{ activeItem, setActiveItem }}>
      {children}
    </LocalStateContext.Provider>
  );
};

const useSidebar = () => {
  const all = useContext(LocalStateContext);
  return all;
};

export { SidebarStateProvider, useSidebar };
