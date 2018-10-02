const projects = require('../data/portfolio.json');

module.exports = function(category, name, options) {
  let project;
  for (let project of projects[category]) {
    if (project.name === name) {
      this.project = project;
      return options.fn(this);
    };
  }

  throw new Error(`Project with name "${name}" not found`);
}