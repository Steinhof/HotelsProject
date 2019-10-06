const gulp = require('gulp');
const path = require('path');
const del = require('del');
const webpack = require('webpack');
const nodemon = require('gulp-nodemon');
const WebpackDevServer = require('webpack-dev-server');

/* File paths */
const cfg = require('./config/config.js');

/* Notification handler */
const webpackLogger = require('./config/webpackLogger');

/* Delete old files */
gulp.task('CLEAN', () => {
    return del([cfg.globs.distCSS[0], cfg.globs.distJS[0]]);
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
        watch: ['./src'],
        ignore: ['node_modules/'],
        env: {
            NODE_ENV: 'development',
            NODE_OPTIONS: '--inspect',
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
    const compiler = webpack(require(cfg.configs.webpack.dev));
    new WebpackDevServer(compiler, {
        stats: webpackLogger,
        hot: true,
        contentBase: path.join(__dirname, cfg.paths.public.base),
        watchContentBase: true,
        proxy: {
            context: ['/'],
            target: 'http://localhost:3000',
        },
        port: 3001,
    }).listen(3001);
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

gulp.task('default', gulp.series('CLEAN', 'START-SERVER', 'WEBPACK'));
