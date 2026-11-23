import "./style.css"
import type { Expense } from "./types.ts"
import { calculateExpenseTotals, createExpense } from "./expenses/expense-state.ts"
import {
  getExpenseRenderElements,
  renderExpenses,
  renderTotals,
} from "./expenses/expense-render.ts"
import { validateExpenseDraft } from "./expenses/expense-validation.ts"

const getRequired = <ElementType extends Element>(selector: string) => {
  const element = document.querySelector<ElementType>(selector)
  if (!element) throw new Error(`Elemento obrigatório não encontrado: ${selector}`)
  return element
}

const form = getRequired<HTMLFormElement>("#expense-form")
const titleInput = getRequired<HTMLInputElement>("#expense-title")
const valueInput = getRequired<HTMLInputElement>("#expense-value")
const categoryInput = getRequired<HTMLSelectElement>("#expense-category")
const titleError = getRequired<HTMLSpanElement>("#title-error")
const valueError = getRequired<HTMLSpanElement>("#value-error")
const categoryError = getRequired<HTMLSpanElement>("#category-error")
const renderElements = getExpenseRenderElements()

const expenses: Expense[] = []

const clearErrors = (): void => {
  titleError.textContent = ""
  valueError.textContent = ""
  categoryError.textContent = ""
  titleInput.removeAttribute("aria-invalid")
  valueInput.removeAttribute("aria-invalid")
  categoryInput.removeAttribute("aria-invalid")
}

const showErrors = (
  errors: { title: string; value: string; category: string },
): void => {
  titleError.textContent = errors.title
  valueError.textContent = errors.value
  categoryError.textContent = errors.category
  titleInput.setAttribute("aria-invalid", String(Boolean(errors.title)))
  valueInput.setAttribute("aria-invalid", String(Boolean(errors.value)))
  categoryInput.setAttribute("aria-invalid", String(Boolean(errors.category)))
}

const refresh = (): void => {
  const totals = calculateExpenseTotals(expenses)
  renderExpenses(expenses, renderElements)
  renderTotals(totals.total, totals.categoryTotals, renderElements)
}

form.addEventListener("submit", (event) => {
  event.preventDefault()
  clearErrors()

  const result = validateExpenseDraft(
    titleInput.value,
    valueInput.value,
    categoryInput.value,
  )
  showErrors(result.errors)

  if (!result.isValid || !result.draft) return

  expenses.push(createExpense(result.draft))
  refresh()
  form.reset()
  titleInput.focus()
})

titleInput.addEventListener("input", () => {
  titleError.textContent = ""
  titleInput.removeAttribute("aria-invalid")
})
valueInput.addEventListener("input", () => {
  valueError.textContent = ""
  valueInput.removeAttribute("aria-invalid")
})
categoryInput.addEventListener("change", () => {
  categoryError.textContent = ""
  categoryInput.removeAttribute("aria-invalid")
})

refresh()
