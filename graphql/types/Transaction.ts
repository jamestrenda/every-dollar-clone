import {
  nonNull,
  objectType,
  stringArg,
  extendType,
  intArg,
  arg,
  list,
  queryField,
  mutationField,
} from 'nexus';
import { connectionFromArraySlice, cursorToOffset } from 'graphql-relay';
import { differenceBy } from 'lodash';
import { Budget } from './Budget';
import { TransactionItem } from './TransactionItem';
import { TransactionItemUpsertInput } from './TransactionItemUpsertInput';
import { User } from './User';

export const Transaction = objectType({
  name: 'Transaction',
  description:
    'A Transaction will have one or more TransactionItems. The total field should be the sum of the TransactionItem amount fields.',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('description');
    t.nonNull.int('total');
    t.string('note');
    t.string('checkNo');
    t.nonNull.boolean('active');
    t.nonNull.int('budgetId');
    t.nonNull.field('budget', {
      type: Budget,
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.transaction
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .budget();
      },
    });
    t.nonNull.list.field('transactionItems', {
      type: TransactionItem,
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.transaction
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .transactionItems();
      },
    });
    t.nonNull.dateTime('date');
    t.dateTime('updatedAt');
    t.nonNull.field('user', {
      type: User,
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.transaction
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .user();
      },
    });
    t.nonNull.int('userId');
  },
});

export const SINGLE_TRANSACTION_QUERY = queryField('transaction', {
  type: nonNull(Transaction),
  args: { id: nonNull(intArg()) },
  async resolve(_parent, args, ctx) {
    return await ctx.prisma.transaction.findUnique({
      where: { id: args.id },
    });
  },
});

export const CREATE_TRANSACTION_MUTATION = mutationField('createTransaction', {
  type: Transaction,
  args: {
    budgetId: nonNull(intArg()),
    description: nonNull(stringArg()),
    total: nonNull(intArg()),
    note: stringArg(),
    checkNo: stringArg(),
    date: nonNull(arg({ type: 'DateTime' })),
    transactionItems: nonNull(list(nonNull(TransactionItemUpsertInput))),
    userId: nonNull(intArg()),
  },
  async resolve(_parent, args, ctx) {
    const create = args.transactionItems.map((item) => {
      delete item.id; // delete it so we can cleanly spread in item to upsert
      return {
        ...item,
      };
    });

    return ctx.prisma.transaction.create({
      data: {
        description: args.description,
        total: args.total,
        note: args.note,
        checkNo: args.checkNo,
        date: args.date,
        transactionItems: {
          create,
        },
        userId: args.userId,
        budgetId: args.budgetId,
      },
    });
  },
});

export const UPDATE_TRANSACTION_MUTATION = mutationField('updateTransaction', {
  type: Transaction,
  args: {
    id: nonNull(intArg()),
    budgetId: intArg(),
    description: nonNull(stringArg()),
    total: nonNull(intArg()),
    note: stringArg(),
    checkNo: stringArg(),
    date: nonNull(arg({ type: 'DateTime' })),
    transactionItems: nonNull(list(nonNull(TransactionItemUpsertInput))),
  },
  async resolve(_parent, args, ctx) {
    // store the existing transaction items so we can deteremine if we need to delete
    const existingTransactionItems = await ctx.prisma.transactionItem.findMany({
      where: {
        transactionId: args.id,
      },
    });

    // return the ones we will delete
    const itemsToDelete = differenceBy(
      existingTransactionItems,
      args.transactionItems,
      'id'
    );

    const deleteThesIDs = itemsToDelete.map((item) => ({ id: item.id }));

    const upsert = args.transactionItems.map((item) => {
      const { id } = item; // store the id

      delete item.id; // delete it so we can cleanly spread in item to upsert
      return {
        create: { ...item },
        update: { ...item },
        where: {
          id_transactionId: { id, transactionId: args.id },
        },
      };
    });

    return await ctx.prisma.transaction.update({
      where: { id: args.id },
      data: {
        description: args.description,
        total: args.total,
        note: args.note,
        checkNo: args.checkNo,
        date: args.date,
        budgetId: args.budgetId || null,
        transactionItems: {
          upsert,
          delete: deleteThesIDs,
        },
      },
    });
  },
});

export const SOFT_DELETE_MUTATION = mutationField('softDeleteTransaction', {
  type: Transaction,
  args: {
    id: nonNull(intArg()),
  },
  async resolve(_parent, args, ctx) {
    return await ctx.prisma.transaction.update({
      where: { id: args.id },
      data: {
        active: false,
      },
    });
  },
});

export const RESTORE_DELETED_ITEM_MUTATION = mutationField(
  'restoreTransaction',
  {
    type: Transaction,
    args: {
      id: nonNull(intArg()),
    },
    async resolve(_parent, args, ctx) {
      return await ctx.prisma.transaction.update({
        where: { id: args.id },
        data: {
          active: true,
        },
      });
    },
  }
);

export const DELETED_TRANSACTION_MUTATION = mutationField('deleteTransaction', {
  type: Transaction,
  args: {
    id: nonNull(intArg()),
  },
  async resolve(_parent, args, ctx) {
    return await ctx.prisma.transaction.delete({
      where: { id: args.id },
    });
  },
});
