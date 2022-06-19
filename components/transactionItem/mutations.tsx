import { gql } from '@apollo/client';

export const SOFT_DELETE_MUTATION = gql`
  mutation SOFT_DELETE_MUTATION($id: Int!) {
    softDeleteTransaction(id: $id) {
      id
    }
  }
`;

export const RESTORE_DELETED_ITEM_MUTATION = gql`
  mutation RESTORE_DELETED_ITEM_MUTATION($id: Int!) {
    restoreTransaction(id: $id) {
      id
    }
  }
`;

export const DELETED_TRANSACTION_MUTATION = gql`
  mutation DELETED_TRANSACTION_MUTATION($id: Int!) {
    deleteTransaction(id: $id) {
      id
    }
  }
`;
