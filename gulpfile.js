const gulp = require('gulp');
const liquid = require('gulp-liquidjs');
const remove = require('gulp-rm');
const sass = require('gulp-sass');
const sequential = require('gulp-sequence');

const OUTPUT_DIR = './_site';

gulp.task('assets', function() {
  gulp.src('./assets/**')
    .pipe(gulp.dest(`${OUTPUT_DIR}/assets`));
});

gulp.task('clean', function() {
  return gulp.src(`${OUTPUT_DIR}/**/*`)
    .pipe(remove());
});

gulp.task('files', function() {
  gulp.src('./LICENSE').pipe(gulp.dest(OUTPUT_DIR));
  gulp.src('./CNAME').pipe(gulp.dest(OUTPUT_DIR));
  gulp.src('./*.{htaccess,ico,txt}').pipe(gulp.dest(OUTPUT_DIR));
});

gulp.task('html', function() {
  const metadata = require('./_data/metadata.json');
  const portfolio = require('./_data/portfolio.json');
  const social = require('./_data/social.json');

  gulp.src('./*.html')
    .pipe(
      liquid({
        data: {
          site: { data: { metadata, portfolio, social } }
        }
      })
    )
    .pipe(gulp.dest(OUTPUT_DIR));

  gulp.src('./portfolio/*.html')
    .pipe(liquid())
    .pipe(gulp.dest(`${OUTPUT_DIR}/portfolio`))
});

gulp.task('misc', function() {
  gulp.src('./iam/**')
    .pipe(gulp.dest(`${OUTPUT_DIR}/iam`));
  gulp.src('./downloads/**')
    .pipe(gulp.dest(`${OUTPUT_DIR}/downloads`));
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
