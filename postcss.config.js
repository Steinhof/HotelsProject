const postcssPresetEnv = require('postcss-preset-env');
const cssnano = require('cssnano');
const purgecss = require('@fullhuman/postcss-purgecss');
const cfg = require('./config/config');

module.exports = {
    plugins: [
        postcssPresetEnv({
            stage: 3,
            autoprefixer: { grid: 'autoplace' }, // Don't forget grid-rows
            features: {
                'nesting-rules': true, // Nesting selectors
            },
        }),
        cssnano({
            preset: [
                'advanced',
                {
                    discardComments: {
                        removeAll: true,
                    },
                },
            ],
        }),
        purgecss({
            trim: true,
            shorten: true,
            keyframes: true,
            fontFace: true,
            content: [cfg.files.html, cfg.globs.distJS[0]],
        }),
    ],
};
