import {
  nonNull,
  objectType,
  stringArg,
  extendType,
  intArg,
  list,
} from 'nexus';
import { connectionFromArraySlice, cursorToOffset } from 'graphql-relay';
import { Budget } from './Budget';
import { TransactionItem } from './TransactionItem';
import { BudgetItemIndexInput } from './BudgetItemIndexInput';

export const Income = objectType({
  name: 'Income',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.int('index');
    t.nonNull.string('source');
    t.nonNull.int('planned');
    t.string('note');
    t.nonNull.int('budgetId');
    t.nonNull.field('budget', {
      type: Budget,
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.income
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .budget();
      },
    });
    t.list.field('transactions', {
      type: nonNull(TransactionItem),
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.income
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .transactions();
      },
    });
  },
});

export const ALL_INCOMES_QUERY = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('incomes', {
      type: nonNull(Income),
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.income.findMany();
      },
    });
  },
});

export const SINGLE_INCOME_QUERY = extendType({
  type: 'Query',
  definition(t) {
    t.field('income', {
      type: Income,
      args: { id: nonNull(intArg()) },
      async resolve(_parent, args, ctx) {
        return await ctx.prisma.income.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});

// update Income
export const UPDATE_INCOME_MUTATION = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('updateIncome', {
      type: 'Income',
      args: {
        id: nonNull(intArg()),
        index: intArg(),
        source: stringArg(),
        planned: intArg(),
        note: stringArg(),
      },
      resolve(_parent, args, ctx) {
        return ctx.prisma.income.update({
          where: { id: args.id },
          data: {
            index: args.index,
            source: args.source,
            planned: args.planned,
            note: args.note,
          },
        });
      },
    });
  },
});
export const CREATE_INCOME_MUTATION = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createIncome', {
      type: 'Income',
      args: {
        index: nonNull(intArg()),
        budgetId: nonNull(intArg()),
      },
      resolve(_parent, args, ctx) {
        return ctx.prisma.income.create({
          data: {
            source: 'Untitled',
            index: args.index,
            planned: 0,
            budgetId: args.budgetId,
          },
        });
      },
    });
  },
});
export const DELETE_INCOME_MUTATION = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('deleteIncome', {
      type: 'Income',
      args: {
        id: nonNull(intArg()),
        budgetId: nonNull(intArg()),
      },
      async resolve(_parent, args, ctx) {
        // delete the income
        const deletedItem = await ctx.prisma.income.delete({
          where: { id: args.id },
          select: {
            id: true,
            index: true,
            budgetId: true,
            planned: true,
            source: true,
          },
        });

        // find the incomes for the current budget
        // where the index is greater than the one we deleted
        const incomes = await ctx.prisma.income.findMany({
          where: {
            AND: [
              { budgetId: args.budgetId },
              {
                index: {
                  gt: deletedItem.index,
                },
              },
            ],
          },
        });
        // need to decrement all the incomes that are of higher order
        for (const income of incomes) {
          const updateIncomeIndex = await ctx.prisma.income.update({
            where: {
              id: income.id,
            },
            data: {
              index: income.index - 1,
            },
          });
        }

        return deletedItem;
      },
    });
  },
});

export const UPDATE_INCOME_INDEXES_MUTATION = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('updateIncomeIndexes', {
      type: 'Income',
      args: {
        data: nonNull(list(nonNull(BudgetItemIndexInput))),
      },
      async resolve(_parent, args, ctx) {
        // shape the data here?
        let updateIncome;
        for (const income of args.data) {
          updateIncome = await ctx.prisma.income.update({
            where: {
              id: income.id,
            },
            data: {
              index: income.index,
            },
          });
        }

        return updateIncome;
      },
    });
  },
});

// update all Incomes
// export const UPDATE_INCOME_INDEX_MUTATION = extendType({
//   type: 'Mutation',
//   definition(t) {
//     t.nonNull.field('updateIncomeIndex', {
//       type: 'Income',
//       args: {
//         id: nonNull(intArg()),
//         index: intArg(),
//         source: stringArg(),
//         planned: intArg(),
//       },
//       resolve(_parent, args, ctx) {
//         return ctx.prisma.income.update({
//           where: { id: args.id },
//           data: {
//             index: args.index,
//             source: args.source,
//             planned: args.planned,
//           },
//         });
//       },
//     });
//   },
// });
