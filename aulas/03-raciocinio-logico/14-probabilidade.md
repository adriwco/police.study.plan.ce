# Probabilidade

> **Tempo:** 55 minutos · **Pré-requisito:** "Princípio fundamental da contagem", Matemática — "Frações"

## Por que isso importa

Cai em Raciocínio Lógico e em Estatística. É a matemática da **chance**.

## Explicação do zero

> **Probabilidade = casos favoráveis ÷ casos possíveis**

> Um dado tem 6 faces. Qual a chance de sair 4? 1 favorável ÷ 6 possíveis = **1/6**.
> Chance de sair número par? {2, 4, 6} = 3 ÷ 6 = **1/2** = 50%.

A probabilidade sempre fica entre **0** (impossível) e **1** (certo).

## Evento complementar

> P(não A) = 1 − P(A)

> Chance de **não** sair 6 num dado: 1 − 1/6 = **5/6**.

Muito útil com "**pelo menos um**": calcule a chance de **nenhum** e subtraia de 1.

> Lançando uma moeda 3 vezes, chance de sair **pelo menos uma** cara?
> Chance de nenhuma cara (3 coroas) = (1/2)³ = 1/8 → 1 − 1/8 = **7/8**.

## "E" multiplica (eventos independentes)

> Chance de tirar cara na moeda **e** 6 no dado: 1/2 × 1/6 = **1/12**.

## "Ou" soma (eventos que não acontecem juntos)

> Chance de sair 1 **ou** 2 num dado: 1/6 + 1/6 = **2/6 = 1/3**.

Se os eventos **podem** acontecer juntos, subtraia a interseção:
> P(A ou B) = P(A) + P(B) − P(A e B)

## Sem reposição

Quando se retira algo e não se devolve, o total **diminui**.

> Uma urna tem 3 bolas brancas e 2 pretas. Retiram-se 2 sem reposição. Chance de as duas serem brancas?
> 1ª branca: 3/5. 2ª branca (sobraram 2 brancas de 4): 2/4.
> 3/5 × 2/4 = 6/20 = **3/10**.

## Probabilidade condicional

Chance de A **sabendo que** B aconteceu: o universo passa a ser só B.

> Numa turma, 10 dos 30 alunos são da PC; desses 10, 4 são mulheres. Sorteando alguém **da PC**, qual a chance de ser mulher? 4/10 = **2/5**.

## Teste-se

**1.** Numa caixa há 4 canetas azuis e 6 pretas. Qual a chance de sortear uma azul?

<details><summary>Ver resposta</summary>

4/10 = **2/5** (40%).

</details>

**2.** Lançam-se dois dados. Qual a chance de sair 6 nos dois?

<details><summary>Ver resposta</summary>

1/6 × 1/6 = **1/36**.

</details>

**3.** A chance de um candidato acertar uma questão no chute é 1/5. Qual a chance de errar?

<details><summary>Ver resposta</summary>

1 − 1/5 = **4/5**.

</details>

**4.** Chutando 2 questões de 5 alternativas, qual a chance de acertar pelo menos uma?

<details><summary>Ver resposta</summary>

Chance de errar as duas: 4/5 × 4/5 = 16/25. Pelo menos uma: 1 − 16/25 = **9/25** (36%).

</details>
