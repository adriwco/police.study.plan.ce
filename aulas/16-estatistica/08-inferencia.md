# Inferência estatística e regressão (noções)

> **Tempo:** 45 minutos · **Pré-requisito:** "Distribuição normal", "Amostragem"

## Inferência: da amostra para a população

| Tipo | O que faz | Exemplo |
|---|---|---|
| **Estimação pontual** | Um **único valor** como estimativa | "A taxa de resolução é 32%" |
| **Estimação intervalar** (intervalo de confiança) | Uma **faixa** de valores com certo **nível de confiança** | "Entre 29% e 35%, com 95% de confiança" |
| **Teste de hipóteses** | Decide, com base na amostra, se uma afirmação sobre a população deve ser **rejeitada** | "A nova operação reduziu os roubos?" |

**Propriedades de um bom estimador:** **não viesado** (em média acerta o parâmetro), **eficiente** (menor variância), **consistente** (melhora com amostras maiores), **suficiente** (usa toda a informação da amostra).

## Intervalo de confiança

> IC = estimativa ± (valor crítico × erro-padrão)

- **95% de confiança** significa: se repetíssemos o processo muitas vezes, cerca de 95% dos intervalos conteriam o valor real.
- **Mais confiança → intervalo mais largo**. **Amostra maior → intervalo mais estreito**.

## Teste de hipóteses

| Termo | Significado |
|---|---|
| **H₀ (hipótese nula)** | A hipótese de "**não há efeito/diferença**" — é a que se testa |
| **H₁ (alternativa)** | O que se quer mostrar |
| **Nível de significância (α)** | Probabilidade máxima aceita de cometer o **erro tipo I** (em geral 5%) |
| **Erro tipo I** | **Rejeitar H₀ verdadeira** ("condenar um inocente") |
| **Erro tipo II (β)** | **Não rejeitar H₀ falsa** ("absolver um culpado") |
| **Poder do teste** | 1 − β: probabilidade de rejeitar H₀ quando ela é falsa |
| **Valor-p** | Se o **valor-p < α**, **rejeita-se H₀** |

**Testes citados no edital:** **t de Student** (comparar médias, amostras pequenas, variância desconhecida); **qui-quadrado** (associação entre variáveis **qualitativas** ou aderência a uma distribuição).

## Correlação e regressão linear (noção)

- **Correlação (r):** mede a **força e a direção** da relação **linear** entre duas variáveis; varia de **−1 a +1**. r próximo de +1 = forte positiva; próximo de −1 = forte negativa; perto de 0 = sem relação linear.
- **Correlação não implica causalidade.**
- **Regressão linear:** ajusta a reta **y = a + b·x** que melhor descreve a relação (método dos **mínimos quadrados**: minimiza a soma dos quadrados dos resíduos). **Resíduo** = valor observado − valor previsto. **R²** (coeficiente de determinação) = proporção da variação de y explicada pelo modelo (0 a 1).
- **ANOVA** (análise de variância): compara médias de **três ou mais** grupos.

## Teste-se

**1.** O que é o erro tipo I?

<details><summary>Ver resposta</summary>

**Rejeitar a hipótese nula quando ela é verdadeira**.

</details>

**2.** Valor-p = 0,02 e α = 0,05. Rejeita-se H₀?

<details><summary>Ver resposta</summary>

**Sim** (valor-p < α).

</details>

**3.** Correlação r = −0,9 indica o quê?

<details><summary>Ver resposta</summary>

**Forte correlação linear negativa** (quando uma variável aumenta, a outra tende a diminuir).

</details>

**4.** Aumentar o nível de confiança (de 95% para 99%) deixa o intervalo mais largo ou mais estreito?

<details><summary>Ver resposta</summary>

**Mais largo**.

</details>

## Fim do Módulo 16 — checagem

- [ ] Classifico variáveis (nominal, ordinal, discreta, contínua).
- [ ] Calculo média, mediana e moda.
- [ ] Sei as propriedades do desvio-padrão (somar não muda; multiplicar multiplica).
- [ ] Calculo coeficiente de variação.
- [ ] Sei a regra 68–95–99,7 da normal.
- [ ] Diferencio amostragem estratificada e por conglomerados.
- [ ] Sei erro tipo I e II e a regra do valor-p.
