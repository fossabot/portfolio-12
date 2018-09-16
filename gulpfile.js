"use strict";

const cssnano = require('gulp-cssnano');
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const handlebars = require('gulp-hb');
const htmllint = require('gulp-htmllint');
const htmlmin = require('gulp-htmlmin');
const jsonLint = require('gulp-jsonlint');
const liquid = require('gulp-liquidjs');
const plumber = require('gulp-plumber');
const remove = require('gulp-rm');
const replaceExt = require('gulp-ext-replace');
const sass = require('gulp-sass');
const sassLint = require('gulp-sass-lint');
const uglifyJS = require('gulp-uglify-es').default;


const INPUT_ASSETS = './assets/**/*';
const INPUT_DOWNLOADS = './downloads/**/*';
const INPUT_HTML = '{,./archive/}*.hbs';
const INPUT_HANDLEBARS = [
  './_includes/*.hbs', // Partials
  './_helpers/*.js',   // Helpers
  './_data/*.json'     // Data
];
const INPUT_ROOT_FILES = ['./CNAME', './*.{htaccess,ico,txt}'];
const INPUT_SCRIPTS = './scripts/**/*.js';
const INPUT_STYLES = './styles/**/*.scss';

const OUTPUT_DIR = './_site';

let minifyOutput = false;


/* Utility tasks */
gulp.task('set-minify-output', function(done) {
  minifyOutput = true;
  done();
});

/* Build tasks */
gulp.task('assets', function() {
  return gulp.src(INPUT_ASSETS)
    .pipe(gulp.dest(`${OUTPUT_DIR}/assets`));
});
gulp.task('files', function() {
  return gulp.src(INPUT_ROOT_FILES)
    .pipe(gulp.dest(OUTPUT_DIR));
  return gulp.src(INPUT_DOWNLOADS)
    .pipe(gulp.dest(`${OUTPUT_DIR}/downloads`));
});
gulp.task('html', function() {
  const hbHelpers = require('handlebars-helpers');

  return gulp.src(INPUT_HTML)
    .pipe(plumber())
    .pipe(
      handlebars()
        .partials(INPUT_HANDLEBARS[0])
        .helpers(hbHelpers)
        .helpers(INPUT_HANDLEBARS[1])
        .data(INPUT_HANDLEBARS[2])
    )
    .pipe(gulpIf(minifyOutput, htmlmin({collapseWhitespace: true})))
    .pipe(replaceExt('.html'))
    .pipe(gulp.dest(OUTPUT_DIR));
});
gulp.task('misc', function() {
  return gulp.src('./iam/**')
    .pipe(gulp.dest(`${OUTPUT_DIR}/iam`));
});
gulp.task('scripts', function() {
  return gulp.src(INPUT_SCRIPTS)
    .pipe(gulpIf(minifyOutput, uglifyJS()))
    .pipe(gulp.dest(`${OUTPUT_DIR}/scripts`));
});
gulp.task('styles', function() {
  return gulp.src(INPUT_STYLES)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpIf(minifyOutput, cssnano()))
    .pipe(gulp.dest(`${OUTPUT_DIR}/styles`));
});

/* Miscellaneous tasks */
gulp.task('build', gulp.parallel('assets', 'files', 'html', 'misc', 'scripts', 'styles'));
gulp.task('clean', function() {
  return gulp.src(`${OUTPUT_DIR}/**/*`)
    .pipe(remove());
});
gulp.task('default', gulp.series('clean', 'build'));
gulp.task('dev', gulp.series('build', function() {
  gulp.watch(INPUT_ROOT_FILES, gulp.task('files'));
  gulp.watch(INPUT_DOWNLOADS, gulp.task('files'));
  gulp.watch([INPUT_HTML, ...INPUT_HANDLEBARS], gulp.task('html'));
  gulp.watch(INPUT_ASSETS, gulp.task('assets'));
  gulp.watch(INPUT_SCRIPTS, gulp.task('scripts'));
  gulp.watch(INPUT_STYLES, gulp.task('styles'));
}));
gulp.task('dist', gulp.series('clean', 'set-minify-output', 'build'));

/* Lint tasks */
gulp.task('lint-html', gulp.series('set-minify-output', 'html', function() {
  return gulp.src(`${OUTPUT_DIR}/**/*.html`)
    .pipe(htmllint('.htmlhintrc'));
}));
gulp.task('lint-json', function() {
  return gulp.src(['./_data/*.json', './_helpers/data/*.json'])
    .pipe(jsonLint())
    .pipe(jsonLint.reporter());
});
gulp.task('lint-styles', function() {
  return gulp.src(['./styles/*.scss', './styles/mixins/*.scss'])
    .pipe(sassLint({options: './.sass-lint.yml'}))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

gulp.task('lint', gulp.parallel('lint-json', 'lint-html', 'lint-styles'));
