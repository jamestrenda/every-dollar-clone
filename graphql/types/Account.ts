import {
  nonNull,
  objectType,
  stringArg,
  extendType,
  enumType,
  intArg,
} from 'nexus';
import { User } from './User';

export const Account = objectType({
  name: 'Account',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.int('userId');
    t.nonNull.string('type');
    t.nonNull.string('provider');
    t.nonNull.string('providerAccountId');
    t.string('refresh_token');
    t.string('access_token');
    t.dateTime('accessTokenExpires');
    t.int('expires_at');
    t.string('token_type');
    t.string('scope');
    t.string('id_token');
    t.string('session_state');
    t.nonNull.dateTime('createdAt');
    t.nonNull.dateTime('updatedAt');
    t.field('user', {
      type: User,
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.account
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .user();
      },
    });
  },
});

export const ALL_ACCOUNTS_QUERY = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('accounts', {
      type: nonNull(Account),
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.account.findMany();
      },
    });
  },
});

export const SINGLE_ACCOUNT_QUERY = extendType({
  type: 'Query',
  definition(t) {
    t.field('account', {
      type: Account,
      args: { id: nonNull(intArg()) },
      async resolve(_parent, args, ctx) {
        return await ctx.prisma.account.findFirst({
          where: {
            userId: args.id,
          },
        });
      },
    });
  },
});
