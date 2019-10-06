module.exports = {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    parserOptions: {
        ecmaVersion: 2018,
        // project: path.resolve(__dirname, './tsconfig.json'),
        tsconfigRootDir: __dirname,
        sourceType: 'module', // Allows for the use of imports
    },
    plugins: [
        '@typescript-eslint',
        'prettier'
    ],
    env: {
        browser: true,
        es6: true,
        node: true,
        jest: true,
    },
    globals: {
        // Jest Puppeteer, see https://github.com/smooth-code/jest-puppeteer/blob/v4.0.0/README.md#configure-eslint
        page: true
    },
    extends: [
        'airbnb-base',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'prettier/@typescript-eslint',
    ],
    rules: {
        'indent': [2, 4],
        // "typescript/no-var-requires": "off", //Disable require imports
        'import/no-unresolved': 'off',
        // 'no-cycle': [2, { maxDepth: 1 }], // Works wrong with express
        'prettier/prettier': [
            'error',
            {
                'singleQuote': true,
                'trailingComma': 'all',
                'tabWidth': 4,
            }
        ],
    }
};
