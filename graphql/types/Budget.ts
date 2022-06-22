import {
  nonNull,
  objectType,
  stringArg,
  extendType,
  intArg,
  arg,
  list,
  mutationField,
  queryField,
} from 'nexus';
import { formatDate } from '../../lib/formatDate';
import { Debt } from './Debt';
// import { Favorite } from './Favorite';
import { Income } from './Income';
import { Transaction } from './Transaction';
import { User } from './User';
import { Category } from './Category';

export const Budget = objectType({
  name: 'Budget',
  definition(t) {
    t.int('id');
    t.list.field('incomes', {
      type: Income,
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.budget
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .incomes();
      },
    });
    t.list.field('debts', {
      type: Debt,
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.budget
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .debts();
      },
    });
    // t.list.field('favorites', {
    //   type: Favorite,
    //   async resolve(parent, _args, ctx) {
    //     return await ctx.prisma.budget
    //       .findUnique({
    //         where: {
    //           id: parent.id,
    //         },
    //       })
    //       .favorites();
    //   },
    // });
    t.nonNull.field('user', {
      type: User,
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.budget
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .user();
      },
    });
    t.int('userId');
    t.list.field('categories', {
      type: Category,
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.budget
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .categories();
      },
    });
    t.list.field('transactions', {
      type: Transaction,
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.budget
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .transactions();
      },
    });
    t.dateTime('createdAt');
    t.dateTime('updatedAt');
    t.string('month');
    t.string('year');
  },
});

export const CREATE_BUDGET_MUTATION = mutationField('createBudget', {
  type: Budget,
  args: {
    userId: nonNull(intArg()),
  },
  async resolve(_parent, args, ctx) {
    // const currentCategories = await ctx.prisma.budget
    //   .findUnique({
    //     where: {
    //       id: args.budgetId,
    //     },
    //   })
    //   .categories();

    const currentDate = new Date();
    const month = formatDate(currentDate, 'M');
    const year = formatDate(currentDate, 'yyyy');

    return await ctx.prisma.budget.create({
      data: {
        userId: args.userId,
        month,
        year,
        incomes: {
          create: [
            {
              index: 0,
              source: 'Paycheck 1',
            },
            {
              index: 1,
              source: 'Paycheck 2',
            },
          ],
        },
        categories: {
          create: [
            {
              index: 0,
              name: 'Giving',
              budgetItems: {
                create: [
                  {
                    index: 0,
                    name: 'Church',
                    plannedAmount: 0,
                  },
                  {
                    index: 1,
                    name: 'Charity',
                    plannedAmount: 0,
                  },
                ],
              },
            },
            {
              index: 1,
              name: 'Savings',
              budgetItems: {
                create: [
                  {
                    index: 0,
                    name: 'Emergency Fund',
                    plannedAmount: 0,
                  },
                  {
                    index: 1,
                    name: '401(k)',
                    plannedAmount: 0,
                  },
                  {
                    index: 2,
                    name: 'Roth IRA',
                    plannedAmount: 0,
                  },
                ],
              },
            },
            {
              index: 2,
              name: 'Housing',
              budgetItems: {
                create: [
                  {
                    index: 0,
                    name: 'Mortgage/Rent',
                    plannedAmount: 0,
                  },
                  {
                    index: 1,
                    name: 'Water',
                    plannedAmount: 0,
                  },
                  {
                    index: 2,
                    name: 'Natural Gas',
                    plannedAmount: 0,
                  },
                  {
                    index: 3,
                    name: 'Electricity',
                    plannedAmount: 0,
                  },
                  {
                    index: 4,
                    name: 'Cable/Internet',
                    plannedAmount: 0,
                  },
                  {
                    index: 5,
                    name: 'Trash',
                    plannedAmount: 0,
                  },
                ],
              },
            },
            {
              index: 3,
              name: 'Transportation',
              budgetItems: {
                create: [
                  {
                    index: 0,
                    name: 'Gas',
                    plannedAmount: 0,
                  },
                  {
                    index: 1,
                    name: 'Maintenance',
                    plannedAmount: 0,
                  },
                ],
              },
            },
            {
              index: 4,
              name: 'Food',
              budgetItems: {
                create: [
                  {
                    index: 0,
                    name: 'Groceries',
                    plannedAmount: 0,
                  },
                  {
                    index: 1,
                    name: 'Restaurants',
                    plannedAmount: 0,
                  },
                  {
                    index: 2,
                    name: 'Pets',
                    plannedAmount: 0,
                  },
                ],
              },
            },
            {
              index: 5,
              name: 'Personal',
              budgetItems: {
                create: [
                  {
                    index: 0,
                    name: 'Clothing',
                    plannedAmount: 0,
                  },
                  {
                    index: 1,
                    name: 'Phone',
                    plannedAmount: 0,
                  },
                  {
                    index: 2,
                    name: 'Fun Money',
                    plannedAmount: 0,
                  },
                  {
                    index: 3,
                    name: 'Hair/Cosmetics',
                    plannedAmount: 0,
                  },
                  {
                    index: 4,
                    name: 'Subscriptions',
                    plannedAmount: 0,
                  },
                ],
              },
            },
            {
              index: 6,
              name: 'Lifestyle',
              budgetItems: {
                create: [
                  {
                    index: 0,
                    name: 'Child Care',
                    plannedAmount: 0,
                  },
                  {
                    index: 1,
                    name: 'Pet Care',
                    plannedAmount: 0,
                  },
                  {
                    index: 2,
                    name: 'Entertainment',
                    plannedAmount: 0,
                  },
                  {
                    index: 3,
                    name: 'Miscellaneous',
                    plannedAmount: 0,
                  },
                ],
              },
            },
            {
              index: 7,
              name: 'Health',
              budgetItems: {
                create: [
                  {
                    index: 0,
                    name: 'Gym',
                    plannedAmount: 0,
                  },
                  {
                    index: 1,
                    name: 'Medicine/Vitamins',
                    plannedAmount: 0,
                  },
                  {
                    index: 2,
                    name: 'Doctor Visits',
                    plannedAmount: 0,
                  },
                ],
              },
            },
            {
              index: 8,
              name: 'Insurance',
              budgetItems: {
                create: [
                  {
                    index: 0,
                    name: 'Life Insurance',
                    plannedAmount: 0,
                  },
                  {
                    index: 1,
                    name: 'Health Insurance',
                    plannedAmount: 0,
                  },
                  {
                    index: 2,
                    name: 'Auto Insurance',
                    plannedAmount: 0,
                  },
                  {
                    index: 3,
                    name: 'Homeowner/Renter',
                    plannedAmount: 0,
                  },
                  {
                    index: 4,
                    name: 'Identity Theft',
                    plannedAmount: 0,
                  },
                ],
              },
            },
          ],
        },
        debts: {
          create: [
            {
              index: 0,
              name: 'Credit Card',
              balance: 0,
              plannedAmount: 0,
            },

            {
              index: 1,
              name: 'Car Payment',
              balance: 0,
              plannedAmount: 0,
            },
            {
              index: 2,
              name: 'Student Loan',
              balance: 0,
              plannedAmount: 0,
            },
            {
              index: 3,
              name: 'Medical Bill',
              balance: 0,
              plannedAmount: 0,
            },
            {
              index: 4,
              name: 'Personal Loan',
              balance: 0,
              plannedAmount: 0,
            },
          ],
        },
      },
    });
  },
});

export const ALL_BUDGETS_QUERY = queryField('budgets', {
  type: list(nonNull(Budget)),
  async resolve(_parent, _args, ctx) {
    return await ctx.prisma.budget.findMany();
  },
});

export const SINGLE_BUDGET_QUERY = queryField('budget', {
  type: Budget,
  args: { userId: intArg(), month: stringArg(), year: stringArg() },
  async resolve(_parent, args, ctx) {
    // do something with the date

    // 1. get the month and year of the date passed in

    // const month = formatDate(currentDate, 'M');
    // const year = formatDate(currentDate, 'yyyy');

    // 2. find the budget with a createdAt value that within the same month and year
    //    in other words, less then or equal to the provided date
    //    AND
    //    greater than or equal to the first day of provided month
    return await ctx.prisma.budget.findFirst({
      where: {
        AND: [
          { userId: args.userId },
          { month: args.month },
          {
            year: args.year,
          },
        ],
      },
    });
  },
});

export const DELETE_BUDGET_MUTATION = mutationField('deleteBudget', {
  type: Budget,
  args: {
    id: nonNull(intArg()),
  },
  async resolve(_parent, args, ctx) {
    return await ctx.prisma.budget.delete({
      where: {
        id: args.id,
      },
    });
  },
});

export const RESET_BUDGET_MUTATION = mutationField('resetBudget', {
  type: Budget,
  args: { id: nonNull(intArg()) },
  async resolve(_parent, args, ctx) {
    // 1. find all transactions
    const transactions = await ctx.prisma.transaction.findMany({
      where: {
        budgetId: args.id,
      },
      select: {
        id: true,
        transactionItems: true,
        budget: true,
      },
    });
    // 2. disconnect them from their categories
    const disconnectTransactionItems = transactions.map((transaction) =>
      transaction.transactionItems.map(
        async (transactionItem) =>
          await ctx.prisma.transactionItem.update({
            where: { id: transactionItem.id },
            data: {
              budgetItem: {
                disconnect: true,
              },
              income: {
                disconnect: true,
              },
              debt: {
                disconnect: true,
              },
            },
          })
      )
    );

    // 3. get categories and reset their data
    const categories = await ctx.prisma.category.findMany({
      where: {
        budgetId: args.id,
      },
      select: {
        id: true,
        budgetItems: true,
      },
    });

    // 3.1 - only reset the planned amounts for BudgetItems, Incomes, and Debts
    //       everything else gets preserved as is
    const resetPlannedAmounts = categories.map((category) =>
      category.budgetItems?.map(
        async (budgetItem) =>
          await ctx.prisma.budgetItem.update({
            where: { id: budgetItem.id },
            data: {
              plannedAmount: 0,
            },
          })
      )
    );

    const resetIncomes = await ctx.prisma.income.updateMany({
      where: {
        budgetId: args.id,
      },
      data: {
        planned: 0,
      },
    });
    // TODO: we'll come back to this once they're added to the front end
    //  const resetDebt = await ctx.prisma.debt.updateMany({
    //    where: {
    //      budgetId: args.id,
    //    },
    //    data: {
    //      planned: 0,
    //    },
    //  });

    return transactions[0].budget;
  },
});
