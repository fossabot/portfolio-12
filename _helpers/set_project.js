const projects = require('../_data/portfolio.json');

module.exports = function(category, name) {
  let project;
  for (project of projects[category]) {
    if (project.name === name) break;
  }

  this.project = project;
}
