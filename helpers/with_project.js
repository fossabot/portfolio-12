/* jshint node: true */

const contributions = require('../data/contributions.json');
const events = require('../data/timeline.json');
const projects = require('../data/projects.json');
const snippets = require('../data/snippets.json');

let categories = {contributions, projects, snippets};

module.exports = function(categoryName, projectName, options) {
  if (categoryName === 'event') {
    for (let event of events) {
      if (event.title === projectName) {
        console.log(event);
        this.project = event;
        return options.fn(this);
      }
    }
  }

  let category = categories[categoryName];
  for (let projects of Object.values(category)) {
    for (let project of projects) {
      if (project.name === projectName) {
        this.project = project;
        return options.fn(this);
      }
    }
  }

  throw new Error(`Project with name "${projectName}" not found`);
};
