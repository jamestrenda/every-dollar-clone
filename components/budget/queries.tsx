import { gql } from '@apollo/client';

export const SINGLE_BUDGET_QUERY = gql`
  query SINGLE_BUDGET_QUERY($userId: Int, $month: String, $year: String) {
    budget(userId: $userId, month: $month, year: $year) {
      id
      createdAt
      updatedAt
      month
      year
      userId
      transactions {
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
              incomeId
              income {
                id
                source
              }
              debtId
              debt {
                id
                name
              }
              amount
              budgetItemId
            }
          }
          budgetItem {
            id
            name
            parentCategoryId
          }
          amount
          budgetItemId
          incomeId
          income {
            id
            source
          }
          debtId
          debt {
            id
            name
          }
        }
      }
      categories {
        id
        index
        name
        budgetItems {
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
      incomes {
        id
        index
        source
        planned
        note
        transactions {
          id
          amount
          incomeId
          updatedAt
          transaction {
            id
            description
            total
            note
            checkNo
            updatedAt
            date
            active
            transactionItems {
              id
              amount
              incomeId
              income {
                id
                source
              }
            }
          }
        }
      }
      debts {
        id
        index
        name
        plannedAmount
        note
        balance
        minimumPayment
        dueDate
        transactions {
          id
          amount
          debtId
          updatedAt
          transaction {
            id
            description
            total
            note
            checkNo
            updatedAt
            date
            active
            transactionItems {
              id
              amount
              debtId
              debt {
                id
                name
              }
            }
          }
        }
        createdAt
        updatedAt
        isFavorite
      }
    }
  }
`;

// export const SINGLE_BUDGET_QUERY = gql`
//   query SINGLE_BUDGET_QUERY($id: Int) {
//     budget(id: $id) {
//       id
//       createdAt
//       updatedAt
//       transactions {
//         id
//         description
//         total
//         note
//         checkNo
//         updatedAt
//         date
//         active
//         transactionItems {
//           id
//           transaction {
//             id
//             description
//             total
//             note
//             checkNo
//             updatedAt
//             date
//             active
//             transactionItems {
//               id
//               budgetItem {
//                 id
//                 name
//                 parentCategoryId
//               }
//               incomeId
//               income {
//                 id
//                 source
//               }
//               debtId
//               debt {
//                 id
//                 name
//               }
//               amount
//               budgetItemId
//             }
//           }
//           budgetItem {
//             id
//             name
//             parentCategoryId
//           }
//           amount
//           budgetItemId
//           incomeId
//           income {
//             id
//             source
//           }
//           debtId
//           debt {
//             id
//             name
//           }
//         }
//       }
//       categories {
//         id
//         index
//         name
//         budgetItems {
//           id
//           index
//           name
//           note
//           dueDate
//           plannedAmount
//           isFavorite
//           transactions {
//             id
//             amount
//             budgetItemId
//             budgetItem {
//               id
//               name
//               parentCategoryId
//             }
//             transaction {
//               id
//               description
//               total
//               note
//               checkNo
//               updatedAt
//               date
//               active
//               transactionItems {
//                 id
//                 budgetItem {
//                   id
//                   name
//                   parentCategoryId
//                 }
//                 amount
//                 budgetItemId
//               }
//             }
//           }
//           parentCategoryId
//           parentCategory {
//             id
//             name
//           }
//         }
//       }
//       incomes {
//         id
//         index
//         source
//         planned
//         note
//         transactions {
//           id
//           amount
//           incomeId
//           updatedAt
//           transaction {
//             id
//             description
//             total
//             note
//             checkNo
//             updatedAt
//             date
//             active
//             transactionItems {
//               id
//               amount
//               incomeId
//               income {
//                 id
//                 source
//               }
//             }
//           }
//         }
//       }
//       debts {
//         id
//         index
//         name
//         plannedAmount
//         note
//         balance
//         minimumPayment
//         dueDate
//         transactions {
//           id
//           amount
//           debtId
//           updatedAt
//           transaction {
//             id
//             description
//             total
//             note
//             checkNo
//             updatedAt
//             date
//             active
//             transactionItems {
//               id
//               amount
//               debtId
//               debt {
//                 id
//                 name
//               }
//             }
//           }
//         }
//         createdAt
//         updatedAt
//         isFavorite
//       }
//     }
//   }
// `;
