# Negação de proposições compostas e Leis de De Morgan

> **Tempo:** 50 minutos · **Pré-requisito:** "Tabela-verdade"

## Por que isso importa

"Assinale a negação de: 'Pedro é policial e Ana é perita'." Esse tipo de questão aparece em praticamente toda prova. E a resposta **não** é só colocar "não" na frente.

## Leis de De Morgan

### Negar um "e": nega as duas partes e troca "e" por "ou"

> ~(p ∧ q) ≡ ~p ∨ ~q

> "Pedro é policial **e** Ana é perita."
> Negação: "Pedro **não** é policial **ou** Ana **não** é perita."

Por quê? Para a frase com "e" ser falsa, basta **uma** parte falhar.

### Negar um "ou": nega as duas partes e troca "ou" por "e"

> ~(p ∨ q) ≡ ~p ∧ ~q

> "Vou estudar Penal **ou** Constitucional."
> Negação: "**Não** vou estudar Penal **e não** vou estudar Constitucional."

## Negação do condicional (a mais cobrada)

> ~(p → q) ≡ p ∧ ~q

**Macete "MANÉ": MAntém a primeira E Nega a segunda.**

> "Se chover, então a rua fica molhada."
> Negação: "Choveu **e** a rua **não** ficou molhada."

Por quê? O condicional só é falso em V → F: a condição aconteceu (p) e o resultado não (~q).

**Erro clássico:** achar que a negação é "se não chover, então a rua não fica molhada". Isso **não** é negação.

## Negação do bicondicional

> ~(p ↔ q) ≡ p ⊻ q ("ou p, ou q", exclusivo)

> "Será nomeado se e somente se for aprovado."
> Negação: "**Ou** será nomeado, **ou** será aprovado" (um sem o outro).

## Dupla negação

> ~(~p) ≡ p · "Não é verdade que Ana não é perita" = "Ana é perita".

## Tabela-resumo

| Proposição | Negação |
|---|---|
| p ∧ q | ~p ∨ ~q |
| p ∨ q | ~p ∧ ~q |
| p → q | p ∧ ~q |
| p ↔ q | p ⊻ q |
| ~p | p |

## Teste-se

**1.** Negue: "O delegado chegou e o escrivão saiu."

<details><summary>Ver resposta</summary>

"O delegado **não** chegou **ou** o escrivão **não** saiu."

</details>

**2.** Negue: "Se o suspeito fugiu, então a viatura chegou tarde."

<details><summary>Ver resposta</summary>

"O suspeito fugiu **e** a viatura **não** chegou tarde."

</details>

**3.** Negue: "Ana é cearense ou Bia é paulista."

<details><summary>Ver resposta</summary>

"Ana **não** é cearense **e** Bia **não** é paulista."

</details>

**4.** Certo ou errado: "A negação de 'se estudo, passo' é 'se não estudo, não passo'."

<details><summary>Ver resposta</summary>

**Errado.** A negação é "estudo **e não** passo".

</details>
