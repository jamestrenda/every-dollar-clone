import { gql } from '@apollo/client';

export const CREATE_TRANSACTION_MUTATION = gql`
  mutation CREATE_TRANSACTION_MUTATION(
    $userId: Int!
    $budgetId: Int!
    $description: String!
    $total: Int!
    $note: String
    $checkNo: String
    $date: DateTime!
    $transactionItems: [TransactionItemUpsertInput!]!
  ) {
    createTransaction(
      userId: $userId
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
    $description: String!
    $total: Int!
    $note: String
    $checkNo: String
    $date: DateTime!
    $transactionItems: [TransactionItemUpsertInput!]!
    $budgetId: Int
  ) {
    updateTransaction(
      id: $id
      budgetId: $budgetId
      description: $description
      total: $total
      note: $note
      checkNo: $checkNo
      date: $date
      transactionItems: $transactionItems
    ) {
      id
      budgetId
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
