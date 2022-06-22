import React, { createContext, ReactNode, useContext, useState } from 'react';
const LocalStateContext = createContext(null);

interface IModalProps {
  visible: boolean;
  title?: string;
  message: string | ReactNode;
  btnText?: string;
  callback?: void | null;
  type: 'info' | 'error' | 'success' | 'warning' | 'transaction';
  icon?: ReactNode | undefined;
}

const ModalStateProvider = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = useState<IModalProps>({
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
