# Computação em nuvem e backup

> **Tempo:** 35 minutos · **Pré-requisito:** "Internet, intranet e extranet"

## Computação em nuvem

Usar **programas, armazenamento e processamento** pela internet, em servidores de outra empresa, em vez de no seu computador.

> Google Drive, OneDrive, Dropbox, Gmail, Google Docs.

| Modelo de serviço | O que oferece | Exemplo |
|---|---|---|
| **SaaS** (software como serviço) | O programa pronto, pelo navegador | Gmail, Google Docs |
| **PaaS** (plataforma) | Ambiente para desenvolver aplicações | Plataformas de desenvolvimento |
| **IaaS** (infraestrutura) | Servidores, armazenamento e redes virtuais | Máquinas virtuais alugadas |

| Tipo de nuvem | Quem usa |
|---|---|
| Pública | Qualquer um (contratando) |
| Privada | Uma única organização |
| Híbrida | Mistura das duas |

**Vantagens:** acesso de qualquer lugar, sincronização, menos custo com equipamento. **Desvantagens:** depende de internet; dados ficam com terceiros.

## Backup (cópia de segurança)

Cópia dos dados para recuperar em caso de perda, defeito ou ataque (como ransomware).

| Tipo | O que copia | Restauração |
|---|---|---|
| **Completo (normal)** | **Tudo**, sempre | Mais simples (só o último completo) |
| **Incremental** | Só o que mudou desde o **último backup de qualquer tipo** | Último completo + **todos** os incrementais seguintes |
| **Diferencial** | Só o que mudou desde o **último completo** | Último completo + **apenas o último** diferencial |

**Macete:** incremental é rápido de fazer e lento de restaurar; diferencial cresce a cada dia, mas restaura com só dois arquivos.

**Regra 3-2-1:** 3 cópias, em 2 mídias diferentes, 1 fora do local.

## Teste-se

**1.** O Google Docs é exemplo de qual modelo de nuvem?

<details><summary>Ver resposta</summary>

**SaaS**.

</details>

**2.** Para restaurar um backup diferencial, o que é necessário?

<details><summary>Ver resposta</summary>

O último backup **completo** + o **último diferencial**.

</details>

**3.** Qual backup copia só o que mudou desde o último backup de qualquer tipo?

<details><summary>Ver resposta</summary>

O **incremental**.

</details>
