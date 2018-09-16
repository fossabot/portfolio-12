const metadata = require('../_data/metadata.json');

module.exports = function(key, item) {
  return `icon-${metadata[key].icon}`;
}
