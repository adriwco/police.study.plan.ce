# Conjuntos e diagramas de Venn

> **Tempo:** 45 minutos · **Pré-requisito:** nenhum além das aulas anteriores

## Por que isso importa

O edital de Raciocínio Lógico cobra "operações com conjuntos" e "diagramas lógicos". O tipo clássico: "numa delegacia, 30 policiais falam inglês, 20 falam espanhol e 8 falam os dois. Quantos falam pelo menos uma língua?".

## Explicação do zero

**Conjunto** é um agrupamento de elementos. Escreve-se com chaves:

> A = {1, 2, 3} · B = {policiais da delegacia que falam inglês}

O **diagrama de Venn** desenha cada conjunto como um círculo. Onde os círculos se sobrepõem estão os elementos que pertencem aos dois.

```
      ┌──────── A ────────┐
      │        ┌──────────┼──── B ─────┐
      │  só A  │  A e B   │   só B     │
      │        └──────────┼────────────┘
      └───────────────────┘
```

## As operações

| Operação | Símbolo | Significado | Exemplo com A = {1,2,3} e B = {3,4} |
|---|---|---|---|
| **União** | A ∪ B | Está em A **ou** em B (ou nos dois) | {1, 2, 3, 4} |
| **Interseção** | A ∩ B | Está em A **e** em B | {3} |
| **Diferença** | A − B | Está em A **mas não** em B | {1, 2} |
| **Complementar** | A' | Tudo que **não** está em A (dentro do universo) | depende do universo |

**Pertence (∈):** 2 ∈ A. **Não pertence (∉):** 5 ∉ A.
**Está contido (⊂):** {1, 2} ⊂ A (um conjunto dentro de outro).
**Conjunto vazio:** ∅ = { }.

## A fórmula da união

> n(A ∪ B) = n(A) + n(B) − n(A ∩ B)

Por que subtrair a interseção? Porque quem está nos dois foi contado **duas vezes**.

## O método para problemas: comece pelo meio

> Numa delegacia: 30 falam inglês, 20 falam espanhol, 8 falam os dois e 5 não falam nenhuma. Quantos policiais há?

1. **Interseção primeiro:** 8 falam os dois.
2. **Só inglês:** 30 − 8 = 22.
3. **Só espanhol:** 20 − 8 = 12.
4. **Fora dos círculos:** 5.
5. **Total:** 22 + 8 + 12 + 5 = **47**.

## Com três conjuntos

Mesma ideia: comece pela região onde os **três** se cruzam, depois as interseções de dois a dois (descontando o centro), depois as partes "só".

## Palavras novas

| Termo | Significado |
|---|---|
| **Elemento** | Cada item do conjunto |
| **Universo** | O conjunto de todos os elementos considerados |
| **União (∪)** | "ou" |
| **Interseção (∩)** | "e" |
| n(A) | Número de elementos do conjunto A |

## Não confunda

| União (∪) | Interseção (∩) |
|---|---|
| "ou" — pelo menos um | "e" — os dois ao mesmo tempo |
| Junta tudo | Só o que é comum |

## Resumo

- União = ou; interseção = e; diferença = só em um.
- n(A ∪ B) = n(A) + n(B) − n(A ∩ B).
- Em problemas, **sempre comece pela interseção**.

## Teste-se

**1.** A = {2, 4, 6, 8} e B = {4, 8, 12}. Calcule A ∩ B e A ∪ B.

<details><summary>Ver resposta</summary>

A ∩ B = **{4, 8}**. A ∪ B = **{2, 4, 6, 8, 12}**.

</details>

**2.** Numa turma, 25 estudam Penal, 18 estudam Constitucional e 7 estudam os dois. Quantos estudam pelo menos uma das duas?

<details><summary>Ver resposta</summary>

25 + 18 − 7 = **36**.

</details>

**3.** Dos 50 candidatos de uma sala, 32 acertaram a questão 1, 28 acertaram a questão 2 e 15 acertaram as duas. Quantos erraram as duas?

<details><summary>Ver resposta</summary>

Acertaram pelo menos uma: 32 + 28 − 15 = 45. Erraram as duas: 50 − 45 = **5**.

</details>
