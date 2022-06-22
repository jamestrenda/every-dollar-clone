import { gql } from '@apollo/client';

export const UPDATE_BUDGET_ITEM_MUTATION = gql`
  mutation (
    $id: Int!
    $name: String
    $plannedAmount: Int
    $note: String
    $dueDate: DateTime
  ) {
    updateBudgetItem(
      id: $id
      name: $name
      plannedAmount: $plannedAmount
      note: $note
      dueDate: $dueDate
    ) {
      id
      index
      name
      plannedAmount
      note
      dueDate
      parentCategory {
        id
        name
      }
      transactions {
        id
      }
    }
  }
`;
