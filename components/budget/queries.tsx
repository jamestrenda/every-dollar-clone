import { gql } from '@apollo/client';

export const SINGLE_BUDGET_BY_MONTH_QUERY = gql`
  query SINGLE_BUDGET_QUERY($date: String) {
    budgetByMonth(date: $date) {
      id
      createdAt
      updatedAt
      # transactions {
      #   id
      #   description
      #   total
      #   note
      #   checkNo
      #   updatedAt
      #   date
      #   active
      #   transactionItems {
      #     id
      #     transaction {
      #       id
      #       description
      #       total
      #       note
      #       checkNo
      #       updatedAt
      #       date
      #       active
      #       transactionItems {
      #         id
      #         budgetItem {
      #           id
      #           name
      #           parentCategoryId
      #         }
      #         incomeId
      #         income {
      #           id
      #           source
      #         }
      #         debtId
      #         debt {
      #           id
      #           name
      #         }
      #         amount
      #         budgetItemId
      #       }
      #     }
      #     budgetItem {
      #       id
      #       name
      #       parentCategoryId
      #     }
      #     amount
      #     budgetItemId
      #     incomeId
      #     income {
      #       id
      #       source
      #     }
      #     debtId
      #     debt {
      #       id
      #       name
      #     }
      #   }
      #}
      # favorites {
      #   id
      #   budgetItem {
      #     id
      #     index
      #     name
      #     note
      #     plannedAmount
      #     isFavorite
      #     transactions {
      #       id
      #       amount
      #       budgetItemId
      #       updatedAt
      #       # transactionItems {
      #       #   id
      #       #   amount
      #       #   budgetItemId
      #       # }
      #     }
      #     parentCategoryId
      #     parentCategory {
      #       id
      #       name
      #     }
      #   }
      # }
      # categories {
      #   id
      #   index
      #   name
      #   budgetItems {
      #     id
      #     index
      #     name
      #     note
      #     dueDate
      #     plannedAmount
      #     isFavorite
      #     transactions {
      #       id
      #       amount
      #       budgetItemId
      #       budgetItem {
      #         id
      #         name
      #         parentCategoryId
      #       }
      #       transaction {
      #         id
      #         description
      #         total
      #         note
      #         checkNo
      #         updatedAt
      #         date
      #         active
      #         transactionItems {
      #           id
      #           budgetItem {
      #             id
      #             name
      #             parentCategoryId
      #           }
      #           amount
      #           budgetItemId
      #         }
      #       }
      #     }
      #     parentCategoryId
      #     parentCategory {
      #       id
      #       name
      #     }
      #   }
      # }
      # incomes {
      #   id
      #   index
      #   source
      #   planned
      #   note
      #   transactions {
      #     id
      #     amount
      #     incomeId
      #     updatedAt
      #     transaction {
      #       id
      #       description
      #       total
      #       note
      #       checkNo
      #       updatedAt
      #       date
      #       active
      #       transactionItems {
      #         id
      #         amount
      #         incomeId
      #         income {
      #           id
      #           source
      #         }
      #       }
      #     }
      #   }
      # }
      # debts {
      #   id
      #   index
      #   name
      #   plannedAmount
      #   note
      #   balance
      #   minimumPayment
      #   dueDate
      #   transactions {
      #     id
      #     amount
      #     debtId
      #     updatedAt
      #     transaction {
      #       id
      #       description
      #       total
      #       note
      #       checkNo
      #       updatedAt
      #       date
      #       active
      #       transactionItems {
      #         id
      #         amount
      #         debtId
      #         debt {
      #           id
      #           name
      #         }
      #       }
      #     }
      #   }
      #   createdAt
      #   updatedAt
      #   isFavorite
      # }
    }
  }
`;

export const SINGLE_BUDGET_QUERY = gql`
  query SINGLE_BUDGET_QUERY($id: Int) {
    budget(id: $id) {
      id
      createdAt
      updatedAt
      # transactions {
      #   id
      #   description
      #   total
      #   note
      #   checkNo
      #   updatedAt
      #   date
      #   active
      #   transactionItems {
      #     id
      #     transaction {
      #       id
      #       description
      #       total
      #       note
      #       checkNo
      #       updatedAt
      #       date
      #       active
      #       transactionItems {
      #         id
      #         budgetItem {
      #           id
      #           name
      #           parentCategoryId
      #         }
      #         incomeId
      #         income {
      #           id
      #           source
      #         }
      #         debtId
      #         debt {
      #           id
      #           name
      #         }
      #         amount
      #         budgetItemId
      #       }
      #     }
      #     budgetItem {
      #       id
      #       name
      #       parentCategoryId
      #     }
      #     amount
      #     budgetItemId
      #     incomeId
      #     income {
      #       id
      #       source
      #     }
      #     debtId
      #     debt {
      #       id
      #       name
      #     }
      #   }
      #}
      # favorites {
      #   id
      #   budgetItem {
      #     id
      #     index
      #     name
      #     note
      #     plannedAmount
      #     isFavorite
      #     transactions {
      #       id
      #       amount
      #       budgetItemId
      #       updatedAt
      #       # transactionItems {
      #       #   id
      #       #   amount
      #       #   budgetItemId
      #       # }
      #     }
      #     parentCategoryId
      #     parentCategory {
      #       id
      #       name
      #     }
      #   }
      # }
      # categories {
      #   id
      #   index
      #   name
      #   budgetItems {
      #     id
      #     index
      #     name
      #     note
      #     dueDate
      #     plannedAmount
      #     isFavorite
      #     transactions {
      #       id
      #       amount
      #       budgetItemId
      #       budgetItem {
      #         id
      #         name
      #         parentCategoryId
      #       }
      #       transaction {
      #         id
      #         description
      #         total
      #         note
      #         checkNo
      #         updatedAt
      #         date
      #         active
      #         transactionItems {
      #           id
      #           budgetItem {
      #             id
      #             name
      #             parentCategoryId
      #           }
      #           amount
      #           budgetItemId
      #         }
      #       }
      #     }
      #     parentCategoryId
      #     parentCategory {
      #       id
      #       name
      #     }
      #   }
      # }
      # incomes {
      #   id
      #   index
      #   source
      #   planned
      #   note
      #   transactions {
      #     id
      #     amount
      #     incomeId
      #     updatedAt
      #     transaction {
      #       id
      #       description
      #       total
      #       note
      #       checkNo
      #       updatedAt
      #       date
      #       active
      #       transactionItems {
      #         id
      #         amount
      #         incomeId
      #         income {
      #           id
      #           source
      #         }
      #       }
      #     }
      #   }
      # }
      # debts {
      #   id
      #   index
      #   name
      #   plannedAmount
      #   note
      #   balance
      #   minimumPayment
      #   dueDate
      #   transactions {
      #     id
      #     amount
      #     debtId
      #     updatedAt
      #     transaction {
      #       id
      #       description
      #       total
      #       note
      #       checkNo
      #       updatedAt
      #       date
      #       active
      #       transactionItems {
      #         id
      #         amount
      #         debtId
      #         debt {
      #           id
      #           name
      #         }
      #       }
      #     }
      #   }
      #   createdAt
      #   updatedAt
      #   isFavorite
      # }
    }
  }
`;

export const DELETE_BUDGET_MUTATION = gql`
  mutation DELETE_BUDGET_MUTATION($id: Int!) {
    deleteBudget(id: $id) {
      id
    }
  }
`;
