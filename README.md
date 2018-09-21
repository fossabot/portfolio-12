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
- `$ gulp build`: Build the project once.
- `$ gulp build:watch`: Build the project and watch for changes.
- `$ gulp clean`: Clean the project, removing all generated files.
- `$ gulp dist`: Build the project for distributing purposes.
- `$ gulp lint`: Lint the source code of the project.
- `$ npm run axe`: Test the website for a11y issues. (requires `$ npm run serve`)
- `$ npm run lighthouse`: Do a performance check on the sites landing page. (requires `$ npm run serve`)
- `$ npm run serve`: Build the site and start a simple HTTP server (on port 4000).
- `$ npm run start`: Start a simple HTTP server (on port 4000) for the project.
