const gulp = require('gulp');
const liquid = require('gulp-liquidjs');
const handlebars = require('gulp-hb');
const remove = require('gulp-rm');
const sass = require('gulp-sass');
const sequential = require('gulp-sequence');

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
  gulp.src('./index.html')
    .pipe(
      handlebars()
        .partials('./_includes/*.hbs')
        .helpers('./_helpers/*.js')
        .data('./_data/*.json')
    )
    .pipe(gulp.dest(OUTPUT_DIR));

  gulp.src('./404.html')
    .pipe(liquid())
    .pipe(gulp.dest(OUTPUT_DIR))

  gulp.src('./portfolio/*.html')
    .pipe(liquid())
    .pipe(gulp.dest(`${OUTPUT_DIR}/portfolio`))
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
  gulp.watch(['./LICENSE', './CNAME', './*.{htaccess,ico,txt}'], ['files']);
  gulp.watch('./downloads/**', ['files']);
  gulp.watch(['./*.html', './portfolio/*.html', './_helpers/*.js', './_includes/*.hbs'], ['html']);
  gulp.watch('./assets/**/*', ['assets']);
  gulp.watch('./scripts/**/*', ['scripts']);
  gulp.watch('./styles/**/*', ['styles']);
});
