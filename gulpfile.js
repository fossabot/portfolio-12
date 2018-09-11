const gulp = require('gulp');
const liquid = require('gulp-liquidjs');
const handlebars = require('gulp-hb');
const remove = require('gulp-rm');
const sass = require('gulp-sass');
const sequential = require('gulp-sequence');
const replaceExt = require('gulp-ext-replace');

const OUTPUT_DIR = './_site';

gulp.task('assets', function() {
  gulp.src('./assets/**/*')
    .pipe(gulp.dest(`${OUTPUT_DIR}/assets`));
});

gulp.task('clean', function() {
  return gulp.src(`${OUTPUT_DIR}/**/*`)
    .pipe(remove());
});

gulp.task('files', function() {
  gulp.src(['./CNAME', './LICENSE', './*.{htaccess,ico,txt}'])
    .pipe(gulp.dest(OUTPUT_DIR));
  gulp.src('./downloads/**')
  .pipe(gulp.dest(`${OUTPUT_DIR}/downloads`));
});

gulp.task('html', function() {
  gulp.src('./*.hbs')
    .pipe(
      handlebars()
        .partials('./_includes/*.hbs')
        .helpers('./_helpers/*.js')
        .data('./_data/*.json')
    )
    .pipe(replaceExt('.html'))
    .pipe(gulp.dest(OUTPUT_DIR));

  gulp.src('./archive/*.html')
    .pipe(liquid())
    .pipe(gulp.dest(`${OUTPUT_DIR}/archive`))
});

gulp.task('misc', function() {
  gulp.src('./iam/**').pipe(gulp.dest(`${OUTPUT_DIR}/iam`));
});

gulp.task('scripts', function() {
  gulp.src('./scripts/**/*')
    .pipe(gulp.dest(`${OUTPUT_DIR}/scripts`));
});

gulp.task('styles', function() {
  return gulp.src('./styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(`${OUTPUT_DIR}/styles`));
});

gulp.task('default', sequential('clean', ['assets', 'files', 'html', 'misc', 'scripts', 'styles']));
gulp.task('serve', ['default'], function() {
  // gulp.watch('./_data/*', ['default']);
  gulp.watch(['./LICENSE', './CNAME', './*.{htaccess,ico,txt}'], ['files']);
  gulp.watch('./downloads/**', ['files']);
  gulp.watch(['./*.hbs', './archive/*.html', './_helpers/*', './_includes/*'], ['html']);
  gulp.watch('./assets/**/*', ['assets']);
  gulp.watch('./scripts/**/*', ['scripts']);
  gulp.watch('./styles/**/*', ['styles']);
});
