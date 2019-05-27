'use strict';

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const stylelint = require('gulp-stylelint');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();

const lint = () => {
    return gulp.src(['src/*.scss', 'src/**/*.scss'])
        .pipe(plumber())
        .pipe(stylelint({
            debug: true,
            failAfterError: true,
            reporters: [
                { formatter: 'string', console: true }
            ]
        }));
};

const style = () => {
    return gulp.src('src/style.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([require('autoprefixer')]))
        .pipe(cleanCSS())
        .pipe(gulp.dest('build'))
        .pipe(browserSync.stream());
};

const html = () => {
    return gulp.src('src/*.html')
        .pipe(plumber())
        .pipe(gulp.dest('build'))
        .pipe(browserSync.stream());
};

const assets = () => {
    return gulp.src(['assets/*.*', 'assets/**/*.*', '!assets/**/*.md', '!assets/*.md'])
        .pipe(plumber())
        .pipe(gulp.dest('build'))
        .pipe(browserSync.stream());
};

const watch = () => {
    browserSync.init({
        server: 'build',
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch(['src/*.scss', 'src/**/*.scss'], gulp.series(lint, style));
    gulp.watch('src/*.html', gulp.series(html));
};

const build = gulp.series(assets, lint, style, html);

exports.stylelint = lint;
exports.build = build;
exports.default = gulp.series(build, watch);
