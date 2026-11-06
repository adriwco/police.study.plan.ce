# Calc: fórmulas e funções

> **Tempo:** 55 minutos + prática · **Pré-requisito:** "Calc: células e referências"

## As funções mais cobradas

| Função | O que faz | Exemplo | Resultado |
|---|---|---|---|
| `SOMA` | Soma | `=SOMA(A1:A5)` | soma de A1 até A5 |
| `MÉDIA` | Média aritmética | `=MÉDIA(A1:A5)` | média |
| `MÁXIMO` / `MÍNIMO` | Maior / menor valor | `=MÁXIMO(A1:A5)` | — |
| `CONT.NÚM` | Conta células com **números** | `=CONT.NÚM(A1:A10)` | — |
| `CONT.VALORES` | Conta células **não vazias** | `=CONT.VALORES(A1:A10)` | — |
| `CONTAR.VAZIO` | Conta células **vazias** | — | — |
| `CONT.SE` | Conta células que atendem a um critério | `=CONT.SE(B1:B10;">=7")` | quantas notas ≥ 7 |
| `SOMASE` | Soma as que atendem a um critério | `=SOMASE(A1:A10;"Penal";B1:B10)` | soma de B onde A = Penal |
| `SE` | Testa uma condição | `=SE(A1>=60;"Aprovado";"Reprovado")` | — |
| `E` / `OU` | Combina condições | `=SE(E(A1>=50;B1>=15);"OK";"Não")` | — |
| `PROCV` | Procura um valor na **1ª coluna** de uma tabela e devolve outra coluna da mesma linha | `=PROCV("Ana";A2:C20;3;0)` | 3ª coluna da linha de Ana |
| `ARRED` | Arredonda | `=ARRED(3,456;2)` | 3,46 |
| `HOJE()` / `AGORA()` | Data atual / data e hora | — | — |
| `CONCATENAR` | Junta textos | `=CONCATENAR(A1;" ";B1)` | — |

**Separador de argumentos:** no Calc em português, **ponto e vírgula (;)**. O intervalo usa **dois-pontos (:)**.

> `=SOMA(A1:A3)` → A1 + A2 + A3 · `=SOMA(A1;A3)` → só A1 + A3

## SE passo a passo

> `=SE(teste; valor_se_verdadeiro; valor_se_falso)`

> Em B2 está a nota. `=SE(B2>=72;"Meta batida";"Continuar")`

## PROCV passo a passo

> `=PROCV(o que procurar; onde procurar; número da coluna a devolver; 0)`

- O **0** (ou FALSO) significa **correspondência exata**.
- O valor procurado tem de estar na **primeira coluna** do intervalo.

## Erros comuns

| Erro | Causa |
|---|---|
| `#DIV/0!` | Divisão por zero |
| `#NOME?` | Nome de função escrito errado |
| `#REF!` | Referência a célula que não existe mais |
| `#VALOR!` | Tipo de dado errado (somar texto) |
| `#N/D` | Valor não encontrado (PROCV) |
| `###` | Coluna estreita demais para mostrar o número |

## Teste-se

A1 = 10, A2 = 20, A3 = vazio, A4 = "PC", A5 = 30.

**1.** `=SOMA(A1:A5)`?

<details><summary>Ver resposta</summary>

**60** (texto e vazio são ignorados).

</details>

**2.** `=CONT.NÚM(A1:A5)`?

<details><summary>Ver resposta</summary>

**3**.

</details>

**3.** `=CONT.VALORES(A1:A5)`?

<details><summary>Ver resposta</summary>

**4** (conta tudo que não está vazio, inclusive o texto).

</details>

**4.** `=MÉDIA(A1:A5)`?

<details><summary>Ver resposta</summary>

60 ÷ 3 = **20** (só os números entram na média).

</details>

**5.** `=SE(A5>A2;"maior";"menor")`?

<details><summary>Ver resposta</summary>

**"maior"** (30 > 20).

</details>
