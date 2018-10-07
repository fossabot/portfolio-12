const utils = require('handlebars-utils');

module.exports = function(options) {
  if (!utils.isOptions(options)) {
    throw new Error('page_url expects no arguments');
  }

  // Get the file path starting from the sites base
  let file = options.data.file
  let filePath = file.path.replace(file._base, '');

  // Convert the file path into a url path
  let urlPath = filePath.replace(/\..*$/, '')
                        .replace(/\\index/, '');

  // Return the constructed URL path, defaulting to the current directory
  return urlPath || '.';
}
