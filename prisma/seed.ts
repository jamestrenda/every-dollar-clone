import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // console.log('Truncating and resetting sequences...');
  // await prisma.$queryRaw`truncate users restart identity;`;

  console.log('Creating a new user...');
  await prisma.user.create({
    data: {
      email: `james@trenda.dev`,
      role: 'SUPER_ADMIN',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
