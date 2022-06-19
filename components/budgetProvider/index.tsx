import React, { createContext } from 'react';
const BudgetContext = createContext(null);

const BudgetProvider = ({ value: ctx, children }) => {
  return (
    <BudgetContext.Provider value={{ ctx }}>{children}</BudgetContext.Provider>
  );
};

const BudgetConsumer = BudgetContext.Consumer;

export { BudgetProvider, BudgetConsumer, BudgetContext };
