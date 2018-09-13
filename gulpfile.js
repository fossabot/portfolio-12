const gulp = require('gulp');
const handlebars = require('gulp-hb');
const htmlLint = require('gulp-htmllint');
const jsonLint = require('gulp-jsonlint');
const liquid = require('gulp-liquidjs');
const remove = require('gulp-rm');
const sass = require('gulp-sass');
const sassLint = require('gulp-sass-lint');
const sequential = require('gulp-sequence');
const replaceExt = require('gulp-ext-replace');

const OUTPUT_DIR = './_site';

const FILES_ASSETS = './assets/**/*';
const FILES_DATA = './_data/*';
const FILES_DOWNLOADS = './downloads/**/*';
const FILES_HTML = ['./*.hbs', './archive/*.html'];
const FILES_HANDLEBARS = ['./_helpers/*', './_includes/*'];
const FILES_MISC = ['./LICENSE', './CNAME', './*.{htaccess,ico,txt}'];
const FILES_SCRIPTS = './scripts/**/*.js';
const FILES_STYLES = './styles/**/*.scss';

/* Build subtasks */
gulp.task('assets', function() {
  return gulp.src(FILES_ASSETS)
    .pipe(gulp.dest(`${OUTPUT_DIR}/assets`));
});

gulp.task('files', function() {
  return gulp.src(FILES_MISC)
    .pipe(gulp.dest(OUTPUT_DIR));
  return gulp.src(FILES_DOWNLOADS)
    .pipe(gulp.dest(`${OUTPUT_DIR}/downloads`));
});

gulp.task('html', function() {
  return gulp.src('./*.hbs')
    .pipe(
      handlebars()
        .partials('./_includes/*.hbs')
        .helpers('./_helpers/*.js')
        .data('./_data/*.json')
    )
    .pipe(replaceExt('.html'))
    .pipe(gulp.dest(OUTPUT_DIR));

  return gulp.src('./archive/*.html')
    .pipe(liquid())
    .pipe(gulp.dest(`${OUTPUT_DIR}/archive`))
});

gulp.task('misc', function() {
  return gulp.src('./iam/**').pipe(gulp.dest(`${OUTPUT_DIR}/iam`));
});

gulp.task('scripts', function() {
  return gulp.src(FILES_SCRIPTS)
    .pipe(gulp.dest(`${OUTPUT_DIR}/scripts`));
});

gulp.task('styles', function() {
  return gulp.src(FILES_STYLES)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(`${OUTPUT_DIR}/styles`));
});

/* Lint subtasks */
gulp.task('lint-html', ['build'], function() {
  let reporter = (filepath,issues)=>{if(issues.length>0){console.log(`[htmllint] Found ${issues.length} issue(s) in '${filepath}'`);issues.forEach(issue=>{console.log(`[htmllint] ${filepath} [${issue.line}, ${issue.column}]: (${issue.code}) ${issue.msg}`)});process.exitCode=1}};

  return gulp.src('./_site/**/*.html')
    .pipe(htmlLint({config: './.htmllintrc'}, reporter));
});

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

/* General tasks */
gulp.task('build', ['assets', 'files', 'html', 'misc', 'scripts', 'styles']);
gulp.task('clean', function() {
  return gulp.src(`${OUTPUT_DIR}/**/*`)
    .pipe(remove());
});
gulp.task('dev', ['build'], function() {
  gulp.watch(FILES_DATA, ['build']);
  gulp.watch(FILES_MISC, ['files']);
  gulp.watch(FILES_DOWNLOADS, ['files']);
  gulp.watch([...FILES_HTML, ...FILES_HANDLEBARS], ['html']);
  gulp.watch(FILES_ASSETS, ['assets']);
  gulp.watch(FILES_SCRIPTS, ['scripts']);
  gulp.watch(FILES_STYLES, ['styles']);
});
gulp.task('lint', ['lint-json', /*'lint-html',*/ 'lint-styles']);

gulp.task('default', sequential('clean', 'build'));
