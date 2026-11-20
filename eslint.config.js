import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['**/dist', '**/build/output', '**/coverage', '**/node_modules']),

  // Shared rules for all TypeScript (type-aware).
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
    },
  },

  // Client: browser + React.
  {
    files: ['client/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: { globals: globals.browser },
  },

  // Client build tooling runs in Node.
  {
    files: ['client/vite.config.ts', 'client/build/**/*.ts'],
    languageOptions: { globals: globals.node },
  },

  // Server: Node.
  {
    files: ['server/**/*.ts'],
    languageOptions: { globals: globals.node },
  },

  // Mongoose schema definitions are object literals by design, although Mongoose types
  // each field's options as the SchemaTypeOptions class.
  {
    files: ['server/**/*.model.ts'],
    rules: { '@typescript-eslint/no-unsafe-class-instance-assignment': 'off' },
  },

  // Plain JS config files (this file).
  {
    files: ['**/*.js'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },

  // Must be last: turns off rules that conflict with Prettier.
  prettier,
);
