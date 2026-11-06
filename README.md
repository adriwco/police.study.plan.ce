# Curso PCCE do Zero 🚓

> Curso gratuito, do **zero absoluto**, para o cargo de **Oficial Investigador de Polícia Civil do Ceará (PCCE)**.

**Acesse:** <https://adriwco.github.io/police.study.plan.ce/>

## O que é

Um curso em aulas para quem **não tem base nenhuma**: nunca estudou Direito, não lembra a matemática da escola e nunca fez uma questão de concurso. Cada assunto é explicado passo a passo, sempre no mesmo roteiro:

1. **Por que isso importa** — uma situação real.
2. **Explicação do zero** — linguagem simples, com comparações do dia a dia.
3. **Palavras novas** — cada termo técnico explicado.
4. **O que diz a lei** — o texto oficial traduzido linha por linha.
5. **Exemplos** — casos concretos.
6. **Não confunda** — os conceitos parecidos que enganam.
7. **Como cai na prova** — o jeito como a banca pergunta.
8. **Resumo** — o essencial.
9. **Teste-se** — exercícios com gabarito comentado.

## A trilha

| Módulo | Conteúdo |
|---|---|
| 00 | Comece aqui: como o curso funciona e como estudar |
| 01 | Alfabetização jurídica: a língua do Direito |
| 02 | Matemática do zero |
| 03 | Raciocínio Lógico |
| 04 | Língua Portuguesa |
| 05 | Informática (LibreOffice, Windows/Linux, segurança) |
| 06 | Direito Constitucional |
| 07 | Direito Administrativo |
| 08 | Direito Penal — Parte Geral |
| 09 | Direito Penal — Parte Especial |
| 10 | Processo Penal |
| 11 | Legislação Especial |
| 12 | Legislação Estadual (CE) |
| 13 | Criminologia |
| 14 | Medicina Legal |
| 15 | Contabilidade |
| 16 | Estatística |
| 17 | Redação |
| 18 | Reta final (simulados, TAF, demais fases) |

O site mostra quais aulas já estão prontas. O plano de estudos completo (rotina, ciclos, revisões, edital, TAF e referências) está em [GUIA-COMPLETO-PCCE.md](GUIA-COMPLETO-PCCE.md).

## Funcionalidades do site

- Trilha de módulos e aulas, na ordem de pré-requisitos.
- Marcar aula como concluída e barra de progresso (salvos no navegador).
- Anotações por aula (salvas no navegador).
- Tema claro e escuro; funciona no celular.

## Estrutura do projeto

```
index.html               site (lê a trilha e mostra as aulas)
aulas/trilha.json        ordem dos módulos e aulas
aulas/<módulo>/*.md      uma aula por arquivo, em Markdown
GUIA-COMPLETO-PCCE.md    plano de estudos completo
```

Para adicionar uma aula: crie o arquivo `.md` na pasta do módulo com o número da aula no início do nome (ex.: `aulas/02-matematica/01-fracoes-e-numeros-decimais.md`) e preencha o campo `arquivo` correspondente em `aulas/trilha.json`.

## Rodar localmente

O site carrega os arquivos `.md` pela rede, então não funciona abrindo o `index.html` direto. Na pasta do projeto:

```bash
python3 -m http.server 8000
```

E acesse <http://localhost:8000>.

## Aviso

Material de estudo. Confira sempre a lei na fonte oficial e o edital vigente: onde houver divergência, o edital manda.
