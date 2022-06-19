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
import { TransactionItem } from './TransactionItem';
import { BudgetItemIndexInput } from './BudgetItemIndexInput';
import { Budget } from './Budget';

export const Debt = objectType({
  name: 'Debt',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.int('index');
    t.nonNull.string('name');
    t.nonNull.int('plannedAmount');
    t.nonNull.int('balance');
    t.nonNull.boolean('isFavorite');
    t.nonNull.int('minimumPayment');
    t.string('note');
    t.nonNull.field('budget', {
      type: nonNull(Budget),
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.debt
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .budget();
      },
    });
    t.nonNull.int('budgetId');
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
    t.dateTime('createdAt');
    t.dateTime('updatedAt');
  },
});

export const ALL_DEBTS_QUERY = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('debts', {
      type: nonNull(Debt),
    });
  },
});

export const SINGLE_DEBT_ITEM_QUERY = extendType({
  type: 'Query',
  definition(t) {
    t.field('debt', {
      type: Debt,
      args: { id: nonNull(intArg()) },
    });
  },
});

export const UPDATE_DEBT_ITEM_MUTATION = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('updateDebt', {
      type: 'Debt',
      args: {
        id: nonNull(intArg()),
        balance: nonNull(intArg()),
        minimumPayment: nonNull(intArg()),
        isFavorite: nonNull(booleanArg()),
        name: stringArg(),
        plannedAmount: intArg(),
        note: stringArg(),
        dueDate: arg({ type: 'DateTime' }),
      },
      resolve(_parent, args, ctx) {
        return ctx.prisma.debt.update({
          where: { id: args.id },
          data: {
            balance: args.balance,
            minimumPayment: args.minimumPayment,
            isFavorite: args.isFavorite,
            name: args.name,
            plannedAmount: args.plannedAmount,
            note: args.note,
            dueDate: args.dueDate,
          },
        });
      },
    });
  },
});

export const CREATE_DEBT_ITEM_MUTATION = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createDebt', {
      type: 'Debt',
      args: {
        index: nonNull(intArg()),
        budgetId: nonNull(intArg()),
      },
      resolve(_parent, args, ctx) {
        return ctx.prisma.debt.create({
          data: {
            name: 'Untitled',
            index: args.index,
            budgetId: args.budgetId,
            plannedAmount: 0,
            balance: 0,
            minimumPayment: 0,
          },
        });
      },
    });
  },
});

export const DELETE_DEBT_MUTATION = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('deleteDebt', {
      type: 'Debt',
      args: {
        id: nonNull(intArg()),
      },
      resolve(_parent, args, ctx) {
        return ctx.prisma.debt.delete({
          where: { id: args.id },
        });
      },
    });
  },
});

export const UPDATE_DEBT_INDEXES_MUTATION = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('updateDebtIndexes', {
      type: 'Debt',
      args: {
        data: nonNull(list(nonNull(BudgetItemIndexInput))),
      },
      async resolve(_parent, args, ctx) {
        // shape the data here?
        let updateDebt;
        for (const debt of args.data) {
          updateDebt = await ctx.prisma.debt.update({
            where: {
              id: debt.id,
            },
            data: {
              index: debt.index,
            },
          });
        }

        return updateDebt;
      },
    });
  },
});
