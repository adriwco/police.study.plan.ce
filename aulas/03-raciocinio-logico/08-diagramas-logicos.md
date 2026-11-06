# Diagramas lógicos (todo, algum, nenhum)

> **Tempo:** 45 minutos · **Pré-requisito:** Matemática — "Conjuntos e diagramas de Venn"

## Por que isso importa

"Todo policial é servidor. Algum servidor é cearense. Logo…" Questões assim se resolvem **desenhando círculos**. O edital cobra "diagramas lógicos" expressamente.

## As quatro frases e seus desenhos

### "Todo A é B"

O círculo A fica **inteiro dentro** de B.

```
   ┌──────── B ────────┐
   │    ┌── A ──┐      │
   │    └───────┘      │
   └───────────────────┘
```

> "Todo investigador é policial." Todo investigador está dentro do grupo dos policiais. Mas **nem todo policial é investigador**.

### "Nenhum A é B"

Círculos **separados**, sem tocar.

```
   ┌── A ──┐      ┌── B ──┐
   └───────┘      └───────┘
```

### "Algum A é B" (= "pelo menos um A é B")

Os círculos **se cruzam**, e há pelo menos um elemento na interseção.

```
   ┌──── A ────┐
   │      ┌────┼──── B ────┐
   │      │ X  │           │
   └──────┼────┘           │
          └────────────────┘
```

**Atenção:** "algum A é B" **não** quer dizer que "algum A não é B". Pode ser que todo A seja B; a frase só garante **pelo menos um**.

### "Algum A não é B"

Existe pelo menos um elemento de A **fora** de B.

## Como resolver questões

1. Desenhe as premissas, **uma de cada vez**.
2. Quando houver mais de um desenho possível, considere **todos**.
3. A conclusão só é válida se for verdadeira **em todos os desenhos possíveis**.

> Premissas: "Todo policial é servidor." e "Nenhum servidor é empresário."
> Desenho: policial dentro de servidor; empresário fora de servidor.
> Conclusão válida: "**Nenhum policial é empresário.**"

## Teste-se

**1.** "Todo perito é servidor." Podemos concluir que "todo servidor é perito"?

<details><summary>Ver resposta</summary>

**Não.** O círculo de peritos está dentro do de servidores, mas pode haver servidores que não são peritos.

</details>

**2.** "Todo A é B" e "Nenhum B é C". O que se conclui sobre A e C?

<details><summary>Ver resposta</summary>

**Nenhum A é C** (A está dentro de B, e B não toca C).

</details>

**3.** "Algum policial é músico." Podemos concluir que "algum músico é policial"?

<details><summary>Ver resposta</summary>

**Sim.** Se há um elemento na interseção, ele é policial e músico ao mesmo tempo.

</details>
