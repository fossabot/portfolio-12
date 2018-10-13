"use strict";

const axe = require('gulp-axe-webdriver');
const browserSync = require('browser-sync').create();
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
const jsonSchema = require("gulp-json-schema");
const jswrap = require('gulp-js-wrapper');
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
let serverActive = false;
let watchingFiles = false;


/* Utility */
gulp.task('clean', function() {
  return gulp.src([`${OUTPUT_REPORTS}/**/*`, `${OUTPUT_SITE}/**/*`])
             .pipe(remove());
});
gulp.task('set-minify-output', function(done) {
  minifyOutput = true;
  done();
});

/* Build */
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
             .pipe(jswrap({}))
             .pipe(gulpIf(minifyOutput, uglifyJS()))
             .pipe(gulp.dest(`${OUTPUT_SITE}/scripts`));
});
gulp.task('styles', function() {
  return gulp.src(INPUT_STYLES)
             .pipe(sass().on('error', sass.logError))
             .pipe(gulpIf(minifyOutput, cssnano()))
             .pipe(gulp.dest(`${OUTPUT_SITE}/styles`));
});

gulp.task('build', gulp.parallel('assets', 'metadata', 'html', 'scripts', 'styles'));
gulp.task('build:watch', function() {
  watchingFiles = true;

  const watch = (files, task) => gulp.watch(files, task).on('change', browserSync.reload);
  watch(INPUT_ASSETS.downloads, gulp.task('assets-downloads'));
  watch(INPUT_ASSETS.fonts, gulp.task('assets-fonts'));
  watch(INPUT_ASSETS.images, gulp.task('assets-images'));
  watch(INPUT_ASSETS.svgs, gulp.task('assets-svgs'));
  watch([INPUT_HTML, ...Object.values(INPUT_HANDLEBARS)], gulp.task('html'))
  watch(INPUT_ROOT_FILES, gulp.task('metadata'));
  watch(INPUT_SCRIPTS, gulp.task('scripts'));
  watch(INPUT_STYLES, gulp.task('styles'));
});
gulp.task('dist', gulp.series('clean', 'set-minify-output', 'build'));

/* Server */
gulp.task('server', gulp.series(
  function(done) {
    const fs = require('fs');

    if (!fs.existsSync(OUTPUT_SITE) || fs.readdirSync(OUTPUT_SITE).length === 0) {
      throw new Error('Site has not been build yet. Run "gulp build" or "gulp dist" first.');
    } else {
      done();
    }
  },
  function(done) {
    serverActive = true;
    browserSync.init({
      open: false,
      port: 4000,
      server: {
        baseDir: OUTPUT_SITE,
        serveStaticOptions: {
          extensions: ["html"]
        }
      }
    }, done);
  }
));
gulp.task('serve', gulp.series('build', 'server', 'build:watch'));

/* Static analysis */
const lighthouse = run(`./node_modules/.bin/lighthouse http://localhost:4000/ --config-path=.lighthouse.js --chrome-flags=--headless --output-path=${OUTPUT_REPORTS}/lighthouse-report.html --view`);
gulp.task('analyze:a11y', gulp.series('clean', 'build', function() {
  return axe({
    errorOnViolation: true,
    folderOutputReport: OUTPUT_REPORTS,
    headless: true,
    saveOutputIn: 'a11y-report.json',
    urls: ['_site/**/*.html']
  });
}));
gulp.task('analyze:perf', gulp.series('server', lighthouse, function(done) {
  browserSync.exit();
  done();
}));
gulp.task('lint-html', gulp.series('set-minify-output', 'html', function() {
  return gulp.src(`${OUTPUT_SITE}/**/*.html`)
             .pipe(htmllint('.htmlhintrc'));
}));
gulp.task('lint-json', gulp.series(
  function() {
    return gulp.src('./data/*.json')
               .pipe(jsonLint())
               .pipe(jsonLint.reporter());
  },
  gulp.parallel(
    function() {
      const schema = require('./.jsonschema.json').metadata;
      return gulp.src('./data/metadata.json')
                 .pipe(jsonSchema({schema}))
    },
    function() {
      const schema = require('./.jsonschema.json').portfolio;
      return gulp.src('./data/portfolio.json')
                 .pipe(jsonSchema({schema}))
    },
    function() {
      const schema = require('./.jsonschema.json').site;
      return gulp.src('./data/site.json')
                 .pipe(jsonSchema({schema}))
    },
    function() {
      const schema = require('./.jsonschema.json').social;
      return gulp.src('./data/social.json')
                 .pipe(jsonSchema({schema}))
    }
  )
));
gulp.task('lint-styles', function() {
  return gulp.src(['./styles/*.scss', './styles/mixins/*.scss'])
             .pipe(sassLint({options: './.sass-lint.yml'}))
             .pipe(sassLint.format())
             .pipe(sassLint.failOnError());
});

gulp.task('lint', gulp.parallel('lint-json', 'lint-html', 'lint-styles'));

/* Default */
gulp.task('default', gulp.series('clean', 'serve'));
