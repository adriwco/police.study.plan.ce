# Probabilidade em Estatística: axiomas, condicional e independência

> **Tempo:** 45 minutos · **Pré-requisito:** Raciocínio Lógico — "Probabilidade"

## Revisão rápida

A base está na aula de Probabilidade do Módulo 3. Aqui, os conceitos formais que o edital de Estatística cita.

## Definições e axiomas

| Termo | Significado |
|---|---|
| **Experimento aleatório** | Pode ser repetido e o resultado não é previsível (lançar dado) |
| **Espaço amostral (Ω)** | Conjunto de **todos** os resultados possíveis |
| **Evento** | Qualquer subconjunto do espaço amostral |
| **Eventos mutuamente exclusivos** | **Não** podem ocorrer juntos (A ∩ B = ∅) |

**Axiomas (Kolmogorov):** (1) 0 ≤ P(A) ≤ 1; (2) P(Ω) = 1; (3) se A e B são mutuamente exclusivos, P(A ∪ B) = P(A) + P(B).

## Probabilidade condicional

> **P(A | B) = P(A ∩ B) ÷ P(B)** — "probabilidade de A, **dado que** B ocorreu"

> Numa delegacia, 60% dos casos são de furto, e 15% de todos os casos são furtos de celular. Sabendo que o caso é um furto, qual a chance de ser de celular?
> P(celular | furto) = 0,15 ÷ 0,60 = **0,25** (25%).

## Independência

Dois eventos são **independentes** quando a ocorrência de um **não altera** a probabilidade do outro:

> **P(A ∩ B) = P(A) × P(B)**   ⇔   P(A | B) = P(A)

| Independentes | Mutuamente exclusivos |
|---|---|
| Podem ocorrer juntos; um não influencia o outro | **Não** podem ocorrer juntos |
| P(A ∩ B) = P(A) · P(B) | P(A ∩ B) = 0 |

## Teorema da probabilidade total e Bayes (noção)

Quando um evento pode acontecer por vários "caminhos", soma-se a probabilidade de cada caminho (probabilidade total). O **Teorema de Bayes** "inverte" a condicional: dado que o efeito ocorreu, qual a chance de cada causa.

## Teste-se

**1.** P(A ∩ B) = 0,12, P(B) = 0,4. Qual P(A | B)?

<details><summary>Ver resposta</summary>

0,12 ÷ 0,4 = **0,3**.

</details>

**2.** P(A) = 0,5, P(B) = 0,2, e A e B são independentes. Qual P(A ∩ B)?

<details><summary>Ver resposta</summary>

0,5 × 0,2 = **0,1**.

</details>

**3.** Eventos mutuamente exclusivos podem ser independentes (com probabilidades positivas)?

<details><summary>Ver resposta</summary>

**Não**; se um ocorre, o outro fica impossível — logo, um afeta o outro.

</details>
