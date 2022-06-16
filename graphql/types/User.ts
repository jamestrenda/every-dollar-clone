import {
  nonNull,
  objectType,
  stringArg,
  extendType,
  enumType,
  intArg,
  queryField,
  mutationField,
} from 'nexus';
import { connectionFromArraySlice, cursorToOffset } from 'graphql-relay';
// import { Transaction } from './Transaction';
// import { Budget } from './Budget';
// import { Session } from './Session';
import { Account } from './Account';
import { Message } from './Message';
import { randomBytes } from 'crypto';
import { promisify } from 'util';
import bcrypt from 'bcrypt';
import { signIn } from 'next-auth/react';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('firstName');
    t.nonNull.string('lastName');
    t.nonNull.string('email');
    t.dateTime('emailVerified');
    t.nonNull.boolean('isAdmin');
    t.nonNull.boolean('onboarded');
    t.nonNull.dateTime('createdAt');
    t.nonNull.dateTime('updatedAt');
    t.string('resetToken');
    t.int('resetTokenExpiry');
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

// export const ALL_USERS_QUERY = queryField('users', {
//   type: nonNull(User),
//   async resolve(_parent, _args, ctx) {
//     return await ctx.prisma.user.findMany();
//   },
// });
export const CURRENT_USER_QUERY = queryField('user', {
  type: nonNull(User),
  args: { id: nonNull(intArg()) },
  async resolve(_parent, args, ctx) {
    return await ctx.prisma.user.findUnique({
      where: {
        id: args.id,
      },
    });
  },
});

export const REQUEST_RESET_MUTATION = mutationField('requestReset', {
  type: Message,
  args: { email: nonNull(stringArg()) },
  async resolve(_parent, args, ctx) {
    // 1. find if there is a user with that email
    const user = await ctx.prisma.user.findUnique({
      where: { email: args.email },
    });

    if (!user) {
      // throw new Error(`No user with the email ${args.email}`);
      return {
        error: true,
        message: `No user found with the email ${args.email}.`,
      };
    }
    // 2. Set a reset token, and a reset date
    const resetToken = (await promisify(randomBytes)(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    const res = await ctx.prisma.user.update({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry },
    });

    // 3. Send them their token via email
    // const mailRes = await mail.transport.sendMail({
    //   from: 'wesbos@gmail.com',
    //   to: user.email,
    //   subject: 'Your password reset token',
    //   html: mail.makeANiceEmail(
    //     `Your password reset link is here! \n\n<a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click Here to reset</a>`
    //   ),
    // });
    return {
      message: 'Success! Check your e-mail for a link to reset your password.',
    };
  },
});

export const PASSWORD_RESET_MUTATION = mutationField('resetPassword', {
  type: Message,
  args: {
    resetToken: nonNull(stringArg()),
    password: nonNull(stringArg()),
    confirmPassword: nonNull(stringArg()),
  },
  async resolve(_parent, args, ctx) {
    // 1. Check that a password was submitted and that both fields match
    if (!args.password.trim().length || !args.confirmPassword.trim().length) {
      return {
        error: true,
        message:
          'Passwords cannot start with a space or be blank. Please try again.',
      };
    }
    if (args.password !== args.confirmPassword) {
      // throw new Error('Passwords do not match');
      return {
        error: true,
        message: 'Password fields must match. Please try again.',
      };
    }

    // 2. Check that this is a legit resetToken
    // 3. Check that it's not expired
    // Note: If we didn't need the user here, we could also use db.exists()
    const [user] = await ctx.prisma.user.findMany({
      where: {
        resetToken: args.resetToken,
        // resetTokenExpiry: {
        //   gte: Date.now() - 3600000, // within the last hour
        // },
      },
    });

    if (!user) {
      // throw new Error('This token is either invalid or expired.');
      return {
        error: true,
        message: 'This token is either invalid or expired.',
      };
    }

    // 4. Hash the password
    const password = await bcrypt.hash(args.password, 14);

    // 5. Update the users password
    // clean up the resetToken fields at the same time
    const updatedUser = await ctx.prisma.user.update({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null,
      },
      select: { id: true },
    });

    // since we're delegating user sessions to next-auth, we'll just return the user
    // and on the client side, we will redirect the user to the sign-in page.
    // in other words, we won't automatically log the user in after they
    // reset their password, which kinda sucks, but we're limited by nex-auth in this regard
    // const res = await signIn('sign-in-credentials', {
    //   email: user.email,
    //   password: args.password,
    //   redirect: false,
    // });
    // 6. send back the User for the GraphQL request on the client
    // return updatedUser;
    return {
      message: 'Success! Check your e-mail for a link to reset your password.',
    };
  },
});
