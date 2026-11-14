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
9. **Teste-se** — exercícios com gabarito comentado e autoavaliação.

## A trilha

| Módulo | Conteúdo | Bloco / Peso |
|---|---|---|
| 00 | Comece aqui: como o curso funciona e como estudar | Base & Método |
| 01 | Alfabetização jurídica: a língua do Direito | Base & Método |
| 02 | Matemática do zero | Base & Método |
| 03 | Raciocínio Lógico | Básicas · 10 questões |
| 04 | Língua Portuguesa | Básicas · 10 questões |
| 05 | Informática (LibreOffice, Windows/Linux, segurança) | Básicas · 10 questões |
| 06 | Direito Constitucional | Jurídico · 8 questões |
| 07 | Direito Administrativo | Jurídico · 8 questões |
| 08 | Direito Penal — Parte Geral | Jurídico · 8 questões |
| 09 | Direito Penal — Parte Especial | Jurídico · 8 questões |
| 10 | Processo Penal | Jurídico · 8 questões |
| 11 | Legislação Especial | Jurídico · 8 questões |
| 12 | Legislação Estadual (CE) | Jurídico · 10 questões (maior peso) |
| 13 | Criminologia | Específicas · 5 questões |
| 14 | Medicina Legal | Específicas · 5 questões |
| 15 | Contabilidade | Específicas · 5 questões |
| 16 | Estatística | Específicas · 5 questões |
| 17 | Redação | Discursiva · 30 pontos |
| 18 | Reta final (simulados, TAF, demais fases) | Simulados & TAF |

São **272 aulas** em 19 módulos. O plano de estudos completo (rotina, ciclos, revisões, edital, TAF e referências) está em [GUIA-COMPLETO-PCCE.md](GUIA-COMPLETO-PCCE.md).

## Funcionalidades da plataforma

- **Painel "O Arsenal"**: visão executiva com próxima aula recomendada, domínio por bloco do edital (100 questões), calendário de constância (28 dias) e ofensiva diária.
- **Edital Verticalizado Interativo (`#/edital`)**: filtro por blocos da prova e acompanhamento de aulas concluídas e ciclos de revisão por matéria.
- **Revisões Espaçadas (`#/revisoes`)**: agendamento automático nos ciclos de **24 horas (R1)**, **7 dias (R2)** e **30 dias (R3)** após concluir cada aula, além de caderno de questões marcadas para revisão e aulas favoritas.
- **Pomodoro Tático Integrado**: modos de foco de **25 min**, **50 min (bloco prova)** e **5 min (pausa)** que continuam ativos no cabeçalho durante a navegação.
- **Caderno Inteligente (`#/caderno`)**: anotações por aula com salvamento automático, modelos em 1 clique e expansão automática de atalhos (`/resumo `, `/lei `, `/pegadinha `, `/check `, `/hoje `), conversão para maiúsculas e exportação em Markdown (`.md`).
- **Busca Global Instantânea (`Ctrl+K` ou `/`)**: pesquisa em tempo real nas 272 aulas, 19 módulos, anotações pessoais e comandos rápidos.
- **Leitura Focada e Acessível**: sumário dinâmico lateral ("Nesta aula"), modo foco (`F`), 4 níveis de tamanho de fonte (`Aa`), temas Escuro (*Mentoris Dark*) e Claro (*LeapNotes Warm Paper*), navegação por teclado e suporte a leitores de tela.
- **Backup e Portabilidade**: exportação e restauração completa dos dados em `.json`.

## Estrutura do projeto

```
index.html               aplicação principal (SPA acessível e responsiva)
manifest.webmanifest     manifesto PWA instalável
assets/styles.css        sistema de design, temas, bento grid e responsividade
assets/app.js            roteamento, estado local, busca global, revisões e caderno
assets/favicon.svg       ícone vetorial da plataforma
aulas/trilha.json        ordem dos módulos e aulas
aulas/<módulo>/*.md      uma aula por arquivo, em Markdown
GUIA-COMPLETO-PCCE.md    plano de estudos completo
```

Para adicionar uma aula: crie o arquivo `.md` na pasta do módulo com o número da aula no início do nome (ex.: `aulas/02-matematica/01-fracoes-e-numeros-decimais.md`) e rode `python3 scripts/atualizar_trilha.py`.

## Rodar localmente

O site carrega os arquivos `.md` pela rede, então não funciona abrindo o `index.html` direto. Na pasta do projeto:

```bash
python3 -m http.server 8000
```

E acesse <http://localhost:8000>.

## Aviso

Material de estudo. Confira sempre a lei na fonte oficial e o edital vigente: onde houver divergência, o edital manda.
