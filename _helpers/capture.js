// TODO: add support for non-block expressionss

module.exports = function(name, options) {
  this[name] = options.fn(this).trim();
}
