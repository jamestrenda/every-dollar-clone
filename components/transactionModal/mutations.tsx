import { gql } from '@apollo/client';

export const CREATE_TRANSACTION_MUTATION = gql`
  mutation CREATE_TRANSACTION_MUTATION(
    $budgetId: Int!
    $description: String!
    $total: Int!
    $note: String
    $checkNo: String
    $date: DateTime!
    $transactionItems: [TransactionItemUpsertInput!]!
  ) {
    createTransaction(
      budgetId: $budgetId
      description: $description
      total: $total
      note: $note
      checkNo: $checkNo
      date: $date
      transactionItems: $transactionItems
    ) {
      id
      description
      total
      note
      checkNo
      date
      transactionItems {
        id
        amount
        budgetItemId
        incomeId
        debtId
      }
    }
  }
`;

export const UPDATE_TRANSACTION_MUTATION = gql`
  mutation UPDATE_TRANSACTION_MUTATION(
    $id: Int!
    $description: String
    $total: Int
    $note: String
    $checkNo: String
    $date: DateTime
    $transactionItems: [TransactionItemUpsertInput!]!
  ) {
    updateTransaction(
      id: $id
      description: $description
      total: $total
      note: $note
      checkNo: $checkNo
      date: $date
      transactionItems: $transactionItems
    ) {
      id
      description
      total
      note
      checkNo
      date
      transactionItems {
        id
        amount
        budgetItemId
        budgetItem {
          id
        }
        incomeId
        income {
          id
        }
        debtId
        debt {
          id
        }
      }
    }
  }
`;
