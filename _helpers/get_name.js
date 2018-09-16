const metadata = require('../_data/metadata.json');

module.exports = function(key, item) {
  return metadata[key].name;
}
