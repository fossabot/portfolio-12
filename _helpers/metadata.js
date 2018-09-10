const metadata = require('./metadata.json');

module.exports = function(key, item) {
  return metadata[key][item];
}
