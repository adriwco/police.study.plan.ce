# Correio eletrônico e os protocolos SMTP, IMAP e POP3

> **Tempo:** 40 minutos · **Pré-requisito:** nenhum

## Explicação do zero

O e-mail funciona como os Correios digitais. Endereço: **usuario@dominio** (ex.: `ana@pc.ce.gov.br`). O **@** separa o nome do usuário do domínio (o "endereço do prédio").

## Campos da mensagem

| Campo | Função |
|---|---|
| **Para** | Destinatários principais |
| **Cc** (cópia carbono) | Recebem cópia; **todos veem** quem está em Cc |
| **Cco** (cópia carbono **oculta**) | Recebem cópia **sem que os outros saibam** |
| **Assunto** | Resumo |
| **Anexo** | Arquivo enviado junto |

**Responder** = só ao remetente · **Responder a todos** = remetente + Para + Cc (nunca os de Cco) · **Encaminhar** = enviar a mensagem recebida a outra pessoa (os anexos vão junto).

## Os protocolos (o que mais cai)

| Protocolo | Função | Macete |
|---|---|---|
| **SMTP** | **Envio** de e-mails | **S**MTP = **S**ai (send) |
| **POP3** | **Recebimento**: **baixa** as mensagens para o computador (em regra, apaga do servidor) | **P**OP = **P**uxa e leva embora |
| **IMAP** | **Recebimento**: **sincroniza**, mantendo no servidor; você vê as mesmas pastas no celular e no PC | **I**MAP = **I**gual em todo lugar |

## Webmail x cliente de e-mail

| Webmail | Cliente de e-mail |
|---|---|
| Acessado pelo **navegador** (Gmail, Outlook.com) | Programa instalado (Thunderbird, Outlook) |
| Usa HTTP/HTTPS para o acesso | Configurado com SMTP + IMAP ou POP3 |

## Segurança no e-mail

- Não abra anexos inesperados (`.exe`, `.zip`, documentos com macros).
- Confira o remetente real (golpes imitam bancos e órgãos públicos).
- Isso é **phishing** — aula própria mais à frente.

## Teste-se

**1.** Qual protocolo é usado para **enviar** e-mails?

<details><summary>Ver resposta</summary>

**SMTP**.

</details>

**2.** Você quer ler os mesmos e-mails no celular e no computador, mantendo tudo no servidor. Qual protocolo?

<details><summary>Ver resposta</summary>

**IMAP**.

</details>

**3.** Quem está em Cco recebe a mensagem quando alguém clica "Responder a todos"?

<details><summary>Ver resposta</summary>

**Não**.

</details>
