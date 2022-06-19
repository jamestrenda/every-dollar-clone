import { inputObjectType } from 'nexus';
export const TransactionItemUpsertInput = inputObjectType({
  name: 'TransactionItemUpsertInput',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.int('amount');
    t.int('budgetItemId');
    t.int('incomeId');
    t.int('debtId');
  },
});
