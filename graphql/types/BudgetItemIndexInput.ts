import { extendType, inputObjectType, intArg, list, nonNull } from 'nexus';
import { Income } from '.';
export const BudgetItemIndexInput = inputObjectType({
  name: 'BudgetItemIndexInput',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.int('index');
  },
});

// export const UPDATE_INCOME_INDEX_MUTATION = extendType({
//   type: 'Mutation',
//   definition(t) {
//     t.field('updateIncomeIndex', {
//       type: nonNull('Budget'),
//       args: { id: nonNull(intArg()), data: IncomeUpdateIndexInput },
//       resolve(_parent, args, ctx) {
//         return ctx.prisma.budget.update({
//           where: {
//             id: args.id,
//           },
//           data: {
//             incomes: {
//               set: args.data,
//             },
//           },
//         });
//       },
//     });
//   },
// });
