# Projeto: Painel de despesas

O projeto vai usar Vite com Vanilla-Typescript

## 2. Stack

- Vite
- TypeScript
- HTML5
- CSS moderno
- Sem backend
- Sem banco de dados
- Sem persistencia
- Sem framework de UI

## 3. Estrutura de arquivos esperada

```text
.
├── index.html
├── package.json
├── tsconfig.json
└── src/
    ├── assets/
    ├── main.ts
    ├── style.css
    └── types.ts
```

### Estrutura recomendada ao adicionar receitas

Ao implementar receitas, criar modulos separados para manter despesas e receitas independentes:

```text
src/
├── expenses/
│   ├── expense-state.ts
│   ├── expense-render.ts
│   └── expense-validation.ts
├── incomes/
│   ├── income-state.ts
│   ├── income-render.ts
│   └── income-validation.ts
├── shared/
│   └── format.ts
├── main.ts
├── style.css
└── types.ts
```

Essa estrutura nao exige reescrever o projeto atual. Ela pode ser adotada apenas quando a funcionalidade de receitas passar a existir.

### Responsabilidades do modulo de receitas

O modulo de receitas deve conter exclusivamente:

- O estado das receitas.
- Os tipos em `src/types.ts`.
- O formulario e os handlers da interface de receitas.
- A validacao dos dados recebidos.
- O calculo do total de receitas.
- A renderizacao da lista e dos resumos de receitas.

Nao colocar regra de receitas diretamente em funcoes de despesas ou em manipuladores DOM compartilhados.

### Tipos recomendados para receitas

Todos os tipos devem continuar centralizados em `src/types.ts`:

```ts
export type IncomeCategory =
  | "salario"
  | "freelance"
  | "investimentos"
  | "outros"

export type Income = {
  id: string
  title: string
  value: number
  category: IncomeCategory
}

export type IncomeDraft = {
  title: string
  value: number
  category: IncomeCategory
}
```

Exemplo de extensao futura do modelo comum:

```ts
export type Transaction =
  | { kind: "expense"; data: Expense }
  | { kind: "income"; data: Income }
```

Esse modelo comum nao precisa ser criado antes de existir uma necessidade real de relatórios ou de operacoes que misturem receitas e despesas.

### Fluxo recomendado

1. Definir os requisitos da receita.
2. Registrar decisoes arquiteturais quando necessario.
3. Adicionar os tipos em `src/types.ts`.
4. Criar o modulo `src/incomes/`.
5. Implementar validacao e calculo em funcoes puras.
6. Definir a estrutura semantica da receita em `index.html`.
7. Registrar os eventos em `main.ts` ou em um modulo chamado por `main.ts`.
8. Renderizar receitas sem reconstruir manualmente toda a pagina.
9. Integrar os totais ao resumo geral sem acoplar receitas a despesas.
10. Executar os testes manuais planejados e o build.

### Integracao com despesas

As integracoes existentes podem seguir estes niveis:

- **Nivel 1:** despesas e receitas sao exibidas em secoes separadas, com totais separados.
- **Nivel 2:** um resumo geral calcula saldo como `total de receitas - total de despesas`.
- **Nivel 3:** um modulo de transacoes combina despesas e receitas em uma unica visao.

A implementacao nao deve pular diretamente para o Nivel 3 sem uma necessidade funcional definida.

Exemplo simples de resultado geral:

```ts
const balance = totalIncomes - totalExpenses
```

Esse calculo deve ficar em uma funcao dedicada, nao dentro de uma funcao de renderizacao.

### Regras para extensibilidade

- Evitar alterar o comportamento de despesas ao adicionar receitas.
- Nao usar `any` para contornar tipos da aplicacao.
- Nao guardar receitas dentro do array `expenses`.
- Nao acoplar calculos aos elementos HTML.
- Compartilhar apenas utilitarios realmente comuns, como formatacao de moeda.
- Manter todos os tipos em `src/types.ts`.
- Usar `type` em vez de `interface`.
- Preservar HTML semantico em `index.html`.
- Registrar todos os eventos em TypeScript.
- Atualizar a documentacao quando uma nova funcionalidade alterar escopo ou arquitetura.
- Executar `npm run build` apos qualquer integracao.

### Adicao de outras funcionalidades

Para funcionalidades como exportacao, filtros, edicao ou persistencia:

1. Criar um modulo proprio com uma responsabilidade clara.
2. Adicionar tipos necessarios em `src/types.ts`.
3. Separar validacao, estado e apresentacao.
4. Verificar se os requisitos exigem mudanca no modelo de dados.
5. Atualizar o HTML sem introduzir handlers inline.
6. Documentar decisoes relevantes.


## 7. Constantes

Definir as categorias em `main.ts` ou em `types.ts` conforme responsabilidade:

```ts
export const EXPENSE_CATEGORIES: readonly ExpenseCategory[] = [
  "alimento",
  "transporte",
  "lazer",
  "saude",
  "outros",
]
```

Usar a constante para:

- Popular ou validar o select.
- Inicializar totais das categorias.
- Percorrer os totais no render.

O select do HTML pode ja conter as opcoes fixas. O TypeScript pode validar o valor selecionado para evitar inconsistencias.

# Publicar no GitHub Pages


## Aplicação online

[🚀 **Acesse o Painel de despesas**](https://juniorcorpse.github.io/expenses/)
