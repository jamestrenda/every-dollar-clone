import { PrismaClient } from '@prisma/client';
import {
  budgets,
  incomes,
  categories,
  budgetItems,
  transactions,
  transactionItems,
} from '../data/data';
const prisma = new PrismaClient();

async function main() {
  console.log('Truncating and resetting sequences...');
  await prisma.$queryRaw`truncate "Budget", "Category", "Income", "Debt", "Transaction", "BudgetItem", "TransactionItem", "User", "Account" restart identity;`;

  console.log('Creating a new user...');
  await prisma.user.create({
    data: {
      firstName: 'James',
      lastName: 'Trenda',
      email: `jamestrenda@gmail.com`,
      password: '$2b$10$u67B35vdRB3nG95XRNAErusMPJMJCKY9sxt0Iy1Iz.7axDemJXhVi',
    },
  });

  console.log('Creating a new budget...');
  await prisma.budget.createMany({
    data: budgets,
  });

  console.log('Adding incomes...');
  await prisma.income.createMany({
    data: incomes,
  });

  console.log('Setting up categories...');
  await prisma.category.createMany({
    data: categories,
  });

  console.log('Adding budget items to categories...');
  await prisma.budgetItem.createMany({
    data: budgetItems,
  });

  console.log('Creating transactions...');
  await prisma.transaction.createMany({
    data: transactions,
  });
  await prisma.transactionItem.createMany({
    data: transactionItems,
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
