/* jshint node: true */

let $currentValue = null;

module.exports = function(value, options) {
  let returnValue;
  if ($currentValue !== value) {
    $currentValue = value;
    if (options.fn) {
      returnValue = options.fn(this);
    } else {
      return true;
    }
  }

  if (options.data.last) $currentValue = null;
  return returnValue;
};
