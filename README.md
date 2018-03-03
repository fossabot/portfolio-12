# Portfolio
Repository for the personal portfolio of Eric Cornelissen.

### Build tools
| Functionality | Tool |
|---|---|
| Accessibility tester | [aXe](https://www.axe-core.org/) |
| CSS preprocessor | [Sass](http://sass-lang.com/) |
| HTML linter | [htmllint](http://htmllint.github.io/) |
| Iconography| [Fontello](http://fontello.com/) |
| JSON linter | [jsonlint](https://github.com/zaach/jsonlint) |
| Performance evaluator | [Lighthouse](https://github.com/GoogleChrome/lighthouse) |
| Site generator | [jekyll](https://jekyllrb.com/) |
| Style linter | [sass-lint](https://github.com/sasstools/sass-lint) |

###### How to use the build tools:
- `$ npm run axe`: Test the website for a11y issues. (requires `$ npm run dev`)
- `$ npm run build`: Build the project once.
- `$ npm run clean`: Clean the project, removing all generated files.
- `$ npm run dev`: Build the project and watch for changes.
- `$ npm run lighthouse`: Do a performance check on the sites landing page. (requires `$ npm run dev`)
- `$ npm run lint`: Lint the source code of the project. (requires `$ npm run build`)
