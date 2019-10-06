module.exports = {
    plugins: ['stylelint-scss'],
    extends: [
        'stylelint-scss',
        'stylelint-config-airbnb',
        'stylelint-config-recommended-scss',
        'stylelint-config-rational-order',
    ],
    syntax: 'sass',
    rules: {
        'selector-class-pattern': null /* BEM pattern */,
        indentation: null,
        'selector-max-id': null /* AirBnB prohibits Id selectors, but uses them. Ironic... */,
        'property-no-vendor-prefix': null,
        'block-opening-brace-space-before': null /* can't handle the Sass style */,
        'block-opening-brace-space-after': null,
        'declaration-block-trailing-semicolon': 'never' /* Sass */,
        'order/properties-alphabetical-order': null,
        'number-leading-zero': 'always' /* 0 before number */,
    },
};

/* AutoFix in PHPStorm
 *  0)Install stylelint -g
 *
 *  1)Tools => External Tools
 *  Program: /node_modules/bin/stylelint.cmd
 *  Arguments: $FileName$ --fix
 *  Working Directory: $FileDir$
 *
 *  2)KeyMap => External Tools => Set keymap for stylelint
 *
 *  */
