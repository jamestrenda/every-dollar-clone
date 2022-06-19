import React, { createContext, useContext, useState } from 'react';
const LocalStateContext = createContext(null);

const SidebarStateProvider = ({ children }) => {
  const [activeItem, setActiveItem] = useState({});

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
