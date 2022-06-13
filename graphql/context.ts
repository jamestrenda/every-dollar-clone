import { PrismaClient } from '@prisma/client';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import prisma from '../lib/prisma';

export type Context = {
  session?: Session;
  prisma: PrismaClient;
};
export async function createContext(context): Promise<Context> {
  const session = await getSession(context);

  // if the user is not logged in, omit returning the user and accessToken
  if (!session) return { prisma };

  // const { user, accessToken } = session;
  // console.log('from context.ts', { user, accessToken });
  return {
    // user,
    // accessToken,
    prisma,
  };
}
