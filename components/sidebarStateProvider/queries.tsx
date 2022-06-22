import { gql } from '@apollo/client';

export const SINGLE_BUDGET_ITEM_QUERY = gql`
  query SINGLE_BUDGET_ITEM_QUERY($id: Int!) {
    budgetItem(id: $id) {
      id
      index
      name
      note
      dueDate
      plannedAmount
      isFavorite
      transactions {
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
      parentCategoryId
      parentCategory {
        id
        name
      }
    }
  }
`;
export const SINGLE_INCOME_QUERY = gql`
  query SINGLE_INCOME_QUERY($id: Int!) {
    income(id: $id) {
      id
      index
      source
      note
      planned
      transactions {
        id
        amount
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
  }
`;
