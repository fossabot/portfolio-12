const metadata = require('../data/metadata.json');

module.exports = function(key, item) {
  return metadata[key][item];
}
