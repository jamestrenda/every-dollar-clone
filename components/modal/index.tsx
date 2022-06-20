import React, { useEffect, useState } from 'react';
import { useModal } from '../modalStateProvider';
import { FaRegTrashAlt } from 'react-icons/fa';
import { RiFileShredLine } from 'react-icons/ri';
import { CloseButton } from '../closeButton';
import { TransactionModal } from '../transactionModal';
import { Spinner } from '../spinner';
import { useSidebar } from '../sidebarStateProvider';
// import { TransactionModal } from '../TransactionModal';
// const html = React.createElement('p', {
//   children: (
//     <>
//       Are you sure you want to delete{' '}
//       <span className="font-bold">{item.name}</span>?
//     </>
//   ),
// });
export const Modal = () => {
  const { modal, resetModal, closeModal } = useModal();
  const { activeItem } = useSidebar();
  const [loading, setLoading] = useState(false);

  const handleKeyDown = (e) => {
    const { key } = e;
    if (key) {
      const isEscape = key === 'Escape' || key === 'Esc';
      if (isEscape) {
        resetModal();
      }
    }
  };
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  // this markup was modified from tailwind UI
  return (
    <div
      className={`fixed z-[999] inset-0 overflow-y-auto`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-black bg-opacity-60"
          aria-hidden="true"
        ></div>

        {/* <!-- This element is to trick the browser into centering the modal contents. --> */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {modal?.type?.toLowerCase() === 'transaction' ? (
          <TransactionModal />
        ) : (
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
            {modal?.type ? (
              <div className="bg-white p-0">
                <div className="sm:flex sm:items-start p-5">
                  <div
                    className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
                      modal?.type === 'error' ||
                      modal?.type.toLowerCase() === 'delete'
                        ? 'bg-red-100'
                        : ''
                    } ${modal?.type === 'warning' ? 'bg-yellow-100' : ''} ${
                      modal?.type === 'info' ? 'bg-blue-100' : ''
                    } ${modal?.type === 'positive' ? 'bg-green-100' : ''}`}
                  >
                    {activeItem || modal?.type.toLowerCase() === 'delete' ? (
                      <FaRegTrashAlt className="text-red-500" />
                    ) : modal?.btnText?.includes('shred') ? (
                      <RiFileShredLine className="text-red-500" />
                    ) : (
                      <svg
                        className={`h-6 w-6 ${
                          modal?.type === 'error' || modal?.type.toLowerCase()
                            ? 'text-red-500'
                            : ''
                        } ${
                          modal?.type === 'warning' ? 'text-yellow-500' : ''
                        } ${modal?.type === 'info' ? 'text-blue-500' : ''} ${
                          modal?.type === 'positive' ? 'text-green-400' : ''
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      {modal?.title}
                    </h3>

                    <div className="mt-2">
                      <div className="text-sm text-gray-500">
                        {modal?.message}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={async () => {
                      const { callback } = modal;
                      setLoading(true);
                      await callback();
                      closeModal();
                    }}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2  text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-offset-2  sm:ml-3 sm:w-auto sm:text-sm ${
                      modal?.type === 'error' ||
                      modal?.type.toLowerCase() === 'delete'
                        ? 'bg-red-500 hover:bg-red-600 focus:ring-red-400'
                        : ''
                    } ${
                      modal?.type === 'warning'
                        ? 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400'
                        : ''
                    } ${
                      modal?.type === 'info'
                        ? 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400'
                        : ''
                    } ${
                      modal?.type === 'positive'
                        ? 'bg-green-500 hover:bg-green-600 focus:ring-green-400'
                        : ''
                    }`}
                  >
                    {loading ? <Spinner /> : modal?.btnText}
                  </button>
                  <button
                    type="button"
                    onClick={() => closeModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <CloseButton onClickHandler={closeModal} />
                {modal?.message}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
