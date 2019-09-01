// @ts-nocheck
module.exports = {
    ignoreFiles: [
        'node_modules/**/*.scss',
        '**/*.md',
        '**/*.ts',
        '**/*.tsx',
        '**/*.js',
        '.prettierrc.js',
        '.eslintrc.js',
        '.stylelintrc.js',
    ],
    extends: ['stylelint-config-ydj/scss', 'stylelint-config-ydj/prettier'],
    rules: {
        'selector-pseudo-class-no-unknown': [
            true,
            {
                ignorePseudoClasses: ['global', 'local'],
            },
        ],
        'selector-type-no-unknown': [
            true,
            {
                ignoreTypes: ['page'],
            },
        ],
        'unit-no-unknown': [true, { ignoreUnits: ['rpx', 'PX'] }],
    },
}
