import { useMutation } from '@apollo/client';
import { FaRegTrashAlt } from 'react-icons/fa';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { Dropdown } from 'semantic-ui-react';
import formatNumber from '../../lib/formatNumber';
import { AddBudgetItem } from '../addBudgetItem';
import { CgUndo } from 'react-icons/cg';
import {
  BsSortAlphaDown,
  BsSortAlphaUp,
  BsSortAlphaUpAlt,
  BsSortNumericDown,
  BsSortNumericDownAlt,
} from 'react-icons/bs';
import { RiFileShredLine } from 'react-icons/ri';
import { useContext } from 'react';
import { BudgetContext } from '../budgetProvider';
import { AddPaycheck } from '../addPaycheck';
import { useSidebar } from '../sidebarStateProvider';
import { useModal } from '../modalStateProvider';
import { DELETE_CATEGORY_MUTATION } from './mutations';
import { StyledDropDown } from './styles';
import toast from 'react-hot-toast';
import { StyledButton, StyledToast } from '../transactionItem/styles';
import { BiUndo } from 'react-icons/bi';
import notLiveNotice from '../../lib/notLiveNotice';

export const EnvelopeFooter = ({ type }) => {
  const {
    ctx: { budget },
  } = useContext(BudgetContext);
  const { modal, setModal, resetModal } = useModal();

  const { setActiveItem } = useSidebar();

  let totalPlanned = 0;
  let totalReceived = 0;

  const { budgetItems, name } = type;

  const [deleteCategory, { data, error, loading }] = useMutation(
    DELETE_CATEGORY_MUTATION,
    { variables: { id: type.id, budgetId: budget.id } }
  );

  const handleDeleteCategory = async () => {
    await deleteCategory({
      update(cache, { data: { deleteCategory } }) {
        cache.modify({
          id: cache.identify({
            __typename: 'Budget',
            id: budget.id,
          }),
          fields: {
            categories(existingCategoryRef, { readField }) {
              return existingCategoryRef.filter(
                (categoryRef) => type.id !== readField('id', categoryRef)
              );
            },
          },
          optimistic: true,
        });
        cache.evict({
          id: cache.identify({
            __typename: 'Category',
            id: type.id,
          }),
        });
        cache.gc();
      },
    });
    resetModal();
    toast.custom(
      (t) => (
        <StyledToast
          className={` ${
            t.visible ? 'animate-enter' : 'animate-leave'
          } bg-white text-red-500 flex items-center justify-between px-6 py-4 shadow-md rounded-md min-w-[200px] max-w-md transition-all`}
        >
          <RiFileShredLine />
          <div className="ml-2 text-sm font-medium">
            Shredded <span className="font-bold">'{name}'</span> Envelope
          </div>
        </StyledToast>
      ),
      { position: 'top-right' }
    );
  };

  if (type.length) {
    totalPlanned = type?.reduce((total, income) => total + income.planned, 0);
  } else {
    totalPlanned = budgetItems?.reduce(
      (total, item) => total + item.plannedAmount,
      0
    );
  }

  return (
    <div className="grid grid-cols-2 pt-4 px-6">
      {type.length ? (
        <AddPaycheck>Add Paycheck</AddPaycheck>
      ) : (
        <AddBudgetItem parentEnvelope={type}>Add Item</AddBudgetItem>
      )}
      {/* <span className="flex items-center justify-end text-sm text-red-500 relative col-start-4 text-right cursor-pointer">
        <FaRegTrashAlt className="h-3 w-3 mr-2" />
        Delete Envelope
      </span> */}
      <span className="grid place-items-center text-sm text-gray-400 relative col-start-3 text-right cursor-pointer">
        <StyledDropDown
          trigger={
            <IoEllipsisHorizontal className="h-6 w-7 group-hover:text-indigo-500" />
          }
          icon={<></>}
          className=""
          floating
          selectOnBlur={false}
          onClick={() => setActiveItem(null)}
        >
          <Dropdown.Menu className="shadow-md border border-gray-200">
            <Dropdown.Item
              className="group"
              text={
                <span className="text-gray-600 group-hover:text-indigo-500 transition">
                  <BsSortAlphaDown className="h-5 w-5 mr-1" />
                  {/* <BsSortAlphaUpAlt className="h-5 w-5 mr-1" /> */}
                  <span>Sort By Name</span>
                </span>
              }
              onClick={() => notLiveNotice()}
            />
            <Dropdown.Item
              className="group"
              text={
                <span className="text-gray-600 group-hover:text-indigo-500 transition">
                  <BsSortNumericDown className="h-5 w-5 mr-1" />
                  {/* <BsSortNumericDownAlt className="h-5 w-5 mr-1" /> */}
                  <span>Sort By Planned</span>
                </span>
              }
              onClick={() => notLiveNotice()}
            />

            <Dropdown.Item
              className="group"
              text={
                <span className="text-gray-600 group-hover:text-indigo-500 transition">
                  <CgUndo className="h-5 w-5 mr-1" />
                  <span>Reset</span>
                </span>
              }
              onClick={() => notLiveNotice()}
            />
            {!type.length && (
              <Dropdown.Item
                className="group shred p-3 mt-2 bg-gray-50 hover:bg-red-500"
                onClick={() =>
                  setModal({
                    title: `Shred '${name}' Envelope`,
                    btnText: 'Yes, shred it.',
                    message: 'Are you sure? This action cannot be undone.',
                    visible: true,
                    type: 'error',
                    callback: handleDeleteCategory,
                  })
                }
                text={
                  <span className="flex text-red-500 items-center group-hover:text-white">
                    <RiFileShredLine className="h-4 w-4 mr-1" />
                    {/* <FaRegTrashAlt className="h-4 w-4 mr-1" /> */}
                    <span>Shred Envelope</span>
                  </span>
                }
              />
            )}
          </Dropdown.Menu>
        </StyledDropDown>
      </span>
      {/* <span className="col-start-3 text-right font-bold pr-2">
        ${formatNumber(totalPlanned)}
      </span>
      <span className="text-right font-bold ">
        ${formatNumber(totalReceived)}
      </span> */}
    </div>
  );
};
