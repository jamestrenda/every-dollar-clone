interface IIncomeItemProps {
  __typename: string;
  id: number;
  index: number;
  name: string;
  note: string | undefined | null;
  dueDate: string | undefined | null;
  plannedAmount: number;
  isFavorite: boolean;
  transactions: any;
  budgetId: number;
  parentCategoryId: number;
  parentCategory: {
    __typename: string;
    id: number;
    name: string;
  };
}
interface IBudgetItemProps {
  __typename: string;
  id: number;
  index: number;
  name: string;
  note: string | undefined | null;
  dueDate: string | undefined | null;
  plannedAmount: number;
  isFavorite: boolean;
  transactions: any;
  budgetId: number;
  parentCategoryId: number;
  parentCategory: {
    __typename: string;
    id: number;
    name: string;
  };
}
