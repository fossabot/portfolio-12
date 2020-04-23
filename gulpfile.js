"use strict";

const axe = require('gulp-axe-webdriver');
const browserSync = require('browser-sync').create();
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const gulpIgnore = require('gulp-ignore');
const handlebars = require('gulp-hb');
const htmllint = require('gulp-htmllint');
const htmlmin = require('gulp-htmlmin');
const iconfont = require('gulp-iconfont');
const imagemin = require('gulp-imagemin');
const isCI = require('is-ci');
const jshint = require('gulp-jshint');
const jsonLint = require('gulp-jsonlint');
const jsonSchema = require("gulp-json-schema");
const jswrap = require('gulp-js-wrapper');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const remove = require('gulp-rm');
const replaceExt = require('gulp-ext-replace');
const run = require('gulp-run-command').default;
const stylelint = require('gulp-stylelint');
const uglifyJS = require('gulp-uglify-es').default;


const INPUT_DIR = './www'
const INPUT_ASSETS = {
  downloads: `${INPUT_DIR}/downloads/**/*`,
  fonts: `${INPUT_DIR}/assets/fonts/*`,
  icons: `${INPUT_DIR}/assets/icons/*.svg`,
  images: `${INPUT_DIR}/assets/**/*.{jpg,png}`,
  svgs: `${INPUT_DIR}/assets/**/*.svg`
};
const INPUT_HTML = `${INPUT_DIR}/{,archive,timeline/}*.hbs`;
const INPUT_HANDLEBARS = {
  partials: './partials/**/*.hbs',
  helpers: './helpers/*.js',
  data: './data/*.json'
};
const INPUT_ROOT_FILES = [
  `${INPUT_DIR}/.htaccess`,
  `${INPUT_DIR}/CNAME`,
  `${INPUT_DIR}/favicon.ico`,
  `${INPUT_DIR}/robots.txt`
];
const INPUT_SCRIPTS = `${INPUT_DIR}/scripts/**/*.js`;
const INPUT_STYLES = {
  all: `${INPUT_DIR}/styles/**/*.css`,
  bundles: `${INPUT_DIR}/styles/bundle*.css`
};

const OUTPUT_SITE = './_site';
const OUTPUT_REPORTS = './_reports';

const TEST_DIR = './tests';
const TEST_FILES = `${TEST_DIR}/**/*.js`;


let minifyOutput = false;
let serverActive = false;
let watchingFiles = false;


function gracefulExit(done) {
  browserSync.exit();
  done();
};

function sleep(timeout) {
  return function(done) {
    setTimeout(done, timeout);
  };
};


/* Utility */
gulp.task('clean:site', function() {
  return gulp.src(`${OUTPUT_SITE}/**/{.,}*`, { read: false })
             .pipe(remove());
});
gulp.task('clean:reports', function() {
  return gulp.src(`${OUTPUT_REPORTS}/**/*`, { read: false })
             .pipe(remove());
});
gulp.task('clean:tests', function() {
  return gulp.src(`${TEST_DIR}/_artifacts/**/*`, { read: false })
             .pipe(remove());
});
gulp.task('clean', gulp.parallel('clean:reports', 'clean:site', 'clean:tests'));

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
  return gulp.src(INPUT_ASSETS.icons)
             .pipe(iconfont({
               fontName: 'icon-e',
               fontHeight: 1001,
               formats: ['eot', 'svg', 'ttf', 'woff'],
               normalize: true
             }))
             .pipe(gulp.dest(`${OUTPUT_SITE}/assets/fonts`));
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
             .pipe(jswrap({
               globals: { window: 'root' }
             }))
             .pipe(gulpIf(minifyOutput, uglifyJS()))
             .pipe(gulp.dest(`${OUTPUT_SITE}/scripts`));
});
gulp.task('styles', function() {
  const atApply = require('postcss-apply');
  const atImport = require('postcss-import');
  const autoprefixer = require('autoprefixer');
  const customMedia = require('postcss-custom-media');
  const cssnano = require('cssnano');
  const cssVariables = require('postcss-css-variables');
  const extendRules = require('postcss-extend');
  const nestedRules = require('postcss-nested');

  return gulp.src(INPUT_STYLES.bundles)
             .pipe(postcss([
               // Bundle all styles using @import
               atImport(),

               // Apply other plugins to bundled css
               atApply(),
               autoprefixer(),
               cssVariables(),
               customMedia(),
               extendRules(),
               nestedRules(),

               // Finally minify the CSS (if needed)
               minifyOutput ? cssnano() : x => x
             ]))
             .pipe(gulp.dest(`${OUTPUT_SITE}/styles`));
});

gulp.task('build', gulp.parallel('assets', 'metadata', 'html', 'scripts', 'styles'));
gulp.task('build:watch', function() {
  watchingFiles = true;

  const watch = (files, task) => gulp.watch(files, task).on('all', browserSync.reload);
  watch(INPUT_ASSETS.downloads, gulp.task('assets-downloads'));
  watch(INPUT_ASSETS.fonts, gulp.task('assets-fonts'));
  watch(INPUT_ASSETS.icons, gulp.task('assets-iconography'));
  watch(INPUT_ASSETS.images, gulp.task('assets-images'));
  watch(INPUT_ASSETS.svgs, gulp.task('assets-svgs'));
  watch([INPUT_HTML, ...Object.values(INPUT_HANDLEBARS)], gulp.task('html'))
  watch(INPUT_ROOT_FILES, gulp.task('metadata'));
  watch(INPUT_SCRIPTS, gulp.task('scripts'));
  watch(INPUT_STYLES.all, gulp.task('styles'));
});
gulp.task('dist', gulp.series('clean:site', 'set-minify-output', 'build'));

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
          extensions: ['html']
        }
      }
    }, done);
  }
));
gulp.task('serve', gulp.series('build', 'server', 'build:watch'));

/* Static analysis */
const lighthouse = run(`./node_modules/.bin/lighthouse http://localhost:4000/ --config-path=.lighthouse.js --chrome-flags=--headless --output-path=${OUTPUT_REPORTS}/lighthouse-report.html --view`);
gulp.task('analyze:a11y', gulp.series('clean:site', 'build', function() {
  return axe({
    errorOnViolation: true,
    folderOutputReport: OUTPUT_REPORTS,
    headless: true,
    saveOutputIn: 'a11y-report.json',
    urls: ['_site/**/*.html']
  });
}));
gulp.task('analyze:perf', gulp.series('clean:site', 'dist', 'server', lighthouse, gracefulExit));

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
      const schema = require('./.jsonschema.json').contributions;
      return gulp.src('./data/contributions.json')
                 .pipe(jsonSchema({schema}))
    },
    function() {
      const schema = require('./.jsonschema.json').metadata;
      return gulp.src('./data/metadata.json')
                 .pipe(jsonSchema({schema}))
    },
    function() {
      const schema = require('./.jsonschema.json').projects;
      return gulp.src('./data/projects.json')
                 .pipe(jsonSchema({schema}))
    },
    function() {
      const schema = require('./.jsonschema.json').site;
      return gulp.src('./data/site.json')
                 .pipe(jsonSchema({schema}))
    },
    function() {
      const schema = require('./.jsonschema.json').snippets;
      return gulp.src('./data/snippets.json')
                 .pipe(jsonSchema({schema}))
    },
    function() {
      const schema = require('./.jsonschema.json').social;
      return gulp.src('./data/social.json')
                 .pipe(jsonSchema({schema}))
    },
    function() {
      const schema = require('./.jsonschema.json').timeline;
      return gulp.src('./data/timeline.json')
                 .pipe(jsonSchema({schema}))
    }
  )
));
gulp.task('lint-scripts', function() {
  return gulp.src([INPUT_HANDLEBARS.helpers, INPUT_SCRIPTS, TEST_FILES])
             .pipe(jshint())
             .pipe(jshint.reporter('default'))
             .pipe(jshint.reporter('fail'));
});
gulp.task('lint-styles', function() {
  return gulp.src(INPUT_STYLES.all)
             .pipe(stylelint({
                failAfterError: true,
                reporters: [
                  {formatter: 'string', console: true}
                ]
              }));
});
gulp.task('lint', gulp.parallel('lint-json', 'lint-html', 'lint-scripts', 'lint-styles'));

/* Testing */
const testIntegration = run('./node_modules/.bin/jest');
gulp.task('test', gulp.series('clean:site', 'clean:tests', 'build', 'server', sleep(isCI ? 10000 : 0), testIntegration, gracefulExit));

/* Default */
gulp.task('default', gulp.series('clean:site', 'serve'));
