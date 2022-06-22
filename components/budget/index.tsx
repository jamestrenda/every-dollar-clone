import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { format } from 'date-fns';
import { sortBy } from 'lodash';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Toaster } from 'react-hot-toast';
import { formatDate } from '../../lib/formatDate';
import { AddTransactionButton } from '../addTransactionButton';
import { BudgetFooter } from '../budgetFooter';
import { BudgetHeader } from '../budgetHeader';
import { BudgetProvider } from '../budgetProvider';
import { BudgetSidebar } from '../budgetSidebar';
import { Button } from '../button';
import { CreateEnvelope } from '../createEnvelope';
import { Envelope } from '../envelope';
import { Notice } from '../notice';
import { PageSpinner } from '../pageSpinner';
import { PageTitle } from '../pageTitle';
import {
  CREATE_BUDGET_MUTATION,
  UPDATE_CATEGORY_INDEXES_MUTATION,
} from './mutations';
import { SINGLE_BUDGET_QUERY } from './queries';

export const Budget = () => {
  const { data: session, status } = useSession();
  const loadingSession = status === 'loading';
  const currentDate = new Date();
  const currentMonth = formatDate(currentDate, 'MMMM');
  const currentYear = formatDate(currentDate, 'y');
  const [activeBudget, setActiveBudget] = useState(null);
  const [activeBudgetId, setActiveBudgetId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [closedEnvelopes, setClosedEnvelopes] = useState([]);
  const [showSpent, setShowSpent] = useState(false);
  const [everyDollarBudget, setEveryDollarBudget] = useState(false);

  const { data, loading, error } = useQuery(SINGLE_BUDGET_QUERY, {
    variables: {
      userId: session?.user.id,
      month: formatDate(currentDate, 'M'),
      year: currentYear,
    },
    onCompleted: async (data) => {
      if (data?.budget) {
        setActiveBudgetId(data.budget.id);
        const sortCategoriesByIndex = await sortBy(data.budget?.categories, [
          (category) => category.index,
        ]);
        const sortIncomesByIndex = sortBy(data.budget?.incomes, [
          (income) => income.index,
        ]);
        setCategories(sortCategoriesByIndex);
        setIncomes(sortIncomesByIndex);
      }
    },
  });

  const [
    createBudget,
    { loading: createBudgetLoading, error: createBudgetError },
  ] = useMutation(CREATE_BUDGET_MUTATION, {
    variables: { userId: session?.user?.id },
    refetchQueries: [
      {
        query: SINGLE_BUDGET_QUERY,
        variables: {
          userId: session.user.id,
          month: formatDate(currentDate, 'M'),
          year: currentYear,
        },
      },
    ],
  });

  const [updateCategoryIndexes, { data: budgetItemIndexData }] = useMutation(
    UPDATE_CATEGORY_INDEXES_MUTATION
  );

  const updateItemIndexes = (items) => {
    return items.map((item, i) => {
      const updatedItem = { ...item };
      updatedItem.index = i;
      return updatedItem;
    });
  };
  const handleOnDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const items = [...categories];

    // update actual order of elements in the array
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // update the index prop on each category as well
    const updatedItems = updateItemIndexes(items);

    await setCategories(updatedItems);

    // persist changes to the db...
    const indexData = updatedItems.map((item) => {
      const { id, index } = item;
      // our mutation is expecting an array of objects with two keys of 'id' and 'index'
      return {
        id,
        index,
      };
    });

    await updateCategoryIndexes({
      variables: {
        data: indexData,
      },
    });
  };
  const handleCreateBudget = async (e) => {
    e.preventDefault();

    const {
      data: {
        createBudget: { id },
      },
    } = await createBudget();

    // const res = await budget({ variables: { id } });
  };
  const toggleSpent = () => {
    setShowSpent(!showSpent);
  };

  // re-instate local storage values into our UI
  // TODO: probably need to associated this with a budget id
  useEffect(() => {
    const localStorageRef = localStorage.getItem('closedEnvelopes');
    if (localStorageRef) {
      setClosedEnvelopes(JSON.parse(localStorageRef));
    }
  }, []);
  useEffect(() => {
    // set active budget
    if (!activeBudget) {
    }
  }, [data]);

  if (createBudgetLoading || loading) return <PageSpinner />;

  if (data?.budget) {
    const { budget } = data;

    const ctx = {
      budget,
      categories,
      setCategories,
      incomes,
      setIncomes,
      updateItemIndexes,
      closedEnvelopes,
      setClosedEnvelopes,
      showSpent,
      setShowSpent,
      toggleSpent,
      everyDollarBudget,
      setEveryDollarBudget,
    };

    return (
      <BudgetProvider value={ctx}>
        <PageTitle title={`${currentMonth} Budget`} />
        <BudgetHeader />
        <div className="grid gap-6 grid-cols-2 lg:grid-cols-3">
          <div className="col-span-2">
            <div className="grid gap-6 mt-6 pb-10">
              <Envelope type={incomes} data={currentMonth} />
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="envelopes" type="parent">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {categories.map((category, index) => (
                        <Draggable
                          key={category.id}
                          draggableId={`category-${category.id}`}
                          index={category.index}
                        >
                          {(provided, dragSnapshot) => (
                            <div
                              className={`${index > 0 ? 'mt-6' : ''} ${
                                dragSnapshot.isDragging
                                  ? 'rounded-md drop-shadow-xl border border-gray-100'
                                  : ''
                              }`}
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                            >
                              <Envelope
                                type={category}
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
              <CreateEnvelope id={budget.id} />
            </div>
            <BudgetFooter />
          </div>
          <BudgetSidebar />
          <AddTransactionButton
            context={ctx}
            className="fixed bottom-6 right-6 z-10"
          />
        </div>
        <Toaster containerClassName="mx-8 mt-4 toast" />
      </BudgetProvider>
    );
  }
  return (
    <div className="grid">
      <div className="grid place-items-center min-h-screen">
        <div className="text-center max-w-[50rem]">
          {createBudgetError && (
            <Notice type="error" message={error?.message} />
          )}
          <h2 className="text-3xl font-black">
            We'll help you plan a budget that you can commit to, and one that
            achieves your goals.
          </h2>
          <p className="mt-4 mb-8">
            Let's get started with {currentMonth}'s budget.
          </p>
          <form onSubmit={handleCreateBudget}>
            <Button type="submit">Create My First Budget</Button>
          </form>
        </div>
      </div>
    </div>
  );
};
