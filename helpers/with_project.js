/* jshint node: true */

const projects = require('../data/portfolio.json');

module.exports = function(categoryId, projectName, options) {
  for (let category of projects[categoryId]) {
    if (category.items) {
      for (let project of category.items) {
        if (project.name === projectName) {
          this.project = project;
          return options.fn(this);
        }
      }
    } else if (category.name === projectName) {
      this.project = category;
      return options.fn(this);
    }
  }

  throw new Error(`Project with name "${projectName}" not found`);
};
