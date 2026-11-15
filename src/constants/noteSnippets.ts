export type NoteSnippetKey = 'resumo' | 'lei' | 'pegadinha' | 'check';

export const NOTE_SNIPPETS: Record<NoteSnippetKey, string> = {
  resumo: 'SÍNTESE PESSOAL:\n- Ideia central: \n- Conceito-chave: \n- Conclusão: \n',
  lei: 'DISPOSITIVO LEGAL:\n- Artigo / Lei: \n- Preceito (conduta): \n- Sanção / Consequência: \n',
  pegadinha:
    'DISTINÇÃO DE PROVA (CEV/UECE):\n- O que parece certo mas induz a erro: \n- Regra exata: \n',
  check:
    'VERIFICAÇÃO DE ESTUDO:\n[ ] Li a explicação de base\n[ ] Compreendi os termos técnicos\n[ ] Expliquei em voz alta sem consulta\n[ ] Resolvi as questões da aula\n',
};

export const NOTE_SNIPPET_BUTTONS: { key: NoteSnippetKey; label: string }[] = [
  { key: 'resumo', label: '+ Síntese' },
  { key: 'lei', label: '+ Dispositivo legal' },
  { key: 'pegadinha', label: '+ Distinção de banca' },
  { key: 'check', label: '+ Checklist' },
];
