export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'chore', 'refactor', 'ref', 'style', 'docs', 'test', 'perf', 'ci'],
    ],
  },
};
