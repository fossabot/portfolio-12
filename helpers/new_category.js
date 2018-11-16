/* jshint node: true */

let $currentValue = null;

module.exports = function(value, options) {
  let returnValue;
  if ($currentValue !== value) {
    $currentValue = value;
    returnValue = options.fn(this);
  }

  if (options.data.last) $currentValue = null;
  return returnValue;
};
