module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    rules: {},
    overrides: [
        {
            files: ['**/*.js?(x)'],
            rules: {
                '@typescript-eslint/no-var-requires': 'off',
                'no-undef': 'off',
            },
        },
        {
            files: ['**/*.ts?(x)'],
            rules: {
                '@typescript-eslint/no-explicit-any': 'off',
                '@typescript-eslint/ban-types': 'off',
            },
        },
    ],
};
