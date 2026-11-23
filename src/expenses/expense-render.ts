import type {
  Expense,
  ExpenseCategory,
  ExpenseRenderElements,
  ExpenseTotals,
} from "../types.ts"
import { formatCurrency } from "../shared/format.ts"

const categoryLabels: Record<ExpenseCategory, string> = {
  alimento: "Alimento",
  transporte: "Transporte",
  lazer: "Lazer",
  saude: "Saúde",
  outros: "Outros",
}
//--
//--
export const getExpenseRenderElements = (): ExpenseRenderElements => {
  const getRequired = <ElementType extends Element>(selector: string) => {
    const element = document.querySelector<ElementType>(selector)
    if (!element) throw new Error(`Elemento obrigatório não encontrado: ${selector}`)
    return element
  }
  return {
    list: getRequired<HTMLDivElement>("#expense-list"),
    template: getRequired<HTMLTemplateElement>("#expense-item-template"),
    emptyState: getRequired<HTMLParagraphElement>("#empty-state"),
    count: getRequired<HTMLSpanElement>("#expense-count"),
    total: getRequired<HTMLElement>("#total-expenses"),
    categoryTotals: {
      alimento: getRequired<HTMLElement>("#total-alimento"),
      transporte: getRequired<HTMLElement>("#total-transporte"),
      lazer: getRequired<HTMLElement>("#total-lazer"),
      saude: getRequired<HTMLElement>("#total-saude"),
      outros: getRequired<HTMLElement>("#total-outros"),
    },
  }
}

export const renderExpenses = (
  expenses: Expense[],
  elements: ExpenseRenderElements,
): void => {
  elements.list.replaceChildren()
  elements.emptyState.hidden = expenses.length > 0
  elements.count.textContent =
    expenses.length === 1 ? "1 item" : `${expenses.length} itens`

  expenses.forEach((expense) => {
    const fragment = elements.template.content.cloneNode(true) as DocumentFragment
    const item = fragment.querySelector<HTMLElement>(".expense-item")
    const icon = fragment.querySelector<HTMLElement>(".expense-category-icon")
    const title = fragment.querySelector<HTMLHeadingElement>("h3")
    const category = fragment.querySelector<HTMLSpanElement>(".expense-category")
    const value = fragment.querySelector<HTMLElement>(".expense-value")
    if (!item || !icon || !title || !category || !value) {
      throw new Error("Estrutura do template de despesa incompleta")
    }
    item.dataset.category = expense.category
    icon.textContent = categoryLabels[expense.category].charAt(0)
    title.textContent = expense.title
    category.textContent = categoryLabels[expense.category]
    value.textContent = formatCurrency(expense.value)
    elements.list.append(fragment)
  })
}

export const renderTotals = (
  total: number,
  categoryTotals: ExpenseTotals,
  elements: ExpenseRenderElements,
): void => {
  elements.total.textContent = formatCurrency(total)
  Object.entries(categoryTotals).forEach(([category, value]) => {
    elements.categoryTotals[category as ExpenseCategory].textContent =
      formatCurrency(value)
  })
}
