import { PrismaClient } from '@prisma/client';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import prisma from '../lib/prisma';

export type Context = {
  user?: { id: number };
  // accessToken?: string;
  // session?: Session;
  prisma: PrismaClient;
};
export async function createContext(context): Promise<Context> {
  const session = await getSession(context);
  // console.log({ context, session });
  // if the user is not logged in, omit returning the user and accessToken
  if (!session) return { prisma };

  // const { user, accessToken } = session;
  return {
    user: {
      id: parseInt(session.user.name),
    },
    prisma,
  };
}
