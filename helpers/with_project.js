const projects = require('../data/portfolio.json');

module.exports = function(category, name, options) {
  let project;
  for (project of projects[category]) {
    if (project.name === name) break;
  }

  this.project = project;
  return options.fn(this);
}
