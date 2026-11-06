# Tabela-verdade

> **Tempo:** 45 minutos · **Pré-requisito:** "Condicional e bicondicional"

## Por que isso importa

A tabela-verdade é a ferramenta que **testa qualquer proposição composta** em todas as combinações possíveis. Com ela você confere equivalências, tautologias e negações sem decorar nada.

## Quantas linhas a tabela tem?

> **Número de linhas = 2ⁿ**, onde n é o número de proposições simples **diferentes**.

| Proposições | Linhas |
|---|---|
| 1 (p) | 2 |
| 2 (p, q) | 4 |
| 3 (p, q, r) | 8 |
| 4 | 16 |

Isso é questão direta de prova: "quantas linhas tem a tabela-verdade de (p ∧ q) → (r ∨ ~s)?" → 4 proposições → **16 linhas**.

## Como montar (passo a passo)

**Exemplo:** (p ∧ q) → ~p

**1. Preencha as colunas das proposições simples** — a primeira coluna alterna em blocos de metade, a seguinte em blocos menores:

| p | q |
|---|---|
| V | V |
| V | F |
| F | V |
| F | F |

**2. Resolva por partes, de dentro para fora** (como numa expressão com parênteses):

| p | q | p ∧ q | ~p | (p ∧ q) → ~p |
|---|---|---|---|---|
| V | V | V | F | **F** |
| V | F | F | F | **V** |
| F | V | F | V | **V** |
| F | F | F | V | **V** |

**3. A última coluna é o resultado.**

## Ordem de precedência (quem resolve primeiro)

1. Parênteses
2. Negação (~)
3. Conjunção (∧) e disjunção (∨)
4. Condicional (→)
5. Bicondicional (↔)

## Atalho para questões: atribua valores e teste

Muitas questões dão os valores ("sabe-se que p é V e q é F") e pedem o valor da composta. Não precisa da tabela inteira — substitua e resolva só uma linha.

> p = V, q = F. Valor de (p ∨ q) → (p ∧ q)?
> (V ∨ F) → (V ∧ F) = V → F = **F**.

## Teste-se

**1.** Quantas linhas tem a tabela-verdade de (p → q) ∧ (q → r)?

<details><summary>Ver resposta</summary>

3 proposições → 2³ = **8 linhas**.

</details>

**2.** Monte a tabela de p ∨ ~q.

<details><summary>Ver resposta</summary>

| p | q | ~q | p ∨ ~q |
|---|---|---|---|
| V | V | F | V |
| V | F | V | V |
| F | V | F | F |
| F | F | V | V |

</details>

**3.** Sendo p = F, q = V e r = F, qual o valor de (p → q) ∧ r?

<details><summary>Ver resposta</summary>

(F → V) ∧ F = V ∧ F = **F**.

</details>
