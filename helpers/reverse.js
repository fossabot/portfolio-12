/* jshint node: true */

module.exports = function(val) {
  if (Array.isArray(val)) {
    val.reverse();
    return val;
  }
  if (val && typeof val === 'string') {
    return val.split('').reverse().join('');
  }
};
