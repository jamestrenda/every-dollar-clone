import React from 'react';
import { MdOutlineClose } from 'react-icons/md';

export const CloseButton = ({
  onClickHandler,
  className = 'top-4 right-4',
}) => {
  return (
    <button
      type="button"
      onClick={onClickHandler}
      className={`absolute ${className} cursor-pointer p-1 hover:text-indigo-500`}
      title="Esc to close"
    >
      <MdOutlineClose className="h-5 w-5" />
    </button>
  );
};
