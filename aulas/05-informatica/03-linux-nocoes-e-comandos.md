# Linux: noções e comandos básicos

> **Tempo:** 45 minutos · **Pré-requisito:** "Windows: arquivos e pastas"

## Explicação do zero

**Linux** é um sistema operacional **livre** e de código aberto. Existem várias **distribuições** (versões): Ubuntu, Debian, Fedora, Linux Mint.

## Diferenças em relação ao Windows

| Windows | Linux |
|---|---|
| Unidades com letras (C:, D:) | Uma única árvore a partir da **raiz `/`** |
| Barra invertida `\` | Barra normal `/` |
| Não diferencia maiúsculas (Laudo = laudo) | **Diferencia** maiúsculas (Laudo ≠ laudo) |
| Administrador | **root** (superusuário) |
| Proprietário | Livre |

## Diretórios principais

| Diretório | Conteúdo |
|---|---|
| `/` | Raiz de tudo |
| `/home` | Pastas pessoais dos usuários (`/home/ana`) |
| `/root` | Pasta do superusuário |
| `/etc` | Arquivos de **configuração** |
| `/bin`, `/usr/bin` | Programas e comandos |
| `/tmp` | Arquivos temporários |
| `/dev` | Dispositivos |
| `/media`, `/mnt` | Pendrives e discos montados |

`~` = sua pasta pessoal · `.` = pasta atual · `..` = pasta acima.

## Comandos do terminal (os que caem)

| Comando | Faz | Exemplo |
|---|---|---|
| `pwd` | Mostra a pasta atual | `pwd` |
| `ls` | Lista arquivos (`ls -l` detalhado; `ls -a` inclui ocultos) | `ls -l` |
| `cd` | Muda de pasta | `cd /home/ana` · `cd ..` |
| `mkdir` | Cria pasta | `mkdir provas` |
| `rmdir` | Remove pasta **vazia** | `rmdir provas` |
| `rm` | Remove arquivo (`rm -r` remove pasta com conteúdo) | `rm laudo.txt` |
| `cp` | Copia | `cp a.txt b.txt` |
| `mv` | Move ou **renomeia** | `mv a.txt b.txt` |
| `cat` | Mostra o conteúdo de um arquivo | `cat laudo.txt` |
| `touch` | Cria arquivo vazio | `touch nota.txt` |
| `chmod` | Muda permissões | `chmod 755 script.sh` |
| `sudo` | Executa como administrador | `sudo apt update` |
| `man` | Manual de um comando | `man ls` |

## Permissões (noção)

Cada arquivo tem permissões de **leitura (r)**, **escrita (w)** e **execução (x)** para: dono, grupo e outros.
> `rwxr-xr--` → dono pode tudo; grupo lê e executa; outros só leem.

## Teste-se

**1.** Qual comando mostra em que pasta você está?

<details><summary>Ver resposta</summary>

`pwd`.

</details>

**2.** Qual comando renomeia um arquivo?

<details><summary>Ver resposta</summary>

`mv` (ex.: `mv antigo.txt novo.txt`).

</details>

**3.** No Linux, `Laudo.txt` e `laudo.txt` são o mesmo arquivo?

<details><summary>Ver resposta</summary>

**Não**; o Linux diferencia maiúsculas de minúsculas.

</details>

**4.** Em qual diretório ficam os arquivos de configuração?

<details><summary>Ver resposta</summary>

`/etc`.

</details>
