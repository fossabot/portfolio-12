/* jshint node: true */

module.exports = function (val) {
  return val.toLowerCase().replace(/\s/g, '-').replace(/\.|&|\(|\)/g, '');
};
