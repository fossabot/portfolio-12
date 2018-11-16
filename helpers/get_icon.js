/* jshint node: true */

const metadata = require('../data/metadata.json');

module.exports = function(key) {
  return `icon-${metadata[key].icon}`;
};
