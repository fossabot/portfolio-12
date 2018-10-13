const path = require('path');
const utils = require('handlebars-utils');

function get(key, options, self) {
  switch (key.toLowerCase()) {
    case 'url':
      // Get the file path starting from the sites base
      let file = options.data.file;
      let filePath = file.path.replace(file._base, '');

      // Convert the file path into a url path
      let urlPath = filePath.replace(/\..*$/, '')
                            .replace(/\\index/, '');

      // Return the constructed URL path, defaulting to the current directory
      return urlPath || '.';
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
