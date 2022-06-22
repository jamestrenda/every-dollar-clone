import { gql } from '@apollo/client';

export const CREATE_BUDGET_MUTATION = gql`
  mutation CREATE_BUDGET_MUTATION($userId: Int!) {
    createBudget(userId: $userId) {
      id
    }
  }
`;

export const UPDATE_CATEGORY_INDEXES_MUTATION = gql`
  mutation UPDATE_CATEGORY_INDEXES_MUTATION($data: [BudgetItemIndexInput!]!) {
    updateCategoryIndexes(data: $data) {
      id
    }
  }
`;
