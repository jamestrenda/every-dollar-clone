import { gql } from '@apollo/client';

export const DELETE_BUDGET_MUTATION = gql`
  mutation DELETE_BUDGET_MUTATION($id: Int!) {
    deleteBudget(id: $id) {
      id
    }
  }
`;
