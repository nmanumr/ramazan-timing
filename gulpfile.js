const gulp = require('gulp');
const size = require('gulp-size');
const del = require('del');

const rollup = require('rollup');
const { terser } = require('rollup-plugin-terser');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const typescript = require('rollup-plugin-typescript2');
const commonjs = require('@rollup/plugin-commonjs');

const postcss = require('gulp-postcss');
const concatCss = require('gulp-concat-css');

const outputDir = './dist';

const inputOptions = [
    {
        input: './src/index.ts',
        external: ['./build/pyodide.js'],
        plugins: [
            nodeResolve(),
            commonjs(),
            typescript(),
        ],
    },
];

const watchOptions = inputOptions.map((input) => {
    return {
        ...input,
        output: {
            dir: outputDir,
            format: 'esm',
        },
        watch: {
            include: 'src/**/*',
        },
    }
});

async function jsDevelopment() {
    const watcher = rollup.watch(watchOptions);

    watcher.on('event', event => {
        if (event.code === 'ERROR') return console.log(event);
    });
}

function jsProduction() {
    return Promise.all(
        inputOptions.map(async (input) => {
            const bundle = await rollup.rollup(input);

            await bundle.write({
                dir: outputDir,
                format: 'esm',
                sourcemap: true,
                plugins: [terser({ format: { comments: false } })],
            });
            await bundle.close();
        })
    );
}

function postCSS() {
    return gulp.src('./src/styles.css')
        .pipe(postcss())
        .pipe(size({ title: 'styles' }))
        .pipe(concatCss('styles.css'))
        .pipe(gulp.dest(outputDir))
}

function copyHTML() {
    return gulp.src('./src/index.html')
        .pipe(gulp.dest(outputDir));
}

function watcher(cb) {
    gulp.watch([
        './src/**/*.css',
        './src/**/*.tsx',
        './src/index.html'
    ], postCSS, cb);

    gulp.watch([
        './src/index.html'
    ], copyHTML, cb);
}

function clean() {
    return del([
        outputDir + '/**/*',
    ]);
}

module.exports = {
    clean,
    postCSS,
    jsDevelopment,
    jsProduction,
    build: gulp.series(
        clean,
        gulp.parallel(jsProduction, postCSS, copyHTML),
    ),
    default: gulp.series(
        clean,
        gulp.parallel(jsDevelopment, postCSS, copyHTML, watcher),
    ),
}
