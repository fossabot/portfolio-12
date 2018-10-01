# Portfolio
Repository for the personal portfolio of Eric Cornelissen.

### Build tools
| Functionality | Tool |
|---|---|
| Accessibility tester | [aXe](https://www.axe-core.org/) |
| Build tool | [Gulp](https://gulpjs.com/) |
| CSS preprocessor | [Sass](http://sass-lang.com/) |
| HTML linter | [htmllint](http://htmllint.github.io/) |
| Iconography | [Fontello](http://fontello.com/) |
| JSON linter | [jsonlint](https://github.com/zaach/jsonlint) |
| Performance evaluator | [Lighthouse](https://github.com/GoogleChrome/lighthouse) |
| Site generator | [Handlebars.js](https://handlebarsjs.com/builtin_helpers.html) |
| Style linter | [sass-lint](https://github.com/sasstools/sass-lint) |

###### How to use the build tools:
- `$ gulp analyze:a11y`: Test the website for accessibility issues. Result can be found in `./reports`.
- `$ gulp analyze:perf`: Do a performance check on the sites landing page. Result can be found in `./reports`. (requires `$ gulp serve(r)`)
- `$ gulp build`: Build the project once.
- `$ gulp build:watch`: Build the project and watch for changes.
- `$ gulp clean`: Clean the project, removing all generated files.
- `$ gulp dist`: Build the project for distributing purposes.
- `$ gulp lint`: Lint the source code of the project.
- `$ gulp serve`: Build the site, watch for changes, and start a simple HTTP server (on port 4000) serving the site.
- `$ gulp server`: Start a simple HTTP server (on port 4000) serving the site. (requires at least `$ gulp build`)
