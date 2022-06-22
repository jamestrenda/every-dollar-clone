import {
  nonNull,
  objectType,
  stringArg,
  extendType,
  intArg,
  list,
} from 'nexus';
import { connectionFromArraySlice, cursorToOffset } from 'graphql-relay';
import { Budget } from './Budget';
import { BudgetItem } from './BudgetItem';
import { BudgetItemIndexInput } from './BudgetItemIndexInput';

export const Category = objectType({
  name: 'Category',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.int('index');
    t.nonNull.string('name');
    t.nonNull.field('budget', {
      type: Budget,
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.category
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .budget();
      },
    });
    t.nonNull.int('budgetId');
    t.list.field('budgetItems', {
      type: nonNull(BudgetItem),
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.category
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .budgetItems();
      },
    });
  },
});

export const ALL_CATEGORIES_QUERY = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('categories', {
      type: nonNull(Category),
    });
  },
});

export const SINGLE_CATEGORY_QUERY = extendType({
  type: 'Query',
  definition(t) {
    t.field('category', {
      type: Category,
      args: { id: nonNull(intArg()) },
    });
  },
});

export const CREATE_CATEGORY_MUTATION = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createCategory', {
      type: 'Category',
      args: {
        budgetId: nonNull(intArg()),
      },
      async resolve(_parent, args, ctx) {
        const currentCategories = await ctx.prisma.budget
          .findUnique({
            where: {
              id: args.budgetId,
            },
          })
          .categories();
        return ctx.prisma.category.create({
          data: {
            name: 'Untitled',
            index: currentCategories.length,
            budgetId: args.budgetId,
          },
        });
      },
    });
  },
});
export const DELETE_CATEGORY_MUTATION = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('deleteCategory', {
      type: 'Category',
      args: {
        id: nonNull(intArg()),
        budgetId: nonNull(intArg()),
      },
      async resolve(_parent, args, ctx) {
        const deletedCategory = await ctx.prisma.category.delete({
          where: { id: args.id },
          select: {
            id: true,
            index: true,
            budgetId: true,
            name: true,
          },
        });
        // find the incomes for the current budget
        // where the index is greater than the one we deleted
        const categories = await ctx.prisma.category.findMany({
          where: {
            AND: [
              { budgetId: args.budgetId },
              {
                index: {
                  gt: deletedCategory.index,
                },
              },
            ],
          },
        });
        // need to decrement all the categories that are of higher order
        for (const category of categories) {
          const updateIncomeIndex = await ctx.prisma.category.update({
            where: {
              id: category.id,
            },
            data: {
              index: category.index - 1,
            },
          });
        }

        return deletedCategory;
      },
    });
  },
});
export const UPDATE_CATEGORY_NAME_MUTATION = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('updateCategoryName', {
      type: 'Category',
      args: {
        id: nonNull(intArg()),
        name: nonNull(stringArg()),
      },
      resolve(_parent, args, ctx) {
        return ctx.prisma.category.update({
          where: { id: args.id },
          data: {
            name: args.name,
          },
        });
      },
    });
  },
});

export const UPDATE_CATEGORY_INDEXES_MUTATION = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('updateCategoryIndexes', {
      type: 'Category',
      args: {
        data: nonNull(list(nonNull(BudgetItemIndexInput))),
      },
      async resolve(_parent, args, ctx) {
        // shape the data here?
        let updateItem;
        for (const item of args.data) {
          updateItem = await ctx.prisma.category.update({
            where: {
              id: item.id,
            },
            data: {
              index: item.index,
            },
          });
        }

        return updateItem;
      },
    });
  },
});
