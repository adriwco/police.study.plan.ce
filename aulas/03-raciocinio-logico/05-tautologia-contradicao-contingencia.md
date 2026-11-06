# Tautologia, contradição e contingência

> **Tempo:** 25 minutos · **Pré-requisito:** "Tabela-verdade"

## Explicação do zero

Depois de montar a tabela-verdade, olhe a **última coluna**:

| Se a última coluna for… | Nome | Exemplo |
|---|---|---|
| **Toda V** | **Tautologia** (sempre verdadeira) | p ∨ ~p ("ou chove, ou não chove") |
| **Toda F** | **Contradição** (sempre falsa) | p ∧ ~p ("chove e não chove") |
| **Misturada** | **Contingência** (depende) | p → q |

## Exemplo resolvido

É tautologia? **p → (p ∨ q)**

| p | q | p ∨ q | p → (p ∨ q) |
|---|---|---|---|
| V | V | V | V |
| V | F | V | V |
| F | V | V | V |
| F | F | F | V |

Toda V → **tautologia**.

## Atalho para testar tautologia com condicional

Um condicional só é falso em V → F. Então **tente fazer o antecedente V e o consequente F**. Se for impossível, é tautologia.

> p → (p ∨ q): para o consequente (p ∨ q) ser F, p tem de ser F. Mas aí o antecedente (p) é F. Impossível ter V → F. **Tautologia.**

## Teste-se

**1.** Classifique p ∧ ~p.

<details><summary>Ver resposta</summary>

**Contradição** (nunca é verdadeira).

</details>

**2.** Classifique p ∨ q.

<details><summary>Ver resposta</summary>

**Contingência** (é F quando os dois são F, e V nos outros casos).

</details>

**3.** Classifique (p ∧ q) → p.

<details><summary>Ver resposta</summary>

**Tautologia**: para o consequente (p) ser F, o antecedente (p ∧ q) também seria F; nunca ocorre V → F.

</details>
