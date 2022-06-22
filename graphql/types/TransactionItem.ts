import { nonNull, objectType, stringArg, extendType, intArg } from 'nexus';
import { connectionFromArraySlice, cursorToOffset } from 'graphql-relay';
import { BudgetItem } from './BudgetItem';
import { Transaction } from './Transaction';
import { Income } from './Income';
import { Debt } from './Debt';

export const TransactionItem = objectType({
  name: 'TransactionItem',
  description:
    'A TransactionItem is a child of the Transaction type. TransactionItems can have siblings, meaning that multiple TransactionItems may have an identical Transaction parent. A TransactionItem will either connect to one BudgetItem or one Income, but not both. Since they cannot both be required, they must both be optional fields.',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.int('amount');
    t.int('budgetItemId');
    t.field('budgetItem', {
      type: BudgetItem,
      description:
        'A BudgetItem represents a line item under the Category type. A BudgetItem will have zero or more TranscactionItems.',
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.transactionItem
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .budgetItem();
      },
    });
    t.int('incomeId');
    t.field('income', {
      type: Income,
      description: 'Income will have zero or more TranscactionItems.',
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.transactionItem
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .income();
      },
    });
    t.int('debtId');
    t.field('debt', {
      type: Debt,
      description: 'Debt will have zero or more TranscactionItems.',
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.transactionItem
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .debt();
      },
    });
    t.nonNull.int('transactionId');
    t.nonNull.field('transaction', {
      type: Transaction,
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.transactionItem
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .transaction();
      },
    });
    t.dateTime('createdAt');
    t.dateTime('updatedAt');
  },
});

export const ALL_TRANSACTION_ITEMS_QUERY = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('transactionItems', {
      type: nonNull(TransactionItem),
    });
  },
});

export const SINGLE_TRANSACTION_ITEM_QUERY = extendType({
  type: 'Query',
  definition(t) {
    t.field('transactionItem', {
      type: TransactionItem,
      args: { id: nonNull(intArg()) },
    });
  },
});
