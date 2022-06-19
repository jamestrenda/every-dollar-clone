import { useState, useContext, useEffect, createContext } from 'react';
import { gql, useMutation } from '@apollo/client';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { BudgetItem } from '../budgetItem';
import { BudgetConsumer, BudgetContext } from '../budgetProvider';
import { EnvelopeFooter } from '../envelopeFooter';
import { Paycheck } from '../paycheck';
import {
  MdDone,
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from 'react-icons/md';
import { DragHandle } from '../dragHandle';
import { FaMoneyBillAlt } from 'react-icons/fa';
import { BudgetItemInput } from '../budgetItemInput';
import useForm from '../../lib/useForm';
import { IoBookmark } from 'react-icons/io5';
import { StyledDropDown } from '../envelopeFooter/styles';
import { Dropdown } from 'semantic-ui-react';
import { useSidebar } from '../sidebarStateProvider';

export const UPDATE_INCOME_INDEXES_MUTATION = gql`
  mutation ($data: [BudgetItemIndexInput!]!) {
    updateIncomeIndexes(data: $data) {
      id
    }
  }
`;
export const UPDATE_BUDGET_ITEM_INDEXES_MUTATION = gql`
  mutation ($data: [BudgetItemIndexInput!]!) {
    updateBudgetItemIndexes(data: $data) {
      id
    }
  }
`;
export const UPDATE_CATEGORY_NAME_MUTATION = gql`
  mutation ($id: Int!, $name: String!) {
    updateCategoryName(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const Envelope = ({
  type = null,
  data = null,
  dragHandleProps = {},
  favorites = null,
}) => {
  const context = useContext(BudgetContext);
  const { setActiveItem } = useSidebar();
  const { inputs, handleChange } = useForm({
    [`category-${type.id}`]: type.name,
  });
  const [updateIncomeIndexes, { data: incomeIndexData }] = useMutation(
    UPDATE_INCOME_INDEXES_MUTATION
  );
  const [updateBudgetItemIndexes, { data: budgetItemIndexData }] = useMutation(
    UPDATE_BUDGET_ITEM_INDEXES_MUTATION
  );
  const [updateCategoryName] = useMutation(UPDATE_CATEGORY_NAME_MUTATION);

  const [categoryInputWidth, setCategoryInputWidth] = useState({
    id: type.id,
    width: '100%',
  });

  const isEnvelopeOpen = (id) => {
    return context?.ctx?.closedEnvelopes.indexOf(id);
  };
  const toggleEnvelope = async (envelopeId) => {
    const envelopes = [...context?.ctx?.closedEnvelopes];

    const envelopeIndex = envelopes.indexOf(envelopeId);

    if (envelopeIndex >= 0) {
      envelopes.splice(envelopeIndex, 1);
      await context?.ctx?.setClosedEnvelopes(envelopes);
    } else {
      const updatedEnvelopes = [...envelopes, envelopeId];
      await context?.ctx?.setClosedEnvelopes(updatedEnvelopes);
    }
  };
  const reorderBudgetItems = async (result) => {
    const { source, destination } = result;

    let list;

    const isIncome = source.droppableId.toLowerCase() === 'income';

    if (isIncome) {
      list = [...context?.ctx?.incomes];
    } else {
      list = [...context?.ctx?.categories];
    }

    let items;

    if (isIncome) {
      // get a copy of the budget items for the parent category
      items = [...context?.ctx?.incomes];
      // update actual order of elements in the array
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      // update the index prop on each category as well
      const updatedItems = context?.ctx?.updateItemIndexes(items);
      await context?.ctx?.setIncomes(updatedItems);

      // shape our mutation variable
      const indexData = updatedItems.map((item) => {
        const { id, index } = item;
        // our mutation is expecting an array of objects with two keys of 'id' and 'index'
        return {
          id,
          index,
        };
      });

      await updateIncomeIndexes({
        variables: {
          data: indexData,
        },
      });
    } else {
      // get the parent category for the dragged item
      // the droppableId must be a string, so we've structured it to
      // look like 'ParentCategoryId-{Int}'. Therefore, we can just grab the last
      // item in the string
      const parentId = parseInt(
        source.droppableId.substr(source.droppableId.length - 1)
      );

      // get the parent category object of the dragged item
      const parent = list?.filter((listItem) => listItem.id === parentId)[0];
      // get a copy of the budget items for the parent category
      items = [...parent?.budgetItems];
      // re-order the elements in the items array
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      // update the actual index props on each item
      const updatedItems = context?.ctx?.updateItemIndexes(items);

      // create a copy of the parent category
      const updatedParent = { ...parent };

      // update the budget items on the copy of the parent category
      updatedParent.budgetItems = [...updatedItems];

      // we already have the parent category index on the index prop, so
      // we'll remove the old category like so...
      list.splice(updatedParent.index, 1);

      // then we'll add the updated category in the same place as the old one
      list.splice(updatedParent.index, 0, updatedParent);
      await context?.ctx?.setCategories(list);

      // shape our mutation variable
      const indexData = updatedItems.map((item) => {
        const { id, index } = item;
        // our mutation is expecting an array of objects with two keys of 'id' and 'index'
        return {
          id,
          index,
        };
      });

      await updateBudgetItemIndexes({
        variables: {
          data: indexData,
        },
      });
    }
  };
  const handleOnDragEnd = async (result) => {
    const { source, destination } = result;
    // the item was dragged outside the drop context
    if (!destination) return;

    // the item was dragged to the same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    await reorderBudgetItems(result);
  };
  const handleUpdateCategoryName = async () => {
    await updateCategoryName({
      variables: {
        id: type.id,
        name: inputs[`category-${type.id}`],
      },
    });
  };
  useEffect(() => {
    localStorage.setItem(
      'closedEnvelopes',
      JSON.stringify(context?.ctx?.closedEnvelopes)
    );
  });
  useEffect(() => {
    if (type.id) {
      const width =
        document.querySelector(`#category-${type.id} + span`).clientWidth +
        'px';
      setCategoryInputWidth({ id: type.id, width });
    }
  }, [type]);

  return (
    <BudgetConsumer>
      {({ ctx: { incomes, showSpent, setShowSpent } }) => {
        return (
          <div
            className={` bg-white rounded-md shadow-md px-0 ${
              !type.length ? 'py-4' : 'py-6 '
            }`}
          >
            <div className="grid grid-cols-4 pl-2">
              <span className="group col-span-2 font-bold text-base flex items-center">
                <span className={`flex ${type.length ? 'pl-4' : ''}`}>
                  {!type?.length && (
                    <span
                      {...dragHandleProps}
                      className="grid place-items-center transition-opacity cursor-move -ml-2 opacity-0 group-hover:opacity-100"
                    >
                      <DragHandle />
                    </span>
                  )}
                  <span>
                    {type.length ? (
                      <span className="flex items-center cursor-default">
                        {favorites ? (
                          <>
                            <IoBookmark className="mr-2 h-5 w-5 text-indigo-500" />{' '}
                            Favorites
                          </>
                        ) : (
                          <>
                            <FaMoneyBillAlt className="mr-2 h-5 w-5 text-green-400" />{' '}
                            Income for {data}
                          </>
                        )}
                      </span>
                    ) : (
                      <span className="cursor-pointer -ml-1">
                        <BudgetItemInput
                          name={`category-${type.id}`}
                          value={inputs[`category-${type.id}`]}
                          handleChange={() => handleChange}
                          handleBlur={() => handleUpdateCategoryName}
                          handleFocus={(e) =>
                            e.target.setSelectionRange(0, e.target.value.length)
                          }
                          handleInput={(e) => {
                            const width =
                              e.target.nextSibling.offsetWidth + 10 + 'px';

                            setCategoryInputWidth({ id: type.id, width });
                          }}
                          style={{ width: categoryInputWidth.width }}
                          className={`hover:bg-transparent hover:cursor-pointer font-bold focus:bg-gray-50 focus:cursor-text w-28 max-w-xs focus:font-normal`}
                        />
                        <span className="min-w-[7rem] absolute inline-block -left-full p-2">
                          {inputs[`category-${type.id}`]}
                        </span>
                      </span>
                    )}
                  </span>
                </span>
                <span
                  className="grid place-items-center ml-3 cursor-pointer"
                  onClick={() => {
                    toggleEnvelope(type.length ? 0 : type.id);
                  }}
                >
                  {isEnvelopeOpen(type.length ? 0 : type.id) < 0 ? (
                    <MdOutlineKeyboardArrowUp className="w-5 h-5 text-indigo-500" />
                  ) : (
                    <MdOutlineKeyboardArrowDown className="w-5 h-5 text-indigo-500" />
                  )}
                </span>
              </span>
              <span className="grid items-center text-right text-sm text-gray-500 pr-6">
                Planned
              </span>
              <span className="grid items-center text-right text-sm text-gray-500 pr-6">
                {type.length ? (
                  'Received'
                ) : (
                  <span className="flex items-center justify-end cursor-pointer relative">
                    <span className="">
                      {showSpent ? 'Spent' : 'Remaining'}
                    </span>
                    <StyledDropDown
                      downward="true"
                      trigger={
                        <MdOutlineKeyboardArrowDown className="w-5 h-5 text-indigo-500 ml-1" />
                      }
                      icon={<></>}
                      className=""
                      floating
                      selectOnBlur={false}
                      onClick={() => setActiveItem(null)}
                    >
                      <Dropdown.Menu className="group shadow-md border border-gray-200">
                        <Dropdown.Item
                          text={
                            <div className=" flex items-center text-gray-600 hover:text-indigo-500 transition">
                              <MdDone
                                className={`h-5 w-5 mr-1 ${
                                  !showSpent
                                    ? 'opacity-100 text-indigo-500'
                                    : 'opacity-0'
                                }`}
                              />
                              <span
                                className={!showSpent ? 'text-indigo-500' : ''}
                              >
                                Remaining
                              </span>
                            </div>
                          }
                          onClick={() => setShowSpent(false)}
                        />
                        <Dropdown.Item
                          className="group text-left"
                          text={
                            <div className="text-gray-600 hover:text-indigo-500 transition flex items-center">
                              <MdDone
                                className={`h-5 w-5 mr-1 ${
                                  showSpent
                                    ? 'opacity-100 text-indigo-500'
                                    : 'opacity-0'
                                }`}
                              />{' '}
                              <span
                                className={showSpent ? 'text-indigo-500' : ''}
                              >
                                Spent
                              </span>
                            </div>
                          }
                          onClick={() => setShowSpent(true)}
                        />
                      </Dropdown.Menu>
                    </StyledDropDown>
                  </span>
                )}
              </span>
            </div>
            <div
              className=""
              style={{
                display:
                  isEnvelopeOpen(type.length ? 0 : type.id) < 0
                    ? 'block'
                    : 'none',
              }}
            >
              <div className="mt-4">
                {type.length ? (
                  <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="income">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {incomes?.map((paycheck) => (
                            <Draggable
                              key={paycheck.id}
                              draggableId={`paycheck-${paycheck.id}`}
                              index={paycheck.index}
                            >
                              {(provided, dragSnapshot) => (
                                <div
                                  {...provided.draggableProps}
                                  ref={provided.innerRef}
                                >
                                  <Paycheck
                                    income={paycheck}
                                    key={paycheck.id}
                                    dragHandleProps={{
                                      ...provided.dragHandleProps,
                                    }}
                                    isDragging={dragSnapshot.isDragging}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                ) : (
                  <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId={`category-${type.id}`}>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {type?.budgetItems &&
                            [...type?.budgetItems]
                              .sort((a, b) => a.index - b.index)
                              .map((item) => (
                                <Draggable
                                  key={item.id}
                                  draggableId={`budgetItem-${item.id}`}
                                  index={item.index}
                                >
                                  {(provided, dragSnapshot) => (
                                    <div
                                      {...provided.draggableProps}
                                      ref={provided.innerRef}
                                      className="group"
                                    >
                                      <BudgetItem
                                        isDragging={dragSnapshot.isDragging}
                                        item={item}
                                        key={item.id}
                                        dragHandleProps={{
                                          ...provided.dragHandleProps,
                                        }}
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </div>
              <EnvelopeFooter type={type} />
            </div>
          </div>
        );
      }}
    </BudgetConsumer>
  );
};
