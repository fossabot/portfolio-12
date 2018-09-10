module.exports = function(name, value) {
  this.page = this.page || {};
  this.page[name] = value;
}
