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
const githubAvatar = getRequired<HTMLImageElement>("#github-avatar")
const githubName = getRequired<HTMLElement>("#github-name")
const githubProfileStatus = getRequired<HTMLParagraphElement>("#github-profile-status")
const githubDeveloperName = getRequired<HTMLElement>("#github-developer-name")
const githubProjectDescription = getRequired<HTMLParagraphElement>("#github-project-description")

githubAvatar.addEventListener("error", () => {
  githubAvatar.hidden = true
  githubProfileStatus.textContent = "Não foi possível carregar a foto de perfil."
})

type GithubProfile = {
  login: string
  name: string | null
  avatar_url: string
}

type GithubRepository = {
  description: string | null
}

const isGithubProfile = (value: unknown): value is GithubProfile =>
  typeof value === "object" &&
  value !== null &&
  "login" in value &&
  typeof value.login === "string" &&
  "name" in value &&
  (typeof value.name === "string" || value.name === null) &&
  "avatar_url" in value &&
  typeof value.avatar_url === "string"

const isGithubRepository = (value: unknown): value is GithubRepository =>
  typeof value === "object" &&
  value !== null &&
  "description" in value &&
  (typeof value.description === "string" || value.description === null)

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

const loadGithubProfile = async (): Promise<void> => {
  try {
    const response = await fetch("https://api.github.com/users/Juniorcorpse", {
      headers: { Accept: "application/vnd.github+json" },
    })
    if (!response.ok) throw new Error(`GitHub respondeu com status ${response.status}`)

    const data: unknown = await response.json()
    if (!isGithubProfile(data)) throw new Error("Resposta de perfil inválida")

    const displayName = data.name?.trim() || data.login
    githubName.textContent = displayName
    githubDeveloperName.textContent = displayName
    githubAvatar.src = data.avatar_url
    githubAvatar.hidden = false
    githubProfileStatus.textContent = ""
  } catch (error) {
    console.error("Não foi possível carregar o perfil do GitHub.", error)
    githubName.textContent = "Juniorcorpse"
    githubDeveloperName.textContent = "Não disponível"
    githubProfileStatus.textContent = "Não foi possível carregar o perfil do GitHub."
  }
}

const loadGithubRepositoryDescription = async (): Promise<void> => {
  try {
    const response = await fetch("https://api.github.com/repos/Juniorcorpse/expenses", {
      headers: { Accept: "application/vnd.github+json" },
    })
    if (!response.ok) throw new Error(`GitHub respondeu com status ${response.status}`)

    const data: unknown = await response.json()
    if (!isGithubRepository(data)) throw new Error("Resposta do repositório inválida")

    githubProjectDescription.textContent =
      data.description || "Nenhuma descrição informada no GitHub."
  } catch (error) {
    console.error("Não foi possível carregar a descrição do projeto.", error)
    githubProjectDescription.textContent =
      "Não foi possível carregar a descrição do projeto."
  }
}

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
void loadGithubProfile()
void loadGithubRepositoryDescription()
