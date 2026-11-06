# LibreOffice Calc: células e referências

> **Tempo:** 50 minutos + prática · **Pré-requisito:** "Writer"

## Explicação do zero

O **Calc** é a planilha do LibreOffice (equivalente ao Excel). Formato padrão: **`.ods`**.

Uma planilha é uma grade:
- **Colunas** = letras (A, B, C…).
- **Linhas** = números (1, 2, 3…).
- **Célula** = cruzamento: **B3** = coluna B, linha 3.
- **Intervalo** = conjunto de células: **A1:A10** (de A1 até A10).
- Um arquivo (**pasta de trabalho**) pode ter várias **planilhas** (abas).

## Fórmulas começam com "="

> `=A1+B1` · `=A1*2` · `=SOMA(A1:A10)`

| Operador | Significado |
|---|---|
| + − * / | Somar, subtrair, multiplicar, dividir |
| ^ | Potência (`=2^3` = 8) |
| & | Juntar textos (`="PC"&"CE"` = PCCE) |
| = <> > < >= <= | Comparações |

**Ordem:** primeiro `^`, depois `*` e `/`, depois `+` e `−`. Parênteses mudam a ordem.
> `=2+3*4` = 14 · `=(2+3)*4` = 20

## Referências relativas, absolutas e mistas (o que mais cai!)

Quando você **copia** uma fórmula para outra célula, as referências **se ajustam** — a menos que estejam "travadas" com **$**.

| Tipo | Escrita | Ao copiar |
|---|---|---|
| **Relativa** | A1 | Coluna e linha mudam |
| **Absoluta** | $A$1 | Nada muda |
| **Mista** | $A1 | Coluna travada, linha muda |
| **Mista** | A$1 | Linha travada, coluna muda |

**Como calcular:** conte quantas colunas e linhas a fórmula "andou" e aplique só no que **não** tem $.

> Em C1 está `=A1+$B$1`. Copio C1 para **D3** (andou 1 coluna e 2 linhas).
> A1 → **B3** (relativa: +1 coluna, +2 linhas). $B$1 → **$B$1** (absoluta).
> Resultado em D3: `=B3+$B$1`.

> Em B2 está `=$A2*C$1`. Copio para **C4** (+1 coluna, +2 linhas).
> $A2 → **$A4** (coluna travada, linha muda). C$1 → **D$1** (linha travada, coluna muda).
> Resultado: `=$A4*D$1`.

**Atalho para alternar o tipo de referência:** **Shift + F4** no Calc (F4 no Excel).

## Referência a outra planilha

> Calc: `=Planilha2.A1` · Excel: `=Planilha2!A1`

## Teste-se

**1.** Em A5 está `=A1+B1`. Copio para B6. Qual a fórmula?

<details><summary>Ver resposta</summary>

Andou +1 coluna e +1 linha → `=B2+C2`.

</details>

**2.** Em C2 está `=$A$1*B2`. Copio para C10. Qual a fórmula?

<details><summary>Ver resposta</summary>

`=$A$1*B10`.

</details>

**3.** Qual o resultado de `=10-2^2*2`?

<details><summary>Ver resposta</summary>

2² = 4 → 4 × 2 = 8 → 10 − 8 = **2**.

</details>

**4.** Qual a extensão padrão do Calc?

<details><summary>Ver resposta</summary>

**.ods**.

</details>
