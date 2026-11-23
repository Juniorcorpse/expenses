export type ExpenseCategory =
  | "alimento"
  | "transporte"
  | "lazer"
  | "saude"
  | "outros"

export type Expense = {
  id: string
  title: string
  value: number
  category: ExpenseCategory
}

export type ExpenseDraft = {
  title: string
  value: number
  category: ExpenseCategory
}

export type ExpenseTotals = Record<ExpenseCategory, number>

export type ExpenseValidationResult = {
  isValid: boolean
  errors: {
    title: string
    value: string
    category: string
  }
  draft?: ExpenseDraft
}

export type ExpenseRenderElements = {
  list: HTMLDivElement
  template: HTMLTemplateElement
  emptyState: HTMLParagraphElement
  count: HTMLSpanElement
  total: HTMLElement
  categoryTotals: Record<ExpenseCategory, HTMLElement>
}
