import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { VerifyEmailHtml } from '../../../components/email/verify';

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  // secret: process.env.NEXTAUTH_SECRET, // defined in .env so we don't need to specify it here
  // session: { // Next.js defaults, don't need this unless we need to modify the session config
  //   // Choose how you want to save the user session.
  //   // The default is `"jwt"`, an encrypted JWT (JWE) in the session cookie.
  //   // If you use an `adapter` however, we default it to `"database"` instead.
  //   // You can still force a JWT session by explicitly defining `"jwt"`.
  //   // When using `"database"`, the session cookie will only contain a `sessionToken` value,
  //   // which is used to look up the session in the database.
  //   strategy: 'database',

  //   // Seconds - How long until an idle session expires and is no longer valid.
  //   maxAge: 30 * 24 * 60 * 60, // 30 days

  //   // Seconds - Throttle how frequently to write to database to extend a session.
  //   // Use it to limit write operations. Set to 0 to always update the database.
  //   // Note: This option is ignored if using JSON Web Tokens
  //   updateAge: 24 * 60 * 60, // 24 hours
  // },
  providers: [
    EmailProvider({
      id: 'email',
      server: {
        service: 'Postmark', // no need to set host or port etc.
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({
        identifier: email,
        url,
        provider: { server, from },
      }) {
        const { host } = new URL(url);
        const appName = process.env.APP_NAME;
        const transport = nodemailer.createTransport(server);
        await transport.sendMail({
          to: email,
          from,
          subject: `Password-free sign-in link for ${appName}`,
          text: text({ url, host, appName }),
          html: html({ url, host, appName, email }),
        });
      },
      secret: process.env.NEXTAUTH_SECRET,
    }),
    CredentialsProvider({
      id: 'sign-in-credentials',
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;

        // console.log({ credentials });
        // 1. check if username/email exists
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (user && password?.length) {
          const compare = await bcrypt.compare(password, user.password);

          if (!compare) {
            return null;
          }

          // 2. if user credentials are correct, set a token
          const token = await jwt.sign(
            { jwt: user.id },
            process.env.NEXTAUTH_SECRET
          );

          user['token'] = token;

          return user;
        }
        return null;
      },
    }),
    CredentialsProvider({
      id: 'sign-up-credentials',
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        firstName: { type: 'text' },
        lastName: { type: 'text' },
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either an object representing a user
        // or a value that is false/null if the credentials are invalid.

        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }

        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)

        const { firstName, lastName, email, password } = credentials;

        // 1. check if username/email exists
        const existingUser = await prisma.user.findUnique({
          where: {
            email,
          },
          // select: {
          //   password: false,
          // },
        });
        // TODO: return error message
        if (existingUser) {
          // not throwing an error for some reason
          // console.log({ existingUser });
          // throw new Error('The e-mail you provided is already taken.');
          return null;
        }

        // 2. if user does NOT exist, create it
        const hash = await bcrypt.hash(password, 14);
        const user = await prisma.user.create({
          data: {
            firstName,
            lastName,
            email,
            password: hash,
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            emailVerified: true,
            onboarded: true,
            image: true,
            role: true,
          },
        });

        if (user) {
          const token = await jwt.sign(
            { jwt: user.id },
            process.env.NEXTAUTH_SECRET
          );

          user['token'] = token;

          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/account/sign-in',
    signOut: '/account/sign-out',
    // error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/account/verify-email', // (used for check email message)
    // newUser: '/account/welcome', // New users will be directed here on first sign in
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) {
    //   const isAllowedToSignIn = true;
    //   if (isAllowedToSignIn) {
    //     return true;
    //   } else {
    //     // Return false to display a default error message
    //     return false;
    //     // Or you can return a URL to redirect to:
    //     // return '/unauthorized'
    //   }
    // },
    // async redirect({ url, baseUrl }) {
    //   return baseUrl;
    // },
    async session({ session, token }) {
      //session.user['accessToken'] = token.accessToken;
      // session.user.refreshToken = token.refreshToken;
      //session.user['accessTokenExpires'] = token.accessTokenExpires;
      //session.user['name'] = token.user['id'];
      session.user = token.user;

      // console.log('from session callback...', { session, token });
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // console.log({ token, user, account, profile, isNewUser });
      // console.log('from jwt callback...', { user, token });
      if (user) {
        return {
          ...token,
          user,
          accessToken: user.token,
          // refreshToken: user.data.refreshToken,
        };
      }
      // return Promise.resolve(token);

      return token;
    },
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

  return `${VerifyEmailHtml(options)}`;
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({
  url,
  host,
  appName,
}: Record<'url' | 'host' | 'appName', string>) {
  return `Password-free sign-in link for ${appName}\n\nSimply paste the URL below into a web browser to sign in to your account. This URL will expire in 24 hours and can only be used once.\n\n${url}\n\n`;
}
