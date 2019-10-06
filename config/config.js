const fs = require('fs');

const getMainCssFile = fs.readdirSync('./src/public/css/');

const getJsFiles = fs.readdirSync('./src/public/js/');

// Export variables
module.exports = {
    paths: {
        src: {
            base: './src/',
        },
        dist: {
            base: './dist/',
            public: './dist/public',
        },
        public: {
            base: './src/public/',
            css: './src/public/css/',
            fonts: './src/public/fonts/',
            img: './src/public/img/',
            js: './src/public/js/',
        },
        client: {
            base: './src/client/',
            modules: './src/client/modules/',
            sass: './src/client/sass/',
            templates: './src/client/templates/',
        },
        config: {
            base: './config/',
        },
    },
    urls: {
        dev: 'http://localhost:3000/',
    },
    vars: {
        sassName: 'main.sass',
    },
    globs: {
        src: ['./src/**/*'],
        distCSS: ['./src/public/css/*.css'],
        distJS: ['./src/public/js/*.js'],
        distSASS: ['./src/client/sass/**/*.sass'],
        distModules: ['./src/client/modules/**/*'],
        distImg: ['./src/public/img/**/*'],
        public: ['./src/public/**/*'],
        distTSServer: ['./src/**/*.ts'],
    },
    files: {
        html: './src/public/index.html',
        template: './src/client/templates/module.html',
        sass: './src/client/sass/main.sass',
        ts: './src/client/modules/main.ts',
        wasm: './src/client/modules/implementation/assembly/wasm.ts',
        sw: './src/client/modules/implementation/serviceWorker/sw.ts',
        server: './src/server.ts',
        get: {
            css: getMainCssFile,
            js: getJsFiles,
        },
    },
    configs: {
        webpack: {
            dev: './webpack.dev.js',
            build: './webpack.build.js',
            sw: './webpack.sw.js',
        },
        ts: {
            node: 'tsconfig.node.json',
            dev: 'tsconfig.json',
            build: 'tsconfig.build.json',
        },
    },
};
