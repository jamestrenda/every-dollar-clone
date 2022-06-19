import { gql } from '@apollo/client';

export const DELETE_CATEGORY_MUTATION = gql`
  mutation ($id: Int!, $budgetId: Int!) {
    deleteCategory(id: $id, budgetId: $budgetId) {
      id
      budgetId
    }
  }
`;
