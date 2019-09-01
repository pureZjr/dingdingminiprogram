module.exports = {
    extends: ['taro', 'eslint:recommended'],
    plugins: ['prettier'],
    rules: {
        'no-unused-vars': [
            'error',
            {
                varsIgnorePattern: 'Taro',
                ignoreRestSiblings: true,
                args: 'all',
                vars: 'all',
            },
        ],
        'react/jsx-filename-extension': [
            1,
            {
                extensions: ['.js', '.jsx', '.tsx'],
            },
        ],
        'prettier/prettier': 'error',
        quotes: ['error', 'single'], // 单引号
        'jsx-quotes': ['error', 'prefer-double'], // jsx双引号
        indent: ['error', 4], // 四个空格缩进
        'react/jsx-indent-props': ['error', 4],
        'no-extra-boolean-cast': 'off',
        'import/prefer-default-export': 'off',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
            scss: true,
        },
        useJSXTextNode: true,
        project: './tsconfig.json',
    },
}
