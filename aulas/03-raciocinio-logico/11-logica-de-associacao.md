# Lógica de associação (problemas de correspondência)

> **Tempo:** 45 minutos · **Pré-requisito:** nenhum

## Por que isso importa

"Três policiais — Ana, Bruno e Carla — trabalham em delegacias diferentes, têm idades diferentes e… quem trabalha onde?" São as questões de "quem é quem". Parecem difíceis, mas têm método: **tabela**.

## O método da tabela

1. Liste as categorias (pessoas, lugares, profissões…).
2. Monte uma tabela cruzando as categorias.
3. Leia cada pista e marque **✗** (impossível) e **✓** (certo).
4. Quando marcar um ✓, risque o resto da linha **e** da coluna (cada item só combina com um).
5. Quando sobrar uma única opção numa linha ou coluna, ela é ✓.

## Exemplo resolvido

> Ana, Bruno e Carla trabalham em Fortaleza, Sobral e Crato (um em cada).
> Pistas:
> 1. Ana não trabalha em Sobral nem no Crato.
> 2. Bruno não trabalha no Crato.

| | Fortaleza | Sobral | Crato |
|---|---|---|---|
| Ana | ✓ (sobrou) | ✗ (pista 1) | ✗ (pista 1) |
| Bruno | ✗ (Ana já é Fortaleza) | ✓ (sobrou) | ✗ (pista 2) |
| Carla | ✗ | ✗ | ✓ (sobrou) |

**Resposta:** Ana → Fortaleza; Bruno → Sobral; Carla → Crato.

## Dicas

- Comece pelas pistas **diretas** ("Ana é…", "Ana não é…").
- Pistas relativas ("o de Sobral é mais velho que Ana") entram depois.
- Se travar, teste uma hipótese ("e se Bruno for de Sobral?") e veja se gera contradição.

## Problemas de verdade e mentira

Variação comum: "um deles sempre mente". Método: **suponha** que um específico diz a verdade e veja se as falas ficam coerentes. Se gerar contradição, a suposição está errada.

> Ana diz: "Bruno mente." Bruno diz: "Carla mente." Carla diz: "Ana e Bruno mentem." Só um diz a verdade.
> Suponha que **Bruno** diz a verdade → Carla mente e Ana mente. Ana mentir significa que Bruno **não** mente (coerente). Carla mentir significa que **não é verdade** que Ana e Bruno mentem (coerente, pois Bruno diz a verdade). ✅ **Bruno é o verdadeiro.**

## Teste-se

**1.** Três investigadores (Davi, Elisa, Fábio) usam viaturas branca, preta e prata, uma cada. Davi não usa a branca. Elisa usa a preta. Qual a cor de cada um?

<details><summary>Ver resposta</summary>

Elisa → preta. Davi não é branca e a preta já é da Elisa → Davi → **prata**. Fábio → **branca**.

</details>

**2.** Num problema de associação, você marcou ✓ em "Ana–Sobral". O que fazer em seguida?

<details><summary>Ver resposta</summary>

Marcar ✗ em todo o resto da linha de Ana e em toda a coluna de Sobral.

</details>
