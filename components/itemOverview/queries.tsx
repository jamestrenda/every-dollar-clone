import { gql } from '@apollo/client';

export const BUDGET_ITEM_TRANSACTIONS_QUERY = gql`
  query BUDGET_ITEM_TRANSACTIONS_QUERY($id: Int) {
    budgetItemTransactions(id: $id) {
      id
      amount
      budgetItemId
      budgetItem {
        id
        name
        parentCategoryId
      }
      transaction {
        id
        description
        total
        note
        checkNo
        updatedAt
        date
        active
        budgetId
        transactionItems {
          id
          budgetItem {
            id
            name
            parentCategoryId
          }
          amount
          budgetItemId
        }
      }
    }
  }
`;
