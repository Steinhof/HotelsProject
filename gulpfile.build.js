const gulp = require('gulp');
const del = require('del');
const fs = require('fs');
const typedoc = require('gulp-typedoc');
const critical = require('critical').stream;
const imagemin = require('gulp-imagemin');
const webpack = require('webpack');
const nodemon = require('gulp-nodemon');
const SWInjectFiles = require('./config/SWInjectFiles');

/* File paths */
const cfg = require('./config/config');

/* Delete old files */
gulp.task('CLEAN', done => {
    del([cfg.globs.distCSS[0], cfg.globs.distJS[0]]);
    done();
});

/* Start server */
gulp.task('START-SERVER', done => {
    let started = false;
    nodemon({
        script: cfg.files.server,
        ext: 'ts',
        args: [
            '--transpile-only',
            '--pretty',
            '--project',
            'tsconfig.node.json',
        ],
        ignore: ['node_modules/'],
        env: {
            NODE_ENV: 'production',
        },
        scriptPosition: 4, // File name should be at the end
    }).on('start', () => {
        if (!started) {
            done();
            started = true;
        }
    });
    done();
});

/* Webpack */
gulp.task('WEBPACK', done => {
    webpack(require(cfg.configs.webpack.build), function webpackErrorHandler(
        err,
        stats,
    ) {
        if (err) {
            console.error(err.stack || err);
            if (err.details) {
                console.error(err.details);
            }
            return;
        }
        const statsConfig = {
            all: false,
            /* Show entries */
            assets: true,
            colors: true,
            modules: false,
            errors: true,
            cachedAssets: true,
            /* Stat logs */
            warnings: true,
            performance: true,
            moduleTrace: true,
            errorDetails: true,
        };

        // Result (you can choose stats preset)
        console.log(
            `${stats.toString(
                statsConfig,
            )} -- ${new Date().toLocaleTimeString()}`,
        );
        done();
    });
});

gulp.task('SW', done => {
    webpack(require(cfg.configs.webpack.sw), function webpackErrorHandler(
        err,
        stats,
    ) {
        if (err) {
            console.error(err.stack || err);
            if (err.details) {
                console.error(err.details);
            }
            return;
        }
        const statsConfig = {
            all: false,
            /* Show entries */
            assets: true,
            colors: true,
            modules: false,
            errors: true,
            cachedAssets: true,
            /* Stat logs */
            warnings: true,
            performance: true,
            moduleTrace: true,
            errorDetails: true,
        };

        // Result (you can choose stats preset)
        console.log(
            `${stats.toString(
                statsConfig,
            )} -- ${new Date().toLocaleTimeString()}`,
        );
        done();
    });
});

gulp.task('SWFILES', done => {
    const fillSW = new SWInjectFiles('./src/public/sw.js', {
        ignorePath: './src/public',
    });

    fillSW.writeStaticFiles([
        './src/public/img/**/*',
        './src/public/js/*',
        './src/public/css/*',
        './src/public/index.html',
    ]);
    done();
});

// WASM
// gulp.task('WASM', done => {
//     const asc = require('assemblyscript/cli/asc');
//     asc.main(
//         [
//             settings.wasm.input,
//             '--binaryFile',
//             settings.wasm.output,
//             '--optimize',
//         ],
//         {
//             stdout: process.stdout,
//             stderr: process.stderr,
//         },
//         err => {
//             if (err) throw err;
//         },
//     );
//     done();
// });

/* Generate & Inline Critical-path CSS */
gulp.task('CRITICAL', done => {
    const criticalWidthMobile = 375;
    const criticalHeightMobile = 667;
    const criticalWidthDesktop = 1376;
    const criticalHeightDesktop = 768;
    gulp.src(cfg.files.html)
        .pipe(
            critical({
                base: cfg.paths.public.base,
                inline: true,
                minify: true,
                dimensions: [
                    {
                        width: criticalWidthMobile,
                        height: criticalHeightMobile,
                    },
                    {
                        width: criticalWidthDesktop,
                        height: criticalHeightDesktop,
                    },
                ],
                css: `${cfg.paths.public.css}${fs.readdirSync(
                    './src/public/css/',
                )}`,
            }),
        )
        .pipe(gulp.dest(cfg.paths.public.base));
    done();
});

/* Compress images */
gulp.task('IMAGEMIN', () =>
    gulp
        .src(cfg.paths.public.img)
        .pipe(
            imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imagemin.jpegtran({ progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo({
                    plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
                }),
            ]),
        )
        .pipe(gulp.dest(cfg.paths.public.img)),
);

// TypeDoc
gulp.task('TYPEDOC', () =>
    gulp.src(cfg.globs.distModules).pipe(
        typedoc({
            module: 'commonjs',
            exclude: '**/node_modules/**/*.*',
            target: 'es5',
            includeDeclarations: true,
            ignoreCompilerErrors: true,
            experimentalDecorators: true,
            excludeExternals: true,
            version: true,
            out: './',
            name: 'My project',
        }),
    ),
);

gulp.task(
    'default',
    gulp.series(
        'CLEAN',
        'IMAGEMIN',
        'WEBPACK',
        'SW',
        'START-SERVER',
        'CRITICAL',
        'SWFILES',
    ),
);
