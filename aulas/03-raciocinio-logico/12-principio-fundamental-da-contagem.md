# Princípio fundamental da contagem

> **Tempo:** 35 minutos · **Pré-requisito:** Matemática — "Potências e raízes"

## Por que isso importa

"Quantas placas…", "quantas senhas…", "de quantas formas…". Toda a análise combinatória nasce de uma ideia só: **multiplicar as possibilidades de cada etapa**.

## Explicação do zero

Se uma decisão tem **a** opções e a seguinte tem **b** opções, o total de combinações é **a × b**.

> Você tem 3 camisas e 2 calças. Quantas roupas diferentes pode montar?
> 3 × 2 = **6**.

```
Camisa 1 ── Calça A
         └─ Calça B
Camisa 2 ── Calça A
         └─ Calça B
Camisa 3 ── Calça A
         └─ Calça B      → 6 combinações
```

## Método dos "tracinhos"

1. Desenhe um tracinho para cada posição/etapa.
2. Escreva em cada tracinho quantas opções existem **naquele momento**.
3. Multiplique.

> Senha de 4 dígitos (0 a 9), **podendo repetir**:
> \_10\_ × \_10\_ × \_10\_ × \_10\_ = **10.000**

> Senha de 4 dígitos **sem repetir**:
> \_10\_ × \_9\_ × \_8\_ × \_7\_ = **5.040**

## Restrições: comece pela posição mais exigente

> Números de 3 algarismos **pares**, com os algarismos 1, 2, 3, 4, 5, sem repetir.
> Comece pela última posição (precisa ser par: 2 ou 4) → 2 opções.
> Primeira posição: sobram 4. Segunda: sobram 3.
> 4 × 3 × 2 = **24**.

## "E" multiplica, "ou" soma

- Escolher uma camisa **e** uma calça → multiplica.
- Ir de ônibus (3 linhas) **ou** de metrô (2 linhas) → soma: 3 + 2 = 5 formas.

## Teste-se

**1.** Uma placa tem 3 letras (26 opções cada) e 4 algarismos (10 opções cada), podendo repetir. Quantas placas existem?

<details><summary>Ver resposta</summary>

26³ × 10⁴ = 17.576 × 10.000 = **175.760.000**.

</details>

**2.** De quantas formas 4 policiais podem formar uma fila?

<details><summary>Ver resposta</summary>

4 × 3 × 2 × 1 = **24**.

</details>

**3.** Um restaurante tem 3 entradas, 4 pratos principais e 2 sobremesas. Quantos menus completos (um de cada) existem?

<details><summary>Ver resposta</summary>

3 × 4 × 2 = **24**.

</details>
