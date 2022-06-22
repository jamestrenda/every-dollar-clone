import React, { createContext, ReactNode, useContext, useState } from 'react';
const LocalStateContext = createContext(null);

const MenuStateProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    setOpen(!open);
  };

  const openMenu = () => {
    setOpen(true);
  };
  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <LocalStateContext.Provider
      value={{ open, setOpen, openMenu, closeMenu, toggleMenu }}
    >
      {children}
    </LocalStateContext.Provider>
  );
};

const useMenu = () => {
  const all = useContext(LocalStateContext);
  return all;
};

export { MenuStateProvider, useMenu };
