"use strict";

const axe = require('gulp-axe-webdriver');
const cssnano = require('gulp-cssnano');
const filter = require('gulp-filter');
const fontello = require('gulp-fontello');
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const gulpIgnore = require('gulp-ignore');
const handlebars = require('gulp-hb');
const htmllint = require('gulp-htmllint');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const jsonLint = require('gulp-jsonlint');
const plumber = require('gulp-plumber');
const remove = require('gulp-rm');
const replaceExt = require('gulp-ext-replace');
const run = require('gulp-run-command').default;
const sass = require('gulp-sass');
const sassLint = require('gulp-sass-lint');
const uglifyJS = require('gulp-uglify-es').default;


const INPUT_DIR = './public'
const INPUT_ASSETS = {
  downloads: `${INPUT_DIR}/downloads/**/*`,
  fonts: `${INPUT_DIR}/assets/fonts/*`,
  images: `${INPUT_DIR}/assets/**/*.{jpg,png}`,
  svgs: `${INPUT_DIR}/assets/**/*.svg`
};
const INPUT_HTML = `${INPUT_DIR}/{,archive/}*.hbs`;
const INPUT_HANDLEBARS = {
  partials: './partials/**/*.hbs',
  helpers: './helpers/*.js',
  data: './data/*.json'
};
const INPUT_ROOT_FILES = [
  `${INPUT_DIR}/CNAME`,
  `${INPUT_DIR}/*.{htaccess,ico,txt}`
];
const INPUT_SCRIPTS = `${INPUT_DIR}/scripts/**/*.js`;
const INPUT_STYLES = `${INPUT_DIR}/styles/**/*.scss`;

const OUTPUT_SITE = './_site';
const OUTPUT_REPORTS = './_reports';


let minifyOutput = false;


/* Utility tasks */
gulp.task('set-minify-output', function(done) {
  minifyOutput = true;
  done();
});

/* Build tasks */
gulp.task('assets-downloads', function() {
  return gulp.src(INPUT_ASSETS.downloads)
             .pipe(gulp.dest(`${OUTPUT_SITE}/downloads`));
});
gulp.task('assets-fonts', function() {
  return gulp.src(INPUT_ASSETS.fonts)
             .pipe(gulp.dest(`${OUTPUT_SITE}/assets/fonts`));
});
gulp.task('assets-iconography', function() {
  const stylesFilter = filter(['**/*.css'], {restore: true});

  return gulp.src('fontello.config.json')
             .pipe(fontello({
               font: 'assets/fonts',
               css: 'styles',
               assetsOnly: true
             }))
             .pipe(stylesFilter)
             .pipe(gulpIf(minifyOutput, cssnano()))
             .pipe(stylesFilter.restore)
             .pipe(gulp.dest(`${OUTPUT_SITE}`));
});
gulp.task('assets-images', function() {
  return gulp.src(INPUT_ASSETS.images)
             .pipe(gulpIf(minifyOutput, imagemin()))
             .pipe(gulp.dest(`${OUTPUT_SITE}/assets`));
});
gulp.task('assets-svgs', function() {
  return gulp.src(INPUT_ASSETS.svgs)
             .pipe(gulpIgnore.exclude('**/fonts/*.svg'))
             .pipe(gulp.dest(`${OUTPUT_SITE}/assets`));
});
gulp.task('assets', gulp.parallel('assets-downloads', 'assets-fonts', 'assets-iconography', 'assets-images', 'assets-svgs'));
gulp.task('html', function() {
  const stdHelpers = require('handlebars-helpers');

  return gulp.src(INPUT_HTML)
             .pipe(plumber())
             .pipe(
                handlebars()
                  .partials(INPUT_HANDLEBARS.partials)
                  .helpers(stdHelpers)
                  .helpers(INPUT_HANDLEBARS.helpers)
                  .data(INPUT_HANDLEBARS.data)
                )
             .pipe(gulpIf(minifyOutput, htmlmin({collapseWhitespace: true})))
             .pipe(replaceExt('.html'))
             .pipe(gulp.dest(OUTPUT_SITE));
});
gulp.task('metadata', function() {
  return gulp.src(INPUT_ROOT_FILES)
             .pipe(gulp.dest(OUTPUT_SITE));
});
gulp.task('scripts', function() {
  return gulp.src(INPUT_SCRIPTS)
             .pipe(gulpIf(minifyOutput, uglifyJS()))
             .pipe(gulp.dest(`${OUTPUT_SITE}/scripts`));
});
gulp.task('styles', function() {
  return gulp.src(INPUT_STYLES)
             .pipe(sass().on('error', sass.logError))
             .pipe(gulpIf(minifyOutput, cssnano()))
             .pipe(gulp.dest(`${OUTPUT_SITE}/styles`));
});

/* Miscellaneous tasks */
gulp.task('build', gulp.parallel('assets', 'metadata', 'html', 'scripts', 'styles'));
gulp.task('build:watch', gulp.series('build', function() {
  gulp.watch(INPUT_ASSETS.downloads, gulp.task('assets-downloads'));
  gulp.watch(INPUT_ASSETS.fonts, gulp.task('assets-fonts'));
  gulp.watch(INPUT_ASSETS.images, gulp.task('assets-images'));
  gulp.watch(INPUT_ASSETS.svgs, gulp.task('assets-svg'));
  gulp.watch([INPUT_HTML, ...Object.values(INPUT_HANDLEBARS)], gulp.task('html'));
  gulp.watch(INPUT_ROOT_FILES, gulp.task('metadata'));
  gulp.watch(INPUT_SCRIPTS, gulp.task('scripts'));
  gulp.watch(INPUT_STYLES, gulp.task('styles'));
}));
gulp.task('clean', function() {
  return gulp.src([`${OUTPUT_REPORTS}/**/*`, `${OUTPUT_SITE}/**/*`])
             .pipe(remove());
});
gulp.task('default', gulp.series('clean', 'build'));
gulp.task('dist', gulp.series('clean', 'set-minify-output', 'build'));

/* Server */
const server = run('./node_modules/.bin/http-server ./_site -p 4000');
gulp.task('server', gulp.series('build', server));
gulp.task('serve', gulp.parallel('build:watch', server));

/* Static analysis */
gulp.task('analyze:a11y', gulp.series('clean', 'build', function() {
  return axe({
    errorOnViolation: true,
    folderOutputReport: OUTPUT_REPORTS,
    headless: true,
    saveOutputIn: 'a11y-report.json',
    urls: ['_site/**/*.html']
  });
}));
gulp.task('analyze:perf', run(`./node_modules/.bin/lighthouse http://localhost:4000/ --chrome-flags='--headless' --output-path=${OUTPUT_REPORTS}/lighthouse-report.html --view`));
gulp.task('lint-html', gulp.series('set-minify-output', 'html', function() {
  return gulp.src(`${OUTPUT_SITE}/**/*.html`)
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
