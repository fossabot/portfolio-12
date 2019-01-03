module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'contrib',
        'project',
        'snippet'
      ]
    ],
    'type-enum': [
      2,
      'always',
      [
        'archive',
        'build',
        'chore',
        'ci',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test'
      ]
    ]
  }
};
