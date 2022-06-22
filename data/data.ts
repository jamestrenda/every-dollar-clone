const { Prisma } = require('@prisma/client');

export const budgets = [
  {
    userId: 1,
  },
];
export const incomes = [
  {
    index: 0,
    source: 'Freelancing',
    planned: 100000,
    budgetId: 1,
  },
  {
    index: 1,
    source: 'Uber',
    planned: 50000,
    budgetId: 1,
  },
  {
    index: 0,
    source: 'Full-Time Web Development',
    planned: 600000,
    budgetId: 1,
  },
  {
    index: 3,
    source: "Spouse's Income",
    planned: 400000,
    budgetId: 1,
  },
];
export const categories = [
  {
    index: 0,
    name: 'Giving',
    budgetId: 1,
  },
  {
    index: 1,
    name: 'Savings',
    budgetId: 1,
  },
  {
    index: 0,
    name: 'Housing',
    budgetId: 1,
  },
  {
    index: 3,
    name: 'Personal',
    budgetId: 1,
  },
];

export const budgetItems = [
  {
    index: 0,
    name: 'Mortgage',
    plannedAmount: 80000,
    parentCategoryId: 1,
  },
  {
    index: 1,
    name: 'Utilities',
    plannedAmount: 20000,
    parentCategoryId: 1,
  },
  {
    index: 2,
    name: 'Repairs',
    plannedAmount: 5000,
    parentCategoryId: 3,
  },
  {
    index: 3,
    name: 'Decor',
    plannedAmount: 5000,
    parentCategoryId: 3,
  },
  {
    index: 4,
    name: 'Yard',
    plannedAmount: 15000,
    parentCategoryId: 3,
  },
];

export const transactions = [
  {
    budgetId: 1,
    description: 'New American Mortgage',
    total: 80000,
    userId: 1,
  },
  {
    budgetId: 1,
    description: 'Freelance project',
    total: 50000,
    userId: 1,
  },
  {
    budgetId: 1,
    description: 'Paycheck 1',
    total: 300000,
    userId: 1,
  },
];
export const transactionItems = [
  {
    amount: 50000,
    incomeId: 1,
    transactionId: 2,
  },
  {
    amount: 300000,
    incomeId: 3,
    transactionId: 3,
  },
  {
    amount: 80000,
    budgetItemId: 1,
    transactionId: 1,
  },
];
