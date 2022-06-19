import { gql, useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { BiUndo } from 'react-icons/bi';
import { RiFileShredLine } from 'react-icons/ri';
import styled from 'styled-components';
import tw from 'twin.macro';
import { formatDate } from '../../lib/formatDate';
import formatNumber from '../../lib/formatNumber';
// import { LoadingState } from '../LoadingState';
import { useModal } from '../modalStateProvider';
import { useSidebar } from '../sidebarStateProvider';

const SOFT_DELETE_MUTATION = gql`
  mutation SOFT_DELETE_MUTATION($id: Int!) {
    softDeleteTransaction(id: $id) {
      id
    }
  }
`;

const RESTORE_DELETED_ITEM_MUTATION = gql`
  mutation RESTORE_DELETED_ITEM_MUTATION($id: Int!) {
    restoreTransaction(id: $id) {
      id
    }
  }
`;

const DELETED_TRANSACTION_MUTATION = gql`
  mutation DELETED_TRANSACTION_MUTATION($id: Int!) {
    deleteTransaction(id: $id) {
      id
    }
  }
`;

const StyledToast = styled.div`
  opacity 0;
  transform: translateY(-2rem);

  /* ${tw`opacity-0 transition-all`}; */
  /* ${tw`opacity-0 transition-all scale-50 transform -translate-y-6`}; */

  &.animate-enter {
    opacity: 1;
    transform: translateY(0rem);
    /* ${tw`opacity-100 scale-100`}; */
  }
  &.animate-leave {
    /* ${tw`opacity-0 scale-75`}; */

    opacity: 0 !important;
    transform: translateY(-2rem);
    /* opacity: 0; */
    /* opacity-0 scale-75 -translate-y-6 */
  }
`;

const StyledButton = styled.button`
  ${tw`text-xs uppercase font-bold text-white py-1 px-2 rounded-full cursor-pointer transition-all mr-2 last:mr-0`}
`;

export const TransactionItem = ({ item, deleted = false }) => {
  const { activeItem } = useSidebar();
  const { setModal } = useModal();

  const [softDeleteTransaction, { data, loading, error }] = useMutation(
    SOFT_DELETE_MUTATION,
    { variables: { id: item.transaction.id } }
  );
  const [
    restoreTransaction,
    { data: restoreData, loading: restoreLoading, error: restoreError },
  ] = useMutation(RESTORE_DELETED_ITEM_MUTATION, {
    variables: { id: item.transaction.id },
  });

  const [
    deleteTransaction,
    { data: deleteData, loading: deleteLoading, error: deleteError },
  ] = useMutation(DELETED_TRANSACTION_MUTATION, {
    variables: { id: item.transaction.id },
  });

  // const type = activeItem?.__typename;
  const isBudgetItem = item.budgetItem?.__typename === 'BudgetItem';
  const isIncome = item.income?.__typename === 'Income';

  const handleSoftDelete = async () => {
    await softDeleteTransaction({
      update(cache) {
        cache.modify({
          id: cache.identify({
            __typename: 'Transaction',
            id: item.transaction.id,
          }),
          fields: {
            active(active) {
              return false;
            },
          },
        });
      },
    });

    toast.custom(
      (t) => (
        <StyledToast
          className={` ${
            t.visible ? 'animate-enter' : 'animate-leave'
          } flex items-center justify-between bg-white px-6 py-4 shadow-md rounded-md min-w-[200px] max-w-md transition-all`}
        >
          <div className="mr-4 text-sm font-medium">
            Deleted{' '}
            <span className="font-bold">'{item.transaction.description}'</span>
          </div>
          <div>
            <StyledButton
              type="button"
              onClick={() => {
                handleRestoreItem(t);
              }}
              className="bg-indigo-500 hover:bg-indigo-600 flex items-center"
              title="Restore Transaction"
            >
              <BiUndo className="h-4 w-4 mr-2" />
              Undo
            </StyledButton>
          </div>
        </StyledToast>
      ),
      { position: 'top-right' }
    );
  };
  const handleRestoreItem = async (t) => {
    await restoreTransaction({
      update(cache) {
        cache.modify({
          id: cache.identify({
            __typename: 'Transaction',
            id: item.transaction.id,
          }),
          fields: {
            active(active) {
              return true;
            },
          },
        });
      },
    });
    toast.dismiss(t.id);
  };
  const handlePermanentlyDeleteItem = async () => {
    await deleteTransaction({
      update(cache) {
        cache.evict({
          id: cache.identify({
            __typename: 'Transaction',
            id: item.transaction.id,
          }),
        });
        item.transaction.transactionItems?.map((result) =>
          cache.evict({
            id: cache.identify({
              __typename: 'TransactionItem',
              id: result.id,
            }),
          })
        );
        cache.gc();
      },
    });
  };
  return (
    <div
      key={`transactionItem-${item.id}-transaction-${item.transaction.id}`}
      className="group relative flex items-center my-4 last:mb-0 before:bg-gray-100 before:opacity-0 before:absolute before:-left-2 before:-top-2 before:-right-2 before:-bottom-2 before:transition-opacity before:rounded-md hover:before:opacity-100 z-0 after:absolute after:-bottom-2 after:left-0 after:w-full after:h-px after:bg-gray-200 last:after:hidden"
    >
      <div className="text-center text-[.625rem] uppercase z-10">
        <div>{formatDate(item.transaction?.date, 'MMM')}</div>
        <div>{formatDate(item.transaction?.date, 'D')}</div>
      </div>
      <div className="text-sm flex-grow mx-4 z-10">
        {item.transaction?.description}
      </div>
      <div
        className={`justify-self-end z-10 ${
          isIncome ? 'text-green-400 font-bold' : ''
        }`}
      >
        {isBudgetItem ? '-' : '+'}${formatNumber(item.amount)}
      </div>
      <span className="flex items-center justify-end  transition-opacity group-hover:opacity-100 opacity-0 absolute -top-2 -bottom-2 -right-2 -left-2 bg-white bg-opacity-60 rounded-md z-10 pr-4">
        {!deleted ? (
          <>
            <StyledButton
              type="StyledButton"
              onClick={() =>
                setModal({
                  visible: true,
                  action: 'Edit',
                  type: 'transaction',
                  item: item.transaction,
                })
              }
              className="bg-indigo-500 hover:bg-indigo-700"
            >
              Edit
            </StyledButton>

            <StyledButton
              type="button"
              onClick={handleSoftDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </StyledButton>
          </>
        ) : (
          <>
            <StyledButton
              type="button"
              onClick={handleRestoreItem}
              className="bg-indigo-500 hover:bg-indigo-600 flex items-center"
              title="Restore Transaction"
            >
              <BiUndo className="h-4 w-4" />
            </StyledButton>
            <StyledButton
              type="button"
              onClick={(e) => {
                setModal({
                  title: `Permanently Delete Transaction`,
                  btnText: 'Yes, delete it forever.',
                  message: 'Are you sure? This action cannot be undone.',
                  visible: true,
                  callback: handlePermanentlyDeleteItem,
                  type: 'error',
                });
              }}
              className="bg-red-500 hover:bg-red-600 flex items-center"
              title="Permanently Delete Transaction"
            >
              <RiFileShredLine className="h-4 w-4" />
            </StyledButton>
          </>
        )}
      </span>
    </div>
  );
};
