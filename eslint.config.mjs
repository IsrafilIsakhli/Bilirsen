import tseslint from 'typescript-eslint';
export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.expo/**',
      '**/generated/**',
      '**/expo-env.d.ts',
    ],
  },
  ...tseslint.configs.recommended,
  { files: ['**/*.cjs'], rules: { '@typescript-eslint/no-require-imports': 'off' } },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
);
