# Argumentos válidos e inválidos

> **Tempo:** 50 minutos · **Pré-requisito:** "Condicional", "Diagramas lógicos"

## Por que isso importa

O edital cobra "lógica de argumentação: inferências, deduções e conclusões". A questão típica dá algumas frases (premissas) e pergunta "qual conclusão é correta?".

## Explicação do zero

Um **argumento** é um conjunto de **premissas** (frases dadas como verdadeiras) que levam a uma **conclusão**.

- **Válido:** se as premissas forem verdadeiras, a conclusão é **obrigatoriamente** verdadeira.
- **Inválido:** a conclusão **pode** ser falsa mesmo com premissas verdadeiras.

**Atenção:** validade não tem a ver com a frase ser verdadeira no mundo real. Tem a ver com a **forma** do raciocínio.

> "Todo peixe voa. Nemo é peixe. Logo, Nemo voa." → **Válido** (a forma é perfeita), embora a premissa seja absurda.

## As formas válidas que mais caem

| Nome | Forma | Exemplo |
|---|---|---|
| **Modus ponens** (afirmar o antecedente) | p → q; p; logo q | Se chove, molha. Choveu. Logo, molhou. |
| **Modus tollens** (negar o consequente) | p → q; ~q; logo ~p | Se chove, molha. Não molhou. Logo, não choveu. |
| **Silogismo hipotético** | p → q; q → r; logo p → r | Se estudo, passo. Se passo, sou nomeado. Logo, se estudo, sou nomeado. |
| **Silogismo disjuntivo** | p ∨ q; ~p; logo q | Ou foi Ana ou foi Bia. Não foi Ana. Logo, foi Bia. |

## As formas inválidas (falácias) que caem como pegadinha

| Nome | Forma | Por que é inválida |
|---|---|---|
| **Afirmar o consequente** | p → q; q; logo p | Se chove, molha. Molhou. Logo choveu? **Não necessariamente** (pode ter sido um cano) |
| **Negar o antecedente** | p → q; ~p; logo ~q | Se chove, molha. Não choveu. Logo não molhou? **Não necessariamente** |

## Método para resolver questões: comece pela premissa "simples"

1. Procure a premissa que é uma **proposição simples** (ou um "e"), porque ela já te dá um valor certo.
2. Use esse valor nas outras premissas, como peças de dominó.
3. Lembre: premissas são consideradas **todas verdadeiras**.

> Premissas:
> 1. Se Ana é delegada, Bia é escrivã.
> 2. Se Bia é escrivã, Carla é perita.
> 3. Carla não é perita.
>
> Da (3): Carla não é perita. Pela (2), por modus tollens: Bia **não** é escrivã. Pela (1), modus tollens: Ana **não** é delegada.
> **Conclusão: Ana não é delegada e Bia não é escrivã.**

## Teste-se

**1.** "Se o suspeito estava no local, a câmera o filmou. A câmera o filmou. Logo, ele estava no local." É válido?

<details><summary>Ver resposta</summary>

**Inválido** (afirmar o consequente). A câmera pode tê-lo filmado em outro momento.

</details>

**2.** "Se há flagrante, a prisão é legal. A prisão não é legal. Logo, não há flagrante." É válido?

<details><summary>Ver resposta</summary>

**Válido** (modus tollens).

</details>

**3.** Premissas: "Ou João estuda ou João trabalha." "João não trabalha." Conclusão?

<details><summary>Ver resposta</summary>

**João estuda** (silogismo disjuntivo).

</details>
