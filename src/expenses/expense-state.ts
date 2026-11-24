import type { Expense, ExpenseDraft, ExpenseTotals } from "../types.ts"

export const EMPTY_EXPENSE_TOTALS: ExpenseTotals = {
  alimento: 0,
  transporte: 0,
  lazer: 0,
  saude: 0,
  outros: 0,
}

/* 1 Recebe um objeto draft contendo os dados da despesa.
   2 Gera um identificador único com crypto.randomUUID().
   3 Copia os campos de draft para o novo objeto.
   4 Retorna o resultado tipado como Expense. */
export const createExpense = (draft: ExpenseDraft): Expense => ({
  id: crypto.randomUUID(),
  ...draft,
})

/*  **********************************************************************
    **Calcula os totais das despesas por categoria e o valor total geral** 
    **********************************************************************
  1 Cria uma cópia de `EMPTY_EXPENSE_TOTALS`.
    A cópia de EMPTY_EXPENSE_TOTALS evita alterar o objeto original compartilhado.
  2 Percorre todas as despesas.
  3 Soma o `expense.value` na categoria correspondente.
  4 Calcula o total geral somando todas as despesas.
  5 Retorna um objeto com:
   */
export const calculateExpenseTotals = (expenses: Expense[]) => {  
  const categoryTotals: ExpenseTotals = { ...EMPTY_EXPENSE_TOTALS }//1  
  expenses.forEach((expense) => {//2    
    categoryTotals[expense.category] += expense.value//3
  })
  const total = expenses.reduce((sum, expense) => sum + expense.value, 0)//4
  return { categoryTotals, total }//5
}
