const path = require('path');
const utils = require('handlebars-utils');

function get(key, options, self) {
  switch (key.toLowerCase()) {
    case 'url':
      let cwd = options.data.file.cwd;
      let filepath = options.data.file.path;
      let fileext = path.extname(filepath);
      return filepath.slice(cwd.length, -fileext.length);
    default:
      return self.$page[key];
  }
}

function set(key, value, self) {
  self.$page = self.$page || { };
  self.$page[key] = value
}

module.exports = function(key, value) {
  if (utils.isOptions(value)) {
    let options = value;
    return get(key, options, this);
  } else {
    set(key, value, this);
  }
}
