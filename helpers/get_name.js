/* jshint node: true */

const metadata = require('../data/metadata.json');

module.exports = function(key) {
  return metadata[key].name;
};
