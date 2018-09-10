module.exports = function(name, options) {
  this[name] = options.fn(this).trim();
}
