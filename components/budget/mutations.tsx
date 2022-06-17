import { gql } from '@apollo/client';

export const CREATE_BUDGET_MUTATION = gql`
  mutation CREATE_BUDGET_MUTATION($userId: Int!) {
    createBudget(userId: $userId) {
      id
    }
  }
`;
