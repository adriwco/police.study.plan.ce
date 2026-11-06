# Variáveis aleatórias e distribuições (binomial e normal — noções)

> **Tempo:** 45 minutos · **Pré-requisito:** "Probabilidade em Estatística"

## Variável aleatória

É uma variável cujo valor depende do **acaso**.

| Tipo | Valores | Exemplo | Descrita por |
|---|---|---|---|
| **Discreta** | Contáveis | Nº de ocorrências num plantão | **Função de probabilidade** |
| **Contínua** | Qualquer valor num intervalo | Tempo de resposta da viatura | **Função densidade de probabilidade** |

**Esperança (valor esperado), E(X):** a "média teórica" da variável — soma de cada valor × sua probabilidade.
> Um jogo paga R$ 10 com probabilidade 0,2 e R$ 0 com 0,8. E(X) = 10 × 0,2 + 0 × 0,8 = **R$ 2**.

## Distribuição binomial (discreta)

Usada quando há **n tentativas independentes**, cada uma com só **dois resultados** (sucesso/fracasso) e probabilidade **p** constante.
- **Média:** n · p
- **Variância:** n · p · (1 − p)

> 100 abordagens, cada uma com 5% de chance de encontrar arma. Esperado: 100 × 0,05 = **5** armas.

## Distribuição normal (contínua) — a mais importante

| Característica | Detalhe |
|---|---|
| Forma | **Sino**, **simétrica** em torno da média |
| Média, mediana e moda | **Iguais**, no centro |
| Área total sob a curva | **1** (100%) |
| Parâmetros | Média (μ) e desvio-padrão (σ) |

**Regra empírica (68–95–99,7):**
- Cerca de **68%** dos dados estão a **1 desvio-padrão** da média;
- Cerca de **95%** a **2 desvios-padrão**;
- Cerca de **99,7%** a **3 desvios-padrão**.

> Altura média 1,70 m, desvio 0,10 m → ~68% das pessoas entre 1,60 e 1,80 m.

**Padronização (escore Z):** Z = (x − μ) ÷ σ — quantos desvios-padrão o valor está da média. A normal padrão tem média **0** e desvio **1**.

## Teorema central do limite e lei dos grandes números (noção)

- **Lei dos grandes números:** quanto **maior a amostra**, mais a média amostral se **aproxima** da média real.
- **Teorema central do limite:** para amostras **grandes**, a distribuição das **médias amostrais** é aproximadamente **normal**, qualquer que seja a distribuição original.

## Teste-se

**1.** Numa distribuição normal, onde ficam média, mediana e moda?

<details><summary>Ver resposta</summary>

No **mesmo ponto** (centro), são iguais.

</details>

**2.** Aproximadamente que porcentagem dos dados fica a até 2 desvios-padrão da média numa normal?

<details><summary>Ver resposta</summary>

Cerca de **95%**.

</details>

**3.** Média 50, desvio-padrão 10. Qual o escore Z do valor 70?

<details><summary>Ver resposta</summary>

(70 − 50) ÷ 10 = **2**.

</details>
