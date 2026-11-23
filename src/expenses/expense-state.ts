import type { Expense, ExpenseDraft, ExpenseTotals } from "../types.ts"

export const EMPTY_EXPENSE_TOTALS: ExpenseTotals = {
  alimento: 0,
  transporte: 0,
  lazer: 0,
  saude: 0,
  outros: 0,
}

export const createExpense = (draft: ExpenseDraft): Expense => ({
  id: crypto.randomUUID(),
  ...draft,
})

export const calculateExpenseTotals = (expenses: Expense[]) => {
  const categoryTotals: ExpenseTotals = { ...EMPTY_EXPENSE_TOTALS }
  expenses.forEach((expense) => {
    categoryTotals[expense.category] += expense.value
  })
  const total = expenses.reduce((sum, expense) => sum + expense.value, 0)
  return { categoryTotals, total }
}
