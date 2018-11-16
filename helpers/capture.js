/* jshint node: true */

const utils = require('handlebars-utils');

module.exports = function(name, options) {
  if (!utils.isOptions(options)) {
    throw new Error('Capture expects only a name to store the variable');
  }

  this[name] = options.fn(this).trim();
};
