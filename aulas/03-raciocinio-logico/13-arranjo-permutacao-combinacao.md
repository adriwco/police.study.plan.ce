# Arranjo, permutação e combinação

> **Tempo:** 55 minutos · **Pré-requisito:** "Princípio fundamental da contagem"

## Por que isso importa

São atalhos para contar mais rápido. O segredo não é decorar fórmula, é responder uma pergunta: **a ordem importa?**

## Fatorial (!)

> n! = n × (n − 1) × (n − 2) × … × 1
> 5! = 5 × 4 × 3 × 2 × 1 = 120 · 0! = 1 (por definição)

## A pergunta-chave

> Se eu **trocar a ordem** dos escolhidos, vira uma coisa **diferente**?

- **Sim → a ordem importa → arranjo (ou permutação).**
- **Não → a ordem não importa → combinação.**

| Situação | Ordem importa? | Tipo |
|---|---|---|
| Escolher presidente, vice e secretário de 10 pessoas | Sim (cargos diferentes) | Arranjo |
| Escolher 3 pessoas para uma comissão de 10 | Não (todos iguais na comissão) | Combinação |
| Organizar 5 pessoas numa fila | Sim, e usa **todos** | Permutação |
| Senha de 4 dígitos distintos | Sim | Arranjo |
| Escolher 6 números na Mega-Sena | Não | Combinação |

## Permutação: organizar todos

> Pₙ = n!

> De quantas formas 5 investigadores podem ser escalados em 5 plantões diferentes? 5! = **120**.

**Anagramas:** permutação das letras. "AMOR" tem 4! = 24 anagramas.
Com letras repetidas, divide pelo fatorial das repetições: "ARARA" (A ×3, R ×2) = 5! ÷ (3! × 2!) = 120 ÷ 12 = **10**.

## Arranjo: escolher alguns, a ordem importa

> A(n, p) = n! ÷ (n − p)!

Na prática, use tracinhos: escolher 3 de 10 com ordem = 10 × 9 × 8 = **720**.

## Combinação: escolher alguns, a ordem não importa

> C(n, p) = n! ÷ [p! × (n − p)!]

Na prática: faça o arranjo e **divida por p!** (para eliminar as ordens repetidas).

> Comissão de 3 entre 10: (10 × 9 × 8) ÷ (3 × 2 × 1) = 720 ÷ 6 = **120**.

**Atalho:** C(n, p) = C(n, n − p). Escolher 8 de 10 = escolher 2 de 10 para ficar de fora = (10 × 9) ÷ 2 = 45.

## Teste-se

**1.** De quantas formas se escolhem 2 policiais entre 6 para uma operação (sem funções diferentes)?

<details><summary>Ver resposta</summary>

Combinação: (6 × 5) ÷ 2 = **15**.

</details>

**2.** E se um for o motorista e o outro o comandante?

<details><summary>Ver resposta</summary>

Arranjo: 6 × 5 = **30**.

</details>

**3.** Quantos anagramas tem a palavra "PROVA"?

<details><summary>Ver resposta</summary>

5! = **120**.

</details>

**4.** Uma comissão de 4 pessoas será formada com 7 candidatos. Quantas comissões são possíveis?

<details><summary>Ver resposta</summary>

(7 × 6 × 5 × 4) ÷ (4 × 3 × 2 × 1) = 840 ÷ 24 = **35**.

</details>
