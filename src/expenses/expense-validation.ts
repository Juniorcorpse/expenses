import type { ExpenseCategory, ExpenseValidationResult } from "../types.ts"

export const EXPENSE_CATEGORIES: readonly ExpenseCategory[] = [
  "alimento",
  "transporte",
  "lazer",
  "saude",
  "outros",
]

export const isExpenseCategory = (value: string): value is ExpenseCategory =>
  EXPENSE_CATEGORIES.includes(value as ExpenseCategory)

export const validateExpenseDraft = (
  title: string,
  valueText: string,
  categoryValue: string,
): ExpenseValidationResult => {
  const titleError = title.trim() ? "" : "Informe um título para a despesa."
  const value = Number(valueText)
  const valueError =
    valueText.trim() === ""
      ? "Informe o valor da despesa."
      : !Number.isFinite(value) || value <= 0
        ? "O valor deve ser maior que zero."
        : ""
  const categoryError = isExpenseCategory(categoryValue)
    ? ""
    : "Selecione uma categoria."
  const errors = { title: titleError, value: valueError, category: categoryError }

  if (titleError || valueError || categoryError) {
    return { isValid: false, errors }
  }

  return {
    isValid: true,
    errors,
    draft: {
      title: title.trim(),
      value,
      category: categoryValue as ExpenseCategory,
    },
  }
}
