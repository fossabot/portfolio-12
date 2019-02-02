# Portfolio
Repository for the personal portfolio of Eric Cornelissen.

### Build tools
| Functionality | Tool |
|---|---|
| Accessibility tester | [aXe](https://www.axe-core.org/) |
| Automatic reloading | [browser-sync](https://browsersync.io/) |
| Build tool | [Gulp](https://gulpjs.com/) |
| CSS preprocessor | [Sass](http://sass-lang.com/) |
| HTML linter | [htmllint](http://htmllint.github.io/) |
| Iconography | [Fontello](http://fontello.com/) |
| JavaScript linter | [JSHint](https://jshint.com/) |
| JSON linter | [jsonlint](https://github.com/zaach/jsonlint) |
| Performance evaluator | [Lighthouse](https://github.com/GoogleChrome/lighthouse) |
| Site generator | [Handlebars.js](https://handlebarsjs.com/builtin_helpers.html) |
| Stylesheet linter | [sass-lint](https://github.com/sasstools/sass-lint) |

###### How to use the build tools
- `$ gulp`: Build the site, watch for changes, and start a simple HTTP server (on port 4000) serving the site with live reload.
- `$ gulp analyze:a11y`: Test the website for accessibility issues.
  - Result can be found in `./_reports`.
- `$ gulp analyze:perf`: Do a performance check on the sites landing page.
  - Result can be found in `./_reports`.
- `$ gulp build`: Build the project once.
- `$ gulp build:watch`: Build the project and watch for changes.
- `$ gulp clean`: Clean the project, removing all generated files.
- `$ gulp dist`: Build the project for distributing purposes.
- `$ gulp lint`: Lint the source code of the project.
- `$ gulp server`: Start a simple HTTP server (on port 4000) serving the site.
  - Requires `$ gulp build` or `$ gulp dist`.
