# Portfolio

Repository for the personal portfolio of Eric Cornelissen.

## Build tools

| Functionality         | Tool            |
| --------------------- | --------------- |
| Accessibility tester  | [aXe]           |
| Automatic reloading   | [browser-sync]  |
| Build tool            | [Gulp]          |
| CSS preprocessor      | [PostCSS]       |
| HTML linter           | [htmllint]      |
| JavaScript linter     | [JSHint]        |
| JSON linter           | [jsonlint]      |
| MarkDown linter       | [markdownlint]  |
| Performance evaluator | [Lighthouse]    |
| Site generator        | [Handlebars.js] |
| Stylesheet linter     | [stylelint]     |
| Test runner           | [Jest]          |

### How to use the build tools

- `$ gulp`: Build the site, watch for changes, and start a simple HTTP server
  (on port 4000) serving the site with live reload.
- `$ gulp analyze:a11y`: Test the website for accessibility issues.
- `$ gulp analyze:perf`: Do a performance check on the sites landing page.
- `$ gulp build`: Build the project once.
- `$ gulp build:watch`: Build the project and watch for changes.
- `$ gulp clean`: Clean the project, removing all generated files.
- `$ gulp dist`: Build the project for distributing purposes.
- `$ gulp lint`: Lint the source code of the project.
- `$ gulp server`: Start a simple HTTP server (on port 4000) serving the site.
  Requires `$ gulp build` or `$ gulp dist` to be run beforehand.
- `$ gulp test`: Run the test suites of the project.

The result of commands that build the site can be found in `./_site`. The result
of commands that analyze the source code can be found in `./_reports`.

[aXe]: https://www.axe-core.org/
[browser-sync]: https://browsersync.io/
[Gulp]: https://gulpjs.com/
[PostCSS]: https://postcss.org/
[htmllint]: http://htmllint.github.io/
[JSHint]: https://jshint.com/
[jsonlint]: https://github.com/zaach/jsonlint
[Lighthouse]: https://github.com/GoogleChrome/lighthouse
[Handlebars.js]: https://handlebarsjs.com/
[stylelint]: https://stylelint.io/
[Jest]: https://jestjs.io/
[markdownlint]: https://github.com/DavidAnson/markdownlint
