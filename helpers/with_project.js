/* jshint node: true */

const contributions = require('../data/contributions.json');
const projects = require('../data/projects.json');
const snippets = require('../data/snippets.json');

let categories = {contributions, projects, snippets};

module.exports = function(category, name, options) {
  for (let project of categories[category]) {
    if (project.name === name) {
      this.project = project;
      return options.fn(this);
    }
  }

  throw new Error(`Project with name "${name}" not found`);
};
