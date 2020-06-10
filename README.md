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

## Docker

To serve the portfolio from a [Docker] image run:

```bash
# Build the Docker image to run the portfolio
$ docker build -t portfolio-eric .

# Run the Docker image as a container to start a web server
$ docker run -d --rm -p 4000:4000 --name portfolio-server portfolio-eric

# Check the server logs
$ docker logs portfolio-server

# To stop the web server (and delete the container)
$ docker stop portfolio-server
```

Alternatively, you can use [Gulp] commands to execute the above commands:

- `gulp docker:build`: build the Docker image from the Dockerfile.
- `gulp docker:rmi`: remove the Docker image from the system.
- `gulp docker:start`: start a Docker container from the image.
- `gulp docker:stop`: stop (and remove) the Docker container.
- `gulp docker:logs`: shows the logs of the Docker container.
- `gulp docker:attach`: attach a shell to the Docker container.

[aXe]: https://www.axe-core.org/
[browser-sync]: https://browsersync.io/
[Docker]: https://www.docker.com/
[Gulp]: https://gulpjs.com/
[Handlebars.js]: https://handlebarsjs.com/
[htmllint]: http://htmllint.github.io/
[Jest]: https://jestjs.io/
[JSHint]: https://jshint.com/
[jsonlint]: https://github.com/zaach/jsonlint
[Lighthouse]: https://github.com/GoogleChrome/lighthouse
[markdownlint]: https://github.com/DavidAnson/markdownlint
[PostCSS]: https://postcss.org/
[stylelint]: https://stylelint.io/
