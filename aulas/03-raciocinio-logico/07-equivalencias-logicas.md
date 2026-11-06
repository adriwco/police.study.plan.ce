# Equivalências lógicas

> **Tempo:** 50 minutos · **Pré-requisito:** "Negação e Leis de De Morgan"

## Por que isso importa

"Assinale a frase equivalente a…" é o outro grande tipo de questão de lógica. **Equivalente** = diz a mesma coisa, com outras palavras: tem a **mesma tabela-verdade**.

## As três equivalências do condicional (decore)

Partindo de **p → q** ("Se chove, a rua molha"):

| # | Equivalência | Frase | Macete |
|---|---|---|---|
| 1 | **~q → ~p** (contrapositiva) | "Se a rua **não** molhou, **não** choveu." | **Inverte e nega** as duas |
| 2 | **~p ∨ q** | "**Não** chove **ou** a rua molha." | **NEYMAR: NEga a primeira, Mantém a segunda, troca por OU** |
| 3 | **~(p ∧ ~q)** | "Não é verdade que chove e a rua não molha." | É a negação da negação |

### O que NÃO é equivalente (pegadinhas)

| Frase | É equivalente a p → q? |
|---|---|
| q → p ("se a rua molha, choveu") — a **recíproca** | ❌ Não |
| ~p → ~q ("se não chove, a rua não molha") — a **inversa** | ❌ Não |

## Outras equivalências úteis

| Proposição | Equivalente |
|---|---|
| p ↔ q | (p → q) ∧ (q → p) |
| p ∧ q | q ∧ p (comutativa) |
| p ∨ q | q ∨ p |
| p ∨ q | ~p → q ("se não p, então q") |
| ~(p ∧ q) | ~p ∨ ~q (De Morgan) |
| ~(p ∨ q) | ~p ∧ ~q (De Morgan) |

## Exemplo de prova

> Equivalente a "Se Pedro é investigador, então Pedro é policial civil":
> (A) Se Pedro é policial civil, então é investigador. ❌ (recíproca)
> (B) Se Pedro não é investigador, então não é policial civil. ❌ (inversa)
> (C) **Se Pedro não é policial civil, então não é investigador.** ✅ (contrapositiva)
> (D) **Pedro não é investigador ou é policial civil.** ✅ (NEYMAR)

## Teste-se

**1.** Escreva a contrapositiva de "Se o laudo saiu, o inquérito foi concluído".

<details><summary>Ver resposta</summary>

"Se o inquérito **não** foi concluído, o laudo **não** saiu."

</details>

**2.** Escreva com "ou" a frase "Se estudo, passo".

<details><summary>Ver resposta</summary>

"**Não** estudo **ou** passo."

</details>

**3.** "Ana não é perita ou é policial" equivale a qual condicional?

<details><summary>Ver resposta</summary>

"**Se** Ana é perita, **então** é policial" (~p ∨ q ≡ p → q).

</details>

**4.** Certo ou errado: "'Se chove, molha' é equivalente a 'Se molha, choveu'."

<details><summary>Ver resposta</summary>

**Errado.** Essa é a recíproca, que **não** é equivalente.

</details>
