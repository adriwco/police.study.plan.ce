# Segurança da informação: os pilares

> **Tempo:** 35 minutos · **Pré-requisito:** nenhum

## Por que isso importa

O edital cobra "tecnologia da informação e segurança de dados". Para um policial, que lida com dados sigilosos de investigação, é também uma questão de trabalho.

## Os princípios (pilares)

| Princípio | Significado | Ameaça típica | Proteção |
|---|---|---|---|
| **Confidencialidade** | Só quem tem autorização acessa | Vazamento, espionagem | Senhas, criptografia, controle de acesso |
| **Integridade** | A informação não é alterada indevidamente | Adulteração de um laudo | Assinatura digital, hash |
| **Disponibilidade** | A informação está acessível quando necessário | Ataque que derruba o sistema, ransomware | Backup, redundância |
| **Autenticidade** | Garante a identidade de quem enviou | Mensagem falsa em nome de alguém | Certificado e assinatura digital |
| **Não repúdio (irretratabilidade)** | O autor não pode negar que fez | "Não fui eu que assinei" | Assinatura digital |

**Macete: CIDA** (Confidencialidade, Integridade, Disponibilidade, Autenticidade).

## Autenticação: como provar quem você é

| Fator | Exemplo |
|---|---|
| Algo que você **sabe** | Senha, PIN |
| Algo que você **tem** | Celular com código, token, cartão |
| Algo que você **é** | Biometria (digital, rosto) |

**Autenticação de dois fatores (2FA / MFA):** usa dois fatores **diferentes** (senha + código no celular). Duas senhas = um fator só.

## Boas práticas de senha

- Longa (frase-senha), única por serviço, guardada em gerenciador de senhas.
- Nunca compartilhar; ativar 2FA.

## Teste-se

**1.** Um hacker altera o valor de um laudo no sistema. Qual pilar foi violado?

<details><summary>Ver resposta</summary>

**Integridade**.

</details>

**2.** Um ataque deixa o sistema da delegacia fora do ar. Qual pilar foi violado?

<details><summary>Ver resposta</summary>

**Disponibilidade**.

</details>

**3.** Senha + digital é autenticação de dois fatores?

<details><summary>Ver resposta</summary>

**Sim** (algo que sabe + algo que é).

</details>
