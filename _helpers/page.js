const path = require('path');

module.exports = function(name, value, options) {
  this.page = this.page || {};
  this.page[name] = value;

  // Find the relative URL for this file
  let cwd = options.data.file.cwd;
  let filepath = options.data.file.path;
  let fileext = path.extname(filepath);
  this.page.url = filepath.slice(cwd.length, -fileext.length);
}
