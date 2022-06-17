import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { formatDate } from '../../lib/formatDate';
import { Button } from '../button';
import { Notice } from '../notice';
import { PageSpinner } from '../pageSpinner';
import { CREATE_BUDGET_MUTATION } from './mutations';
import { SINGLE_BUDGET_BY_MONTH_QUERY, SINGLE_BUDGET_QUERY } from './queries';

export const Budget = () => {
  const { data: session, status } = useSession();
  const loadingSession = status === 'loading';
  const currentDate = new Date();
  const currentMonth = formatDate(currentDate, 'MMMM');
  const [activeBudget, setActiveBudget] = useState(
    format(currentDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
  );
  console.log({ activeBudget });

  const [budget, { data: lazyData, loading: lazyLoading, error: lazyError }] =
    useLazyQuery(SINGLE_BUDGET_QUERY, {
      // onCompleted: async (data) => {
      //   if (data?.budget) {
      //     const sortCategoriesByIndex = await sortBy(data.budget.categories, [
      //       (category) => category.index,
      //     ]);
      //     const sortIncomesByIndex = sortBy(data.budget.incomes, [
      //       (income) => income.index,
      //     ]);
      //     setCategories(sortCategoriesByIndex);
      //     setIncomes(sortIncomesByIndex);
      //   }
      // },
    });
  const { data, loading, error } = useQuery(SINGLE_BUDGET_BY_MONTH_QUERY, {
    variables: { date: activeBudget },
    // onCompleted: async (data) => {
    //   if (data?.budget) {
    //     const sortCategoriesByIndex = await sortBy(data.budget.categories, [
    //       (category) => category.index,
    //     ]);
    //     const sortIncomesByIndex = sortBy(data.budget.incomes, [
    //       (income) => income.index,
    //     ]);
    //     setCategories(sortCategoriesByIndex);
    //     setIncomes(sortIncomesByIndex);
    //   }
    // },
  });

  const [
    createBudget,
    { loading: createBudgetLoading, error: createBudgetError },
  ] = useMutation(CREATE_BUDGET_MUTATION, {
    variables: { userId: session?.user?.id },
  });

  const handleCreateBudget = async (e) => {
    e.preventDefault();

    const {
      data: {
        createBudget: { id },
      },
    } = await createBudget();

    const res = await budget({ variables: { id } });
  };

  if (createBudgetLoading || loading) return <PageSpinner />;

  if (lazyData?.budget || data?.budgetByMonth) {
    const budgetById = lazyData?.budget;
    const budgetByMonth = data?.budgetByMonth;

    const budget = budgetById || budgetByMonth;

    const currentBudgetMonth = formatDate(budget.createdAt, 'MMMM');

    return (
      <>
        <div>
          {budget.id} {currentBudgetMonth}
        </div>
      </>
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
