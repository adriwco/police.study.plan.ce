# Criptografia, assinatura e certificado digital

> **Tempo:** 45 minutos · **Pré-requisito:** "Segurança da informação"

## Explicação do zero

**Criptografia** é transformar uma mensagem legível em algo ilegível (cifrado), que só quem tem a **chave** consegue voltar ao normal.

## Simétrica x assimétrica

| | Simétrica | Assimétrica |
|---|---|---|
| Chaves | **Uma só** chave, a mesma para cifrar e decifrar | **Duas** chaves: **pública** (divulgada) e **privada** (secreta) |
| Comparação | Um cadeado com uma chave copiada para os dois lados | Uma caixa de correio: qualquer um põe a carta (pública), só o dono abre (privada) |
| Vantagem | Rápida | Não é preciso compartilhar a chave secreta |
| Problema | Como entregar a chave com segurança? | Mais lenta |
| Exemplo | AES | RSA |

## As duas regras da assimétrica (o que mais cai)

| Objetivo | Quem cifra | Com qual chave | Quem decifra |
|---|---|---|---|
| **Sigilo (confidencialidade)** | O remetente | Chave **pública do destinatário** | O destinatário, com sua chave **privada** |
| **Assinatura (autenticidade)** | O remetente | Sua **própria chave privada** | Qualquer um, com a chave **pública do remetente** |

**Macete:** para mandar segredo, uso a chave **pública de quem recebe**. Para assinar, uso a **minha privada**.

## Assinatura digital

Garante:
- **Autenticidade** (quem assinou),
- **Integridade** (não foi alterado depois),
- **Não repúdio** (o autor não pode negar).

**Não** garante confidencialidade (a mensagem assinada pode continuar legível).

Funciona com **hash**: um "resumo" único do documento. Qualquer alteração muda o hash.

## Certificado digital

É uma "**identidade digital**": um arquivo que liga uma **chave pública** a uma pessoa ou empresa, emitido por uma **Autoridade Certificadora (AC)** confiável.

No Brasil, a estrutura oficial é a **ICP-Brasil**, que dá validade jurídica aos documentos assinados digitalmente.

O **cadeado do HTTPS** usa certificado digital (do site) para garantir que você está no site verdadeiro e que a conexão é criptografada.

## Teste-se

**1.** Ana quer enviar um arquivo sigiloso a Bruno usando criptografia assimétrica. Com qual chave ela cifra?

<details><summary>Ver resposta</summary>

Com a chave **pública de Bruno**.

</details>

**2.** Para assinar digitalmente, o delegado usa qual chave?

<details><summary>Ver resposta</summary>

A sua própria chave **privada**.

</details>

**3.** A assinatura digital garante a confidencialidade?

<details><summary>Ver resposta</summary>

**Não.** Garante autenticidade, integridade e não repúdio.

</details>
