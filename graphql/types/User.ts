import {
  nonNull,
  objectType,
  stringArg,
  enumType,
  intArg,
  queryField,
  mutationField,
} from 'nexus';
// import { Transaction } from './Transaction';
// import { Budget } from './Budget';
// import { Session } from './Session';
import { Account } from './Account';
import { Message } from './Message';
import { randomBytes } from 'crypto';
import { promisify } from 'util';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { PasswordResetRequestEmailHtml } from '../../components/email/resetRequest';
import { Budget } from './Budget';

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
    // t.list.field('transactions', {
    //   type: Transaction,
    //   async resolve(parent, _args, ctx) {
    //     return await ctx.prisma.user
    //       .findUnique({
    //         where: {
    //           id: parent.id,
    //         },
    //       })
    //       .transactions();
    //   },
    // });
    t.list.field('budgets', {
      type: Budget,
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.user
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .budgets();
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
    const host = process.env.NEXTAUTH_URL;
    const url = `${host}/account/password-reset?resetToken=${resetToken}`;
    const transport = nodemailer.createTransport({
      service: 'Postmark', // no need to set host or port etc.
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });
    await transport.sendMail({
      to: args.email,
      from: process.env.EMAIL_FROM,
      subject: `Password Reset Link for EveryDollar Clone`,
      text: text({ url, host, appName: 'EveryDollar Clone' }),
      html: html({
        url,
        host,
        appName: 'EveryDollar Clone',
        email: args.email,
      }),
    });
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
      return {
        error: true,
        message: 'Password fields must match. Please try again.',
      };
    }

    // 2. Check that this is a legit resetToken
    // 3. Check that it's not expired
    const [user] = await ctx.prisma.user.findMany({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry: {
          gte: Date.now() - 3600000, // within the last hour
        },
      },
    });

    if (!user) {
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

// Email HTML body
function html({
  url,
  host,
  appName,
  email,
}: Record<'url' | 'host' | 'appName' | 'email', string>) {
  // Insert invisible space into domains and email address to prevent both the
  // email address and the domain from being turned into a hyperlink by email
  // clients like Outlook and Apple mail, as this is confusing because it seems
  // like they are supposed to click on their email address to sign in.
  const escapedEmail = `${email.replace(/\./g, '&#8203;.')}`;
  const escapedHost = `${host.replace(/\./g, '&#8203;.')}`;

  // Some simple styling options
  const options = {
    appName,
    url,
    backgroundColor: '#000',
    textColor: '#444444',
    mainBackgroundColor: '#fafafa',
    buttonBackgroundColor: '#346df1',
    buttonBorderColor: '#346df1',
    buttonTextColor: '#ffffff',
    fontFamily: 'Helvetica, Arial, sans-serif',
  };

  return `${PasswordResetRequestEmailHtml(options)}`;
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({
  url,
  host,
  appName,
}: Record<'url' | 'host' | 'appName', string>) {
  return `Password-free sign-in link for ${appName}\n\nSimply paste the URL below into a web browser to reset your password. Your password reset token will expire in one hour and can only be used once.\n\n${url}\n\n`;
}
