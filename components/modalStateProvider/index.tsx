import React, { createContext, useContext, useState } from 'react';
const LocalStateContext = createContext(null);

const ModalStateProvider = ({ children }) => {
  const [modal, setModal] = useState({
    visible: false,
    title: '',
    message: '',
    btnText: 'OK',
    callback: null,
    type: 'info',
  });
  const closeModal = () => {
    setModal({ ...modal, visible: false });
    resetModal();
  };
  const resetModal = () => {
    setModal({
      visible: false,
      title: '',
      message: '',
      btnText: 'OK',
      callback: null,
      type: 'info',
    });
  };

  return (
    <LocalStateContext.Provider
      value={{ modal, setModal, closeModal, resetModal }}
    >
      {children}
    </LocalStateContext.Provider>
  );
};

const useModal = () => {
  const all = useContext(LocalStateContext);
  return all;
};

export { ModalStateProvider, useModal };
