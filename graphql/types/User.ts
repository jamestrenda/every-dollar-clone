import {
  nonNull,
  objectType,
  stringArg,
  extendType,
  enumType,
  intArg,
} from 'nexus';
import { connectionFromArraySlice, cursorToOffset } from 'graphql-relay';
// import { Transaction } from './Transaction';
// import { Budget } from './Budget';
// import { Session } from './Session';
import { Account } from './Account';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('firstName');
    t.nonNull.string('lastName');
    t.nonNull.string('email');
    t.dateTime('emailVerified');
    t.nonNull.string('password');
    t.nonNull.boolean('isAdmin');
    t.nonNull.boolean('onboarded');
    t.nonNull.dateTime('createdAt');
    t.nonNull.dateTime('updatedAt');
    t.string('image');
    t.nonNull.string('role');
    t.list.field('accounts', {
      type: Account,
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.user
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .accounts();
      },
    });
  },
});

const Role = enumType({
  name: 'Role',
  members: ['SUPER_ADMIN', 'ADMIN', 'USER'],
});

export const ALL_USERS_QUERY = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('users', {
      type: nonNull(User),
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.user.findMany();
      },
    });
  },
});

export const CURRENT_USER_QUERY = extendType({
  type: 'Query',
  definition(t) {
    t.field('user', {
      type: User,
      async resolve(_parent, args, ctx) {
        const user = await ctx.prisma.user.findUnique({
          where: {
            id: ctx.user.id,
          },
        });

        return user;
      },
    });
  },
});
