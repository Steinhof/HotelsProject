const gulp = require('gulp');
const del = require('del');
const fs = require('fs');
const critical = require('critical').stream;
const imagemin = require('gulp-imagemin');
const webpack = require('webpack');
const ts = require('gulp-typescript');
const SWInjectFiles = require('./config/SWInjectFiles');

/* File paths */
const cfg = require('./config/config');

/* Tsconfig for node.js */
const tsProject = ts.createProject(cfg.configs.ts.node);

/* Delete old files */
gulp.task('CLEAN', done => {
    del([cfg.globs.distCSS[0], cfg.globs.distJS[0], cfg.paths.dist.public]);
    done();
});

/* Compile ts server to dist */
gulp.task('TSDIST', done => {
    const tsResult = gulp
        .src([
            ...cfg.globs.distTSServer,
            '!./src/public/**/*',
            '!./src/client/**/*',
        ])
        .pipe(tsProject());
    tsResult.js.pipe(gulp.dest(cfg.paths.dist.base));
    done();
});

/* Copy files to dist/public folder */
gulp.task('COPY', done => {
    gulp.src(cfg.globs.public).pipe(gulp.dest(cfg.paths.dist.public));
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

gulp.task(
    'default',
    gulp.series(
        'CLEAN',
        'IMAGEMIN',
        'WEBPACK',
        'SW',
        'CRITICAL',
        'SWFILES',
        'COPY',
        'TSDIST',
    ),
);
