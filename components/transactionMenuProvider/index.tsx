import React, { createContext, useContext, useState } from 'react';
const LocalStateContext = createContext(null);

const TransactionMenuStateProvider = ({ children }) => {
  const [open, setOpen] = useState(false);

  const toggleTransactionMenu = () => setOpen(!open);
  const openMenu = () => setOpen(true);
  const closeMenu = () => setOpen(false);

  return (
    <LocalStateContext.Provider
      value={{ open, setOpen, openMenu, closeMenu, toggleTransactionMenu }}
    >
      {children}
    </LocalStateContext.Provider>
  );
};

const useTransactionMenu = () => {
  const all = useContext(LocalStateContext);
  return all;
};

export { TransactionMenuStateProvider, useTransactionMenu };
