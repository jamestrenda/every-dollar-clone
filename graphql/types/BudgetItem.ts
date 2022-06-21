import {
  nonNull,
  objectType,
  stringArg,
  extendType,
  intArg,
  list,
  arg,
  booleanArg,
} from 'nexus';
import { connectionFromArraySlice, cursorToOffset } from 'graphql-relay';
import { Category } from './Category';
import { TransactionItem } from './TransactionItem';
import { BudgetItemIndexInput } from './BudgetItemIndexInput';
import { Transaction } from './Transaction';

export const BudgetItem = objectType({
  name: 'BudgetItem',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.int('index');
    t.nonNull.string('name');
    t.nonNull.int('plannedAmount');
    t.nonNull.boolean('isFavorite');
    // t.field('favorite', {
    //   type: 'Favorite',
    //   async resolve(parent, _args, ctx) {
    //     return await ctx.prisma.budgetItem
    //       .findUnique({
    //         where: {
    //           id: parent.id,
    //         },
    //       })
    //       .favorite();
    //   },
    // });
    t.string('note');
    t.nonNull.field('parentCategory', {
      type: Category,
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.budgetItem
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .parentCategory();
      },
    });
    t.nonNull.int('parentCategoryId');
    t.list.field('transactions', {
      type: nonNull(TransactionItem),
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.budgetItem
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .transactions();
      },
    });
    t.dateTime('dueDate');
  },
});

export const ALL_BUDGET_ITEMS_QUERY = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('budgetItems', {
      type: nonNull(BudgetItem),
    });
  },
});
export const BUDGET_ITEM_TRANSACTION_QUERY = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('budgetItemTransactions', {
      type: nonNull(TransactionItem),
      args: { id: nonNull(intArg()) },
      resolve(_parent, args, ctx) {
        return ctx.prisma.transactionItem.findMany({
          where: {
            budgetItemId: args.id,
          },
        });
      },
    });
  },
});
export const SINGLE_BUDGET_ITEM_QUERY = extendType({
  type: 'Query',
  definition(t) {
    t.field('budgetItem', {
      type: BudgetItem,
      args: { id: nonNull(intArg()) },
      resolve(_parent, args, ctx) {
        return ctx.prisma.budgetItem.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});

export const UPDATE_BUDGET_ITEM_MUTATION = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('updateBudgetItem', {
      type: 'BudgetItem',
      args: {
        id: nonNull(intArg()),
        name: stringArg(),
        plannedAmount: intArg(),
        note: stringArg(),
        isFavorite: booleanArg(),
        dueDate: arg({ type: 'DateTime' }),
      },
      resolve(_parent, args, ctx) {
        return ctx.prisma.budgetItem.update({
          where: { id: args.id },
          data: {
            name: args.name,
            plannedAmount: args.plannedAmount,
            note: args.note,
            dueDate: args.dueDate,
            isFavorite: args.isFavorite,
          },
        });
      },
    });
  },
});

export const CREATE_BUDGET_ITEM_MUTATION = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createBudgetItem', {
      type: 'BudgetItem',
      args: {
        index: nonNull(intArg()),
        parentCategoryId: nonNull(intArg()),
      },
      resolve(_parent, args, ctx) {
        return ctx.prisma.budgetItem.create({
          data: {
            name: 'Untitled',
            index: args.index,
            plannedAmount: 0,
            parentCategoryId: args.parentCategoryId,
          },
        });
      },
    });
  },
});

export const DELETE_BUDGET_ITEM_MUTATION = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('deleteBudgetItem', {
      type: 'BudgetItem',
      args: {
        id: nonNull(intArg()),
        parentCategoryId: nonNull(intArg()),
        budgetId: nonNull(intArg()),
      },
      async resolve(_parent, args, ctx) {
        const deletedItem = await ctx.prisma.budgetItem.delete({
          where: { id: args.id },
          select: {
            id: true,
            index: true,
            parentCategoryId: true,
            isFavorite: true,
            name: true,
            plannedAmount: true,
          },
        });

        // find the incomes for the current budget
        // where the index is greater than the one we deleted
        const items = await ctx.prisma.budgetItem.findMany({
          where: {
            AND: [
              { parentCategory: { budgetId: args.budgetId } },
              { parentCategoryId: args.parentCategoryId },
              {
                index: {
                  gt: deletedItem.index,
                },
              },
            ],
          },
        });
        // need to decrement all the incomes that are of higher order
        for (const item of items) {
          const updateItemsIndex = await ctx.prisma.budgetItem.update({
            where: {
              id: item.id,
            },
            data: {
              index: item.index - 1,
            },
          });
        }

        return deletedItem;
      },
    });
  },
});

export const UPDATE_BUDGET_ITEM_INDEXES_MUTATION = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('updateBudgetItemIndexes', {
      type: 'BudgetItem',
      args: {
        data: nonNull(list(nonNull(BudgetItemIndexInput))),
      },
      async resolve(_parent, args, ctx) {
        // shape the data here?
        let updateItem;
        for (const item of args.data) {
          updateItem = await ctx.prisma.budgetItem.update({
            where: {
              id: item.id,
            },
            data: {
              index: item.index,
            },
          });
        }

        return updateItem;
      },
    });
  },
});
